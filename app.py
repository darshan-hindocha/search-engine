from flask import Flask, abort
from flask_restful import Resource, Api, reqparse

from search import SearchEngine, Library

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()

lib = Library('data')
print("this ran line 12 of app.py")
search = SearchEngine(lib)

class SearchEndpoint(Resource):
    def get(self):
        return {'message': 'Hello, World!'}
    def post(self):
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



class DocumentAccessEndpoint(Resource):
    def post(self):
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

api.add_resource(SearchEndpoint, '/api/search')
api.add_resource(DocumentAccessEndpoint, '/api/document')

if __name__ == '__main__':
    app.run(debug=True)
