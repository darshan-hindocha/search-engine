import {NextApiRequest, NextApiResponse} from "next";
import axios, {AxiosRequestConfig} from "axios";

export type SearchResultV2 = {
    "book_title": string,
    "chapter_title": string,
    "index": number,
    "paragraph_index": number,
    "sentence_index": number,
    "text": string
}

type Response = {
    searchResultItems: SearchResultV2[];
}

type ErrResponse = {
    error: string;
}


export default async (req: NextApiRequest, res: NextApiResponse<Response | ErrResponse>) => {

 if (req.method === 'POST') {
        const axiosResponse = await search(req.body.query, req.body.limit, req.body.offset);

        const response = axiosResponse['results'] as SearchResultV2[];

        res.status(200).json({
            searchResultItems: response
        });
    } else {
        res.status(405).json({
            error: 'Method not allowed'
        });
    }

};


function search(query: string, limit: number, offset: number) {
    var data = JSON.stringify({
        "query": query,
        "limit": limit,
        "offset": offset
    });

    var base = ""
    if (process.env.VERCEL_ENV === 'development') {
        base = 'http://127.0.0.1:5000'
    } else {
        base = process.env.SEARCH_ENDPOINT_AUTH ? process.env.SEARCH_ENDPOINT_AUTH : ''
    }

    var config: AxiosRequestConfig<any> = {
        method: 'post',
        url: base + '/v2/api/search',
        headers: {
            'Authorization': base,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            if (!response.data) {
                return "Nothing found"
            }
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
            console.log("error unwrapping axios response")
            return error;
        })
}

