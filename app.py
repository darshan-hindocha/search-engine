from flask import Flask, abort, request
from flask_restful import reqparse
from socket import gethostname
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy import desc, Index
from typing import List
import json, os
from dotenv import load_dotenv

load_dotenv()

from search import SearchEngine, Library

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI")

db = SQLAlchemy(app)


class TSVector(sa.types.TypeDecorator):
    impl = TSVECTOR

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    chapters = db.relationship('Chapter', backref='book', lazy=True)

    def __repr__(self):
        return ''.join([
            'Title: ',
            self.title
        ])

    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def add_chapters_to_book(self, _book_id, _chapters):
        for chapter in _chapters:
            self.chapters.append(chapter)
        db.session.commit()

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    chapter_number = db.Column(db.Integer, nullable=False)
    paragraphs = db.relationship('Paragraph', backref='chapter', lazy=True)

    def __repr__(self):
        return ''.join([
            'Chapter Title: ', self.title,
        ])

    def __init__(self, _book_id, _title, _chapter_number):
        self.book_id = _book_id
        self.title = _title
        self.chapter_number = _chapter_number


    def add_paragraphs_to_chapter(self, _chapter_id, _paragraphs):
        for paragraph in _paragraphs:
            self.paragraphs.append(paragraph)
        db.session.commit()

class Paragraph(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    sentences = db.relationship('Sentence', backref='paragraph', lazy=True)

    def __repr__(self):
        return ''.join([
            'Paragraph Number: ', self.text,
        ])

    def __init__(self, _book_id, _chapter_id, _text):
        self.book_id = _book_id
        self.chapter_id = _chapter_id
        self.text = _text

    def add_sentences_to_paragraph(self, _paragraph_id, _sentences):
        paragraph = Paragraph.query.get(_paragraph_id)
        for sentence in _sentences:
            paragraph.sentences.append(sentence)
        db.session.commit()

class Sentence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    paragraph_id = db.Column(db.Integer, db.ForeignKey('paragraph.id'), nullable=False)
    __ts_vector__ = db.Column(TSVector(),db.Computed(
         "to_tsvector('english', text)",
         persisted=True))
    __table_args__ = (Index('ix_video___ts_vector__',
          __ts_vector__, postgresql_using='gin'),)

    def __repr__(self):
        return ''.join([
            'Content: ', self.text,
        ])

    def __init__(self, _book_id, _chapter_id, _paragraph_id, _text):
        self.book_id = _book_id
        self.chapter_id = _chapter_id
        self.paragraph_id = _paragraph_id
        self.text = _text



@dataclass
class SentenceInput:
    text: str

@dataclass
class ParagraphInput:
    text: str
    sentences: List[SentenceInput]

@dataclass
class ChapterInput:
    title: str
    paragraphs: List[ParagraphInput]

@dataclass
class BookInput:
    title: str
    author: str
    year: int
    chapters: List[ChapterInput]


def load_database_from_json(folder_path: str):
    for file in os.listdir(folder_path):
        if file.endswith(".json"):
            with open(folder_path + file, 'r') as f:
                json_book = BookInput(**json.load(f))
                book = Book(json_book.title, json_book.author, json_book.year)
                db.session.add(book)
                db.session.commit()
                for i in range(len(json_book.chapters)):
                    chapter = Chapter(book.id, json_book.chapters[i]["title"], i)
                    db.session.add(chapter)
                    db.session.commit()
                    for j in range(len(json_book.chapters[i]["paragraphs"])):
                        paragraph = Paragraph(book.id, chapter.id, json_book.chapters[i]["paragraphs"][j]["text"])
                        db.session.add(paragraph)
                        db.session.commit()
                        for sentence in json_book.chapters[i]["paragraphs"][j]["sentences"]:
                            sentence = Sentence(book.id, chapter.id, paragraph.id, sentence)
                            db.session.add(sentence)
                            db.session.commit()
                            paragraph.add_sentences_to_paragraph(paragraph.id, [sentence])
                        chapter.add_paragraphs_to_chapter(chapter.id, [paragraph])
                    book.add_chapters_to_book(book.id, [chapter])




parser = reqparse.RequestParser()

## V1 --------------------------------

@app.route('/')
def hello_world():
    return 'Hello World!'


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
            'results': []
        }

        for i, (r, s, d) in enumerate(results):
            res['results'].append({
                'score': s,
                'result': r,
                'document': d,
                'index': i + 1
            })
        return res
    else:
        return {'message': 'Hello, World!'}

@app.route('/api/get-name-of-docs-in-library', methods=['GET'])
def get_num_docs():
    return {'num_docs': lib.document_ids}

@app.route('/api/document', methods=['GET', 'POST'])
def document():
    if request.method == 'POST':
        parser.add_argument('document_index')
        parser.add_argument('paragraph_index')
        parser.add_argument('num_lines')
        args = parser.parse_args()

        paragraph_index = int(args['paragraph_index'])
        num_lines = int(args['num_lines'])
        if args['document_index'] not in lib.set_document_ids:
            # TODO: suggest similar documents
            abort(400, 'document_index not found in library')
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


## V2 --------------------------------

@app.route('/load', methods=['GET'])
def reset_db():
    db.drop_all()
    db.create_all()
    load_database_from_json('data/json_data/')
    return "Database loaded successfully"


def full_text_search(search_term: str, limit: int = 10, offset: int = 0):
    return Sentence.query.filter(
        Sentence.__ts_vector__.match(search_term)
    ).limit(limit).offset(offset).all()


@app.route('/v2/api/search', methods=['GET', 'POST'])
def searchV2():
    if request.method == 'POST':
        parser.add_argument('query')
        parser.add_argument('limit')
        parser.add_argument('offset')
        args = parser.parse_args()

        sentences = full_text_search(args.query, limit=args.limit, offset=args.offset)

        res = {
            'query': args['query'],
            'results': []
        }

        for i, sentence in enumerate(sentences):
            res['results'].append({
                'text': sentence.text,
                'book_title': sentence.paragraph.chapter.book.title,
                'chapter_title': sentence.paragraph.chapter.title,
                'paragraph_index': sentence.paragraph.id,
                'sentence_index': sentence.id,
                'index': i + 1
            })
        return res
    else:
        return {'message': 'Hello, World!'}


if __name__ == '__main__':
    if 'liveconsole' not in gethostname():
        app.run(debug=True)
