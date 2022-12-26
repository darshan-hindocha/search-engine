from flask import Flask, abort, request
from flask_restful import reqparse
from socket import gethostname
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import TSVECTOR, UUID
from sqlalchemy import desc, Index
from typing import List
import json, os
from dotenv import load_dotenv
import uuid

load_dotenv()

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

    def get_book(self):
        return Book.query.get(self.book_id)

    def get_chapter(self):
        return Chapter.query.get(self.chapter_id)

    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    paragraph_id = db.Column(db.Integer, db.ForeignKey('paragraph.id'), nullable=False)
    __ts_vector__ = db.Column(TSVector(), db.Computed(
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


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text, nullable=False)
    documents = db.relationship('Document', backref='user', lazy=True)

    def __repr__(self):
        return ''.join([
            'User: ',
            self.name
        ])

    def __init__(self, name, uid):
        self.name = name
        self.uid = uid

    def add_document_to_user(self, document):
        self.documents.append(document)
        db.session.commit()


class Document(db.Model):
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    extracts = db.relationship('Extract', backref='document', lazy=True)

    def __repr__(self):
        return ''.join([
            'Document: ',
            self.name
        ])

    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name
        self.uuid = str(uuid.uuid4())

    def add_extract(self, extract):
        if extract in self.extracts:
            return
        self.extracts.append(extract)
        db.session.commit()
        return


class Extract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('document.uuid'), nullable=False)

    def get_document(self):
        return Document.query.get(self.document_uuid)

    paragraph_id = db.Column(db.Integer, db.ForeignKey('paragraph.id'), nullable=False)
    sentence_id = db.Column(db.Integer, db.ForeignKey('sentence.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    book_title = db.Column(db.Text, nullable=False)
    chapter_title = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return ''.join([
            'Extract: ',
            self.text
        ])

    def __init__(self, document_uuid, sentence: Sentence):
        self.document_uuid = document_uuid
        self.user_id = Document.query.get(document_uuid).user_id

        self.paragraph_id = sentence.paragraph_id,
        self.sentence_id = sentence.id,

        self.text = sentence.text
        self.book_title = sentence.get_book().title,
        self.chapter_title = sentence.get_chapter().title,


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
                    if "sections" in json_book.chapters[i]:
                        for k in range(len(json_book.chapters[i]["sections"])):
                            for j in range(len(json_book.chapters[i]["sections"][k]["paragraphs"])):
                                paragraph = Paragraph(book.id, chapter.id,
                                                      json_book.chapters[i]["sections"][k]["paragraphs"][j]["text"])
                                db.session.add(paragraph)
                                db.session.commit()
                                for sentence in json_book.chapters[i]["sections"][k]["paragraphs"][j]["sentences"]:
                                    sentence = Sentence(book.id, chapter.id, paragraph.id, sentence['content'])
                                    db.session.add(sentence)
                                    db.session.commit()
                                    paragraph.add_sentences_to_paragraph(paragraph.id, [sentence])
                                chapter.add_paragraphs_to_chapter(chapter.id, [paragraph])
                    else:
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


## V2 --------------------------------

@app.route('/load', methods=['GET'])
def reset_db():
    db.drop_all()
    db.create_all()
    load_database_from_json('../data/json_data/')
    return "Database loaded successfully"


def full_text_search(search_term: str, limit: int = 10, offset: int = 0):
    # TODO: handle multi word query
    return Sentence.query.filter(
        Sentence.__ts_vector__.match(search_term)
    ).all()


@app.route('/v2/api/search', methods=['GET', 'POST'])
def searchV2():
    if request.method == 'POST':
        parser.add_argument('query')
        parser.add_argument('limit', default=10)
        parser.add_argument('offset', default=0)
        args = parser.parse_args()

        sentences = full_text_search(args.query)

        res = {
            'query': args['query'],
            'quantity': len(sentences),
            'results': []
        }

        allowable_range = range(args.offset, args.offset+args.limit)
        for i, sentence in enumerate(sentences):
            if i in allowable_range:
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


@app.route('/v2/api/register-user', methods=['GET', 'POST'])
def register_user():
    try:
        parser.add_argument('name')
        parser.add_argument('uid')
        args = parser.parse_args()

        u = User.query.filter_by(uid=args.uid).all()
        if u is not None:
            return {'message': 'User already exists', 'registered': True}
        user = User(args.name, args.uid)
        db.session.add(user)
        db.session.commit()
        return {'message': 'User registered successfully', 'registered': True}
    except:
        db.session.rollback()
        return {'message': 'register-user api failed'}


@app.route('/v2/api/get-users-documents', methods=['GET', 'POST'])
def get_users_documents():
    parser.add_argument('uid')
    args = parser.parse_args()

    user = User.query.filter_by(uid=args.uid).first()
    if user is None:
        user = User("", args.uid)
        db.session.add(user)
        db.session.commit()

    documents = user.documents

    res = {
        'user_id': args['uid'],
        'documents': []
    }

    for i, document in enumerate(documents):
        res['documents'].append({
            'document_uuid': document.uuid,
            'document_name': document.name,
            'number_of_extracts': len(document.extracts),
            'index': i + 1
        })
    return res


@app.route('/v2/api/create-document', methods=['GET', 'POST'])
def create_document():
    @dataclass
    class CreateDocumentInput:
        document_name: str
        uid: str

    parser.add_argument('document_name')
    parser.add_argument('uid')
    args: CreateDocumentInput = parser.parse_args()
    user: User = User.query.filter_by(uid=args.uid).first()
    if user is None:
        return {'message': 'User not found'}, 404

    document: Document = Document(user.id, args.document_name)
    db.session.add(document)
    db.session.commit()
    return {'document_uuid': document.uuid}


@app.route('/v2/api/add-extract-to-document', methods=['GET', 'POST'])
def add_extract_to_document():
    @dataclass
    class AddExtractToDocumentInput:
        sentence_index: str
        uid: str
        document_uuid: str
        document_name: int

    # TODO: protect against duplicates
    parser.add_argument('sentence_index')
    parser.add_argument('uid')
    parser.add_argument('document_uuid')
    parser.add_argument('document_name')
    args: AddExtractToDocumentInput = parser.parse_args()

    user: User = User.query.filter_by(uid=args.uid).first()
    if user is None:
        abort(400, 'user_id not found in database')

    sentence: Sentence = Sentence.query.filter_by(id=args.sentence_index).first()
    if sentence is None:
        abort(400, 'sentence not found in database')

    if args.document_uuid is None or args.document_uuid == "":
        document = Document(user.id, args.document_name)
        db.session.add(document)
    else:
        document: Document = Document.query.get(args.document_uuid)
    extract: Extract = Extract(document.uuid, sentence)
    db.session.add(extract)

    document.add_extract(extract)
    db.session.add(document)
    db.session.commit()

    return {
        'document_uuid': document.uuid,
    }


@app.route('/v2/api/get-document', methods=['GET', 'POST'])
def get_document():
    parser.add_argument('document_uuid')
    args = parser.parse_args()

    document: Document = Document.query.get(args.document_uuid)
    if document is None:
        abort(400, 'document not found in database')

    extracts: List[Extract] = document.extracts

    res = {
        'document_uuid': args['document_uuid'],
        'document_name': document.name,
        'extracts': []
    }

    for i, extract in enumerate(extracts):
        res['extracts'].append({
            'text': extract.text,
            'book_title': extract.book_title,
            'chapter_title': extract.chapter_title,
            'paragraph_index': extract.paragraph_id,
            'sentence_index': extract.sentence_id,
            'index': i + 1
        })
    return res



if __name__ == '__main__':
    if 'liveconsole' not in gethostname():
        app.run(debug=True, port=5000)
        reset_db()
