import heapq
import pprint

def break_down_data(data_path):
    '''
    Input data will be a path to a folder with text files
    Ingest Text Files as a dictionary of lists (since the text data does not need later inserts we can use a list)
    Each list will be a list of strings for each paragraph (40 words per paragraph)
    '''

    data = {}
    import os, re
    for file in os.listdir(data_path):
        if file.endswith(".txt"):
            with open(os.path.join(data_path, file)) as f:
                lines = f.read()
                lines  = lines.replace('\n', ' ')
                lines = lines.split('.')
                lines = [line for line in lines if line not in [' ','']]
                data.update({file[:-4]: {'paragraphs': lines}})

    return data

import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
def remove_stop_words(list_of_words):
    text = [word for word in list_of_words if word not in stopwords.words('english')]
    return text

import re
def lower_case_alphanumeric(list_of_words):
    pattern = re.compile('[\W_]+')
    text = []
    for word in list_of_words:
        word = pattern.sub('', word).lower()
        if word:
            text.append(word)

    return text

def preprocess_data_in_libary(data):

    for document_index in list(data.keys()):
        for paragraph_index in range(len(data[document_index]['paragraphs'])):
            paragraph = data[document_index]['paragraphs'][paragraph_index].split(' ')

            ## Only lowercase alphanumeric characters
            paragraph = lower_case_alphanumeric(paragraph)

            ## Remove stop words
            paragraph = remove_stop_words(paragraph)

            data[document_index]['paragraphs'][paragraph_index] = paragraph

    return data

class Library:
    def __init__(self, data_source):
        self.original = break_down_data(data_source)
        self.data = break_down_data(data_source)
        self.document_ids = list(self.data.keys())

    # Get Indexes for looping through the documents and paragraphs
    def get_document_ids(self):
        return self.document_ids

    def get_paragraph_ids_from_document(self, document_id):
        return len(self.data[document_id]['paragraphs'])

    # Get documents and paragraphs from the library
    def get_document(self, document_id):
        return self.data[document_id]

    def get_paragraph_from_document(self, document_id, paragraph_id):
        return self.data[document_id]['paragraphs'][paragraph_id]

    def get_original_paragraph_from_document(self, document_id, paragraph_id):
        return self.original[document_id]['paragraphs'][paragraph_id]


from thefuzz import fuzz
class SearchEngine:
    def __init__(self, Library: Library):
        ## The paragraph results based on relevancy
        self.results = []
        self.library = Library
        self.scores = {}


    def preprocess_query(self, query):
        query = query.split(' ')
        ## Remove stop words
        query = remove_stop_words(query)
        ## Lowercase alphanumeric characters
        query = lower_case_alphanumeric(query)

        return query


    def search_library(self):
        for document_id in self.library.get_document_ids():
            self.search_document(document_id)

    def search_document(self, document_index):
        for paragraph_index in range(self.library.get_paragraph_ids_from_document(document_index)):
            self.search_paragraph(document_index, paragraph_index)

    def search_paragraph(self, document_index, paragraph_index):
        p = self.library.get_paragraph_from_document(document_index, paragraph_index)
        score = fuzz.token_set_ratio(p, self.query['original'])

        self.scores[(document_index, paragraph_index)] = score
        heapq.heappush(self.results, (-score, (document_index, paragraph_index)))
        while len(self.results) > 10:
            heapq.heappop(self.results)

    def search_bag_of_words(self):
        return

    def search(self, query):
        ## Store Query and Lemmatised Query
        self.query = {
        'original': query,
        'lemQ': self.preprocess_query(query),
        }
        self.search_library()
        # self.search_bag_of_words() COMING IN NEXT VERSION!
        results = []
        for _ in range(10):
            score, (document_index, paragraph_index) = heapq.heappop(self.results)
            score = -score
            item = self.library.get_original_paragraph_from_document(document_index, paragraph_index)
            results.append((item,score))
        return results


def main():

    lib = Library('testdata')
    search = SearchEngine(lib)
    query = 'covered amiable greater'
    res = search.search(query)

    for (r,s) in res:
        print('================================================================')
        print('Query: ', query)
        print('Score: ', s)
        pprint.pprint(r)

if __name__ == '__main__':
    main()


