import type {NextPage} from 'next'
import {SetStateAction, useState} from "react";
import Container from "../Components/Container";
import {TextField} from "@mui/material";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import cn from 'classnames';
import axios from 'axios';
import {SearchResultV2} from "./api/searchV2";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

type Response = {
    data: {
        'query': string,
        'searchResultItems': SearchResultV2[];
    };
    status: number;
}
export const getServerSideProps = withPageAuthRequired();

//@ts-ignore
const Home: NextPage = ({user}) => {
    const [query, setQuery] = useState("");
    const [nothingFound, setNothingFound] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResultV2[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        axios.post('/api/searchV2', {
            query
        }, {
            headers: {
                'Authorization': `Bearer `
            }
        }).then((res: Response) => {
            setLoading(false);
            setSearchResults(res.data.searchResultItems);
            if (res.data.searchResultItems.length === 0) {
                setNothingFound(true)
            }
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
                    label={"Enter Search Query"}
                    variant="outlined"
                    className="w-full"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
                <div>
                    <LoadingButton
                        className={cn(
                            (!query) ? 'opacity-50 cursor-not-allowed' : '',
                            "h-full bg-green-mid text-white"
                        )}
                        size="small"
                        onClick={handleSubmit}
                        endIcon={<SendIcon/>}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                        disabled={!query}
                    >
                        Search
                    </LoadingButton>
                </div>
            </div>
            <div className="flex flex-col gap-12 mt-4">
                {nothingFound && <h4>Nothing Found :(</h4>}
                {(searchResults) && (
                    searchResults.map(({
                                           book_title,
                                           chapter_title,
                                           index,
                                           paragraph_index,
                                           sentence_index,
                                           text
                                       }: {
                                           book_title: string,
                                           chapter_title: string,
                                           index: number,
                                           paragraph_index: number,
                                           sentence_index: number,
                                           text: string
                                       },
                    ) => (
                        <div
                            key={sentence_index.toString() + paragraph_index.toString() + index.toString()}
                            className="flex flex-row space-between"
                        >
                            <div className="flex flex-col w-4/5">
                                <div className="flex flex-row items-center py-2">
                                    <p className="opacity-70 text-sx py-1">{chapter_title}</p>
                                    <ArrowForwardIosIcon style={{fontSize: "small"}} />
                                    <p className="text-grey-500 opacity-50 py-1 text-sx">{book_title}</p>
                                </div>
                                <p>{text}</p>
                            </div>
                            <div className="flex pt-1 h-full items-center justify-center">
                                <Button endIcon={<AddIcon/>}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    )))}
            </div>

        </Container>
    )
}

export default Home
