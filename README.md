# Search Engine

## Setup

To run the search engine, set up a virtual environment and install the requirements.

You can install the requirements using

```bash
pip install -r /path/to/requirements.txt
```

Then run the search engine using

```bash
python /path/to/app.py
```

Once the search engine is running, you can access it at `http://127.0.0.1:5000`.

At the time of writing, the available api endpoints are:
- GET '/api/search' - returns a hello world json
- POST '/api/search' - returns a json of the search results with input: { "query": "put your query here" }

http://127.0.0.1:5000/api/search


## Things that are likely to be out of date

- API Spec details of the API endpoints, including the request and response bodies
- Requirements.txt the list of dependencies for the search engine may be out of date

## Deployment

Deployed using pythonanywhere (which is awesome, go check it out). The pythonanywhere server is protected with a username and password, as a makeshift beta. Get it in touch with me if you want the credentials to interact with the APIs :) 
