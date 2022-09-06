import type {NextPage} from 'next'
import {SetStateAction, useState} from "react";
import Container from "../Components/Container";
import {useAuthContext} from "../context/auth";
import {TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import cn from 'classnames';
import axios from 'axios';
import {SearchResult} from "./api/search";

type Response = {
    data: {
        'query': string,
        'searchResultItems': SearchResult[];
    };
    status: number;
}


const Home: NextPage = () => {
    const {auth, setAuth, setApproved, approved, uid, setUid} = useAuthContext();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        axios.post('/api/search', {
            query
        }, {
            headers: {
                'Authorization': `Bearer ${auth ? uid : ''}`
            }
        }).then((res: Response) => {
            setLoading(false);
            setSearchResults(res.data.searchResultItems);
        }).catch((err: { error: string; }) => {
            setLoading(false);
            alert(err.error);
        });
    };

    return (
        <Container>
            <h1>Search Engine <span
                className="italic text-green-mid align-middle text-baseDesktop">(NOT EVEN BETA)</span></h1>

            <p className="mt-4">
                A search engine for your content
            </p>
            <div className="flex w-full mt-4 gap-2">
                <TextField
                    id="search"
                    label={auth ? "Enter Search Query" : "Login to Search"}
                    variant="outlined"
                    disabled={!auth || !approved}
                    className="w-full"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
                <div>
                    <LoadingButton
                        className={cn(
                            (!auth || !approved || !query) ? 'opacity-50 cursor-not-allowed' : '',
                            "h-full bg-green-mid text-white"
                        )}
                        size="small"
                        onClick={handleSubmit}
                        endIcon={<SendIcon/>}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                        disabled={!auth || !approved || !query}
                    >
                        Search
                    </LoadingButton>
                </div>
            </div>
            <div>
                {!auth && !approved && (
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="text-red-500">
                            In order to access the features of this search engine you must:
                        </p>
                        <ul className="list-disc list-inside text-red-500">
                            <li>Log in with your Google account</li>
                            <li>Wait for approval from the admin</li>
                        </ul>
                        <p>
                            Please Note, access is limited at the moment.
                        </p>
                        <p>
                            We will expand access once we come out of beta.
                        </p>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-8 mt-4">
                {(searchResults) && (
                    searchResults.map(({
                                           result,
                                           score,
                                           document: {
                                               document_index
                                           }
                                       }: {
                                           result: string,
                                           score: number,
                                           document: {
                                               document_index: string
                                           }
                                       },
                                       index: number
                    ) => (
                        <div key={result} className="flex flex-col">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3>{(index + 1) + '. ' + document_index}</h3>
                                </div>
                                <h4 className="text-green-mid">{'Score: ' + score}</h4>
                            </div>
                            <div className="flex items-center gap-4">

                                <p className="">{result}</p>
                            </div>
                        </div>
                    )))}
            </div>

        </Container>
    )
}

export default Home
