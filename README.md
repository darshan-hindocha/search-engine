# Search Engine

## Setup

To run the search engine, set up a virtual environment and install the requirements.

You can install the requirements using

```bash
pip install -r /path/to/requirements.txt
```

Then run the search engine using

```bash
python /path/to/search.py
```

Once the search engine is running, you can access it at `http://127.0.0.1:5000`.

At the time of writing, the available api endpoints are:
- GET '/api/search' - returns a hello world json
- POST '/api/search' - returns a json of the search results with input: { "query": "put your query here" }

http://127.0.0.1:5000/api/search


# Some Prior Brainstorming, Slightly out of date

## Technical Requirements
* Fast read access to the index
* Fast search
* Update speed not a priority
* Search results are grouped by type and sorted by relevancy
* Search results are returned in segments
* Documents are large books
* Export book, pages, and search results to PDF
* Searches can be saved and shared via link


## Glossary
* Analysis: turn document into searchable index
* Corpus: collection of documents
* Document: can be anything!
* Fields: like metadata for your documents
* Reverse index: corpus of words and how much it appears in docs + other info
* Indexing: processing of examining a document and reverse indexing it
* Postings: info inside the reverse index
* Forward index: the corpus of a doc