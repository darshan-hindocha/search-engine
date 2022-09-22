import {NextApiResponse} from "next";
import axios, {AxiosRequestConfig} from "axios";

//@ts-ignore
export default async (req: Req, res: NextApiResponse) => {
    var base = ""
    if (process.env.VERCEL_ENV === 'development') {
        base = 'http://127.0.0.1:5001'
    } else {
        base = process.env.SEARCH_ENDPOINT_AUTH ? process.env.SEARCH_ENDPOINT_AUTH : ''
    }
    var config: AxiosRequestConfig<any> = {
        method: 'post',
        url: base + req.body.url,
        headers: {
            'Authorization': base,
            'Content-Type': 'application/json'
        },
    };


    if (req.body?.data) {
        config.data = req.body.data
    }

    const axiosResponse = await callServer(config);

    res.status(200).json(axiosResponse)
};

function callServer(config: AxiosRequestConfig<any>) {
    return axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        })
}
