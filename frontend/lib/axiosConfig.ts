import axios, {AxiosRequestConfig} from "axios";
import {Fetcher} from "swr";


export function getFetcher({
                               method,
                               url,
                               data
                           }: { method: 'post' | 'get', url: string, data: any | null }) {


    const fetcher: Fetcher = ({url, method, data}: { method: 'post' | 'get', url: string, data: any | null }) => {
        const config: AxiosRequestConfig<any> = {
            method: 'post',
            url: '/api/v2',
            headers: {
                'Authorization': '',
                'Content-Type': 'application/json',
            },
            data: {
                method: method,
                url: url,
                headers: {
                    'Authorization': process.env.SEARCH_ENDPOINT_AUTH ? process.env.SEARCH_ENDPOINT_AUTH : '',
                    'Content-Type': 'application/json',
                },
            }
        }
        if (data) {
            config.data.data = data;
        }
        return axios(config)
            .then((res) => {
                return res.data;
            })
            .catch((err: { error: string; }) => {
                return err
            });
    }

    return fetcher({url, method, data});
}


export async function fetchIt({
                                  method,
                                  url,
                                  data
                              }: { method: 'post' | 'get', url: string, data: any | null }) {
    const config: AxiosRequestConfig<any> = {
        method: 'post',
        url: '/api/v2',
        headers: {
            'Authorization': '',
            'Content-Type': 'application/json',
        },
        data: {
            method: method,
            url: url,
            headers: {
                'Authorization': process.env.SEARCH_ENDPOINT_AUTH ? process.env.SEARCH_ENDPOINT_AUTH : '',
                'Content-Type': 'application/json',
            },
        }
    }
    if (data) {
        config.data.data = data;
    }
    return await axios(config)

}