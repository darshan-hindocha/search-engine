import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import CustomDialogActions from "../Components/Accessories/CustomDialogActions";
import Container from "../Components/Container";
import {TextField} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import cn from 'classnames';
import axios from 'axios';
import {SearchResultV2} from "./api/searchV2";
import {GetStaticProps} from "next";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {QuoteToAdd} from "../Components/Accessories/CustomButtonGroup";

type Response = {
    data: {
        'query': string,
        'quantity': number,
        'searchResultItems': SearchResultV2[];
    };
    status: number;
}

// export const getServerSideProps = withPageAuthRequired();

//@ts-ignore
const Home: NextPage = ({user}) => {
    const [query, setQuery] = useState("");
    const [listOfDocuments, setListOfDocuments] = useState<Array<{ docName: string, docUUID: string }>>([])
    const [searchResults, setSearchResults] = useState<SearchResultV2[] | null>();
    const [searchResultsQuantity, setSearchResultsQuantity] = useState(0)
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [quoteToAdd, setQuoteToAdd] = useState<QuoteToAdd>({
        bookTitle: "",
        chapterTitle: "",
        text: "",
        sentenceIndex: 0
    })
    const handleOpen = ({
                            bookTitle,
                            chapterTitle,
                            text,
                            sentenceIndex
                        }: {
        bookTitle: string,
        chapterTitle: string,
        text: string,
        sentenceIndex: number
    }) => {
        setOpenModal(true);
        setQuoteToAdd(p => ({
            ...p,
            ...{
                bookTitle,
                chapterTitle,
                text,
                sentenceIndex
            }
        }))
    }

    const handleClose = () => setOpenModal(false);


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
            setSearchResultsQuantity(res.data.quantity)
            if (res.data.searchResultItems.length === 0) {
                alert("Nothing Found")
            }
        }).catch((err: { error: string; }) => {
            setLoading(false);
            alert(err.error);
        });
    };

    useEffect(() => {
        setLoading(() => true)
        const req = {
            'url': '/v2/api/get-users-documents', 'data': {
                'uid': user.sid,
            }
        }

        axios.post('/api/v2', req)
            .then((res) => {
                setLoading(() => false)
                const docs: Array<{ docName: string, docUUID: string }> = []
                for (var i = 0; i < res.data.documents.length; i++) {
                    docs.push({
                        docName: res.data.documents[i].document_name,
                        docUUID: res.data.documents[i].document_uuid
                    })
                }
                setListOfDocuments(() => docs)
                return
            })
            .catch((err) => {
                setLoading(() => false)
                return err
            })
    }, []);

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
            {(searchResultsQuantity) > 0 && (
                <div className="py-4">
                    <p>Found {searchResultsQuantity} items</p>
                </div>
            )}
            <div className="flex flex-col gap-12 mt-4">
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
                            className="flex flex-col md:flex-row items-center space-between gap-4"
                        >
                            <div className="flex flex-col w-4/5">
                                <div className="flex flex-row items-center">
                                    <p className="opacity-70 text-sx">{book_title}</p>
                                    <ArrowForwardIosIcon className="mx-2" style={{fontSize: "small"}}/>
                                    <p className="text-grey-500 opacity-50 text-sx">{chapter_title}</p>
                                </div>
                                <div>
                                    <p>{text}... see more</p>
                                </div>
                            </div>
                            <div className="flex">
                                <Button
                                    className="self-center bg-green-mid opacity-70 text-white"
                                    variant={"contained"}
                                    onClick={() => handleOpen({
                                        bookTitle: book_title,
                                        chapterTitle: chapter_title,
                                        text: text,
                                        sentenceIndex: sentence_index
                                    })}
                                    endIcon={<AddIcon/>}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    )))
                }
                <Dialog open={openModal} onClose={handleClose} className="">
                    <DialogTitle style={{opacity: '50%'}}>Save this Extract to one of your Documents</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <em style={{color: '#151a22'}}>
                                {quoteToAdd.text}
                            </em>
                            <br/>
                            &#8212; {' '}
                            <span style={{color: '#151a22'}}>{quoteToAdd.chapterTitle}</span>
                            {', ' + quoteToAdd.bookTitle}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions
                        style={{
                            margin: '10px',
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: "10px"
                        }}
                    >
                        <CustomDialogActions
                            quoteToAdd={quoteToAdd}
                            listOfDocuments={listOfDocuments}
                            setListOfDocuments={setListOfDocuments}
                            uid={user.sid}
                        />
                    </DialogActions>
                </Dialog>
            </div>

        </Container>
    )
}

export default Home


export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            user: {
                sid: "46e7rfvb9n09jwnef"
            },
        },
    }
}