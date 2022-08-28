from flask import Flask
from flask_restful import Resource, Api, reqparse

from main import SearchEngine, Library

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()

lib = Library('testdata')
search = SearchEngine(lib)

class Message(Resource):
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

        for i, (r, s) in enumerate(results):
            res.update({
                'result_{}'.format(i+1): {
                    'score': s,
                    'result': r
                },
            })
        return res

api.add_resource(Message, '/api/search')

if __name__ == '__main__':
    app.run(debug=True)
