from flask import Flask, abort
from flask_restful import Resource, Api, reqparse

from search import SearchEngine, Library

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()

lib = Library('testdata')
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
            lib = Library('testdata')
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
        parser.add_argument('paragraph_index_first')
        parser.add_argument('paragraph_index_last')
        args = parser.parse_args()

        paragraph_start = int(args['paragraph_index_first'])
        paragraph_end = int(args['paragraph_index_last'])
        if paragraph_start > paragraph_end:
            abort(400, 'paragraph_index_first must be less than or equal to paragraph_index_last')


        try:
            size_of_document =len(lib.data[args['document_index']]['paragraphs'])
            if paragraph_end < 0 or paragraph_end >= size_of_document:
                abort(400, description='paragraph_index_first must be between 0 and {}'.format(size_of_document-1))
            content = lib.get_multiple_paragraphs_from_document(args['document_index'], paragraph_start, paragraph_end)
        except IndexError:
            return {'message': 'document_index or paragraph_index_first or paragraph_index_last is out of range'}

        return {
            'content': content,
            'document_index': args['document_index'],
            'paragraph_index_first': args['paragraph_index_first'],
            'paragraph_index_last': args['paragraph_index_last'],
        }

api.add_resource(SearchEndpoint, '/api/search')
api.add_resource(DocumentAccessEndpoint, '/api/document')
if __name__ == '__main__':
    app.run(debug=True)
