import typing

def extract_pdf_to_document(pdf_path: typing.AnyStr) -> typing.AnyStr:
    text_path = "path_to_text_document"
    return text_path

def index_text_document(text_path: typing.AnyStr) -> typing.AnyStr:
    index_path = "path_to_index_document"
    return index_path

engine_opts = {
    "extract_pdf": {
        "plain": lambda x: extract_pdf_to_document(x)
    },
    "index_doc": {
        "plain": lambda x: index_text_document(x)
    }
}

class Document:
    '''
    The document class provides access to the books, in pdf, text and indexed form.
    You can get the pdf, text and json.
    The operations you can apply on these documents is:
      - transform: pdf -> text -> index
      - get document at location
      -
    '''
    def __init__(self, extract_function="plain", index_function="plain"):
        # metadata
        self.title: typing.AnyStr = "title"

        # documents in db
        self.path = "document_path_prefix"
        self.pdf_path: typing.AnyStr = "path_to_pdf_document"
        self.text_path: typing.AnyStr = "path_to_text_document"
        self.index_path: typing.AnyStr = "path_to_idx_document"

        # engine customisation
        self.extract_pdf = engine_opts['extract_pdf'][extract_function]
        self.index_doc = engine_opts['index_doc'][index_function]

        # location mapping from indexed document to text document
        self.index_to_text_mapping = []
        # location mapping from stopword excluded document to text document
        self.sindex_to_text_mapping = []

    def create_index_from_pdf(self, pdf_path):
        self.pdf_path = pdf_path
        self.text_path = self.extract_pdf(self.pdf_path)
        self.index_path = self.index_doc(self.text_path)

    def get_paths(self):
        self.pdf_path = ""

class Library:
    def __init__(self):
        self.documents = []
