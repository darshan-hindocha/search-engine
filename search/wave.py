import json
from typing import List
from thefuzz import fuzz

def wave_search(query: str, indexed_document_path: str) -> List[tuple]:
    '''
    indexed document must be split as a list of words
    query must be a full string

    The wave search function takes in a space split query, and an indexed document path.
    The function slides the query across the indexed document, and calculates the token set score at each location.

    The output of a search function is a list of tuples with score and index.

    :param query: query in a single string
    :param indexed_document_path: path of indexed document which must be a list of words
    :return:
    '''
    width = len(query.split(' '))
    width += int(width/2)

    with open(indexed_document_path) as f:
        indexed_document = json.load(f)

    scores = []
    for i in range(len(indexed_document)-width):
        location = int(sum(i, i + width) / 2)
        text = indexed_document[i:i+width].join(' ')
        score = fuzz.token_sort_ratio(query, text)
        scores.append((score, location))

    return scores









