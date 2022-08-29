import {NextApiRequest, NextApiResponse} from "next";
import axios, {AxiosRequestConfig} from "axios";

export type SearchResult = {
    document: {
        document_index: string,
        num_lines: number,
        paragraph_index: number,
    },
    index: number,
    result: string,
    score: number,
}

type Response = {
    searchResultItems: SearchResult[];
}

type ErrResponse = {
    error: string;
}


export default async (req: NextApiRequest, res: NextApiResponse<Response | ErrResponse>) => {

    if (req.method === 'GET') {
        res.status(200).json({
            searchResultItems: [
                {
                    document: {
                        document_index: "Document Name",
                        num_lines: 1,
                        paragraph_index: 1,
                    },
                    index: 0,
                    result: "The search result",
                    score: 1,
                }
            ]
        });
    } else if (req.method === 'POST') {
        const axiosResponse = await search(req.body.query);

        console.log('axiosResponse', axiosResponse);

        const response = axiosResponse['results'] as SearchResult[];


        res.status(200).json({
            searchResultItems: response
        });
    } else {
        res.status(405).json({
            error: 'Method not allowed'
        });
    }

    try {
        res.json({
            'searchResultItems': [
                {
                    document: {
                        document_index: "Document Name",
                        num_lines: 1,
                        paragraph_index: 1,
                    },
                    index: 0,
                    result: "The search result",
                    score: 1,
                }
            ]
        });
    } catch (e) {
        res.status(400).json({error: (e as Error).message});
    }
};


function search(query: string) {
    var data = JSON.stringify({
        "query": "Swamishri smiled",
        "refresh": false
    });

    var config: AxiosRequestConfig<any> = {
        method: 'post',
        url: process.env.SEARCH_ENDPOINT + '/api/search',
        headers: {
            'Authorization': process.env.SEARCH_ENDPOINT_AUTH ? process.env.SEARCH_ENDPOINT_AUTH : '',
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        })
}

