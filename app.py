from flask import Flask, abort, request
from flask_restful import reqparse
from socket import gethostname

from search import SearchEngine, Library

app = Flask(__name__)

parser = reqparse.RequestParser()

@app.route('/api/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        global search
        parser.add_argument('query')
        parser.add_argument('refresh')
        args = parser.parse_args()
        if args['refresh'] == 'true':
            lib = Library('data')
            print("this ran line 25 of app.py")
            search = SearchEngine(lib)
            print("refreshed the search engine and library!")
        results = search.search(args['query'])

        res = {
            'query': args['query'],
        }

        for i, (r, s, d) in enumerate(results):
            res.update({
                'result_{}'.format(i+1): {
                    'score': s,
                    'result': r,
                    'document': d,
                },
            })
        return res
    else:
        return {'message': 'Hello, World!'}


@app.route('/api/document', methods=['GET', 'POST'])
def document():
    if request.method == 'POST':
        parser.add_argument('document_index')
        parser.add_argument('paragraph_index')
        parser.add_argument('num_lines')
        args = parser.parse_args()

        paragraph_index = int(args['paragraph_index'])
        num_lines = int(args['num_lines'])

        content = lib.get_paragraph_from_document(args['document_index'], paragraph_index, num_lines)

        return {
            'content': content,
            'document_index': args['document_index'],
            'paragraph_index': args['paragraph_index'],
            'num_lines': args['num_lines'],
        }
    else:
        return {'message': 'Hello, World!'}


def load_library():
    # TODO: Fix the issue where this runs twice on start
    if 'lib' in globals().keys():
        print('library already loaded')
        return
    global lib
    lib = Library('data')
    global search
    search = SearchEngine(lib)
    print("loaded the search engine and library!")

load_library()

if __name__ == '__main__':
    load_library()
    if 'liveconsole' not in gethostname():
        app.run(debug=True)
