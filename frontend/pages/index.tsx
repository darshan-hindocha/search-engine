import type {NextPage} from 'next'
import {SetStateAction, useEffect, useState} from "react";
import Container from "../Components/Container";
import {FormControl, TextField} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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


type QuoteToAdd = {
    text: string,
    chapterTitle: string,
    bookTitle: string,
    documentToAddToName: string,
    documentToAddToUUID: string,
}

export const getServerSideProps = withPageAuthRequired();

//@ts-ignore
const Home: NextPage = ({user}) => {
    const [query, setQuery] = useState("");
    const [listOfDocuments, setListOfDocuments] = useState<Array<{ docName: string, docUUID: string }>>([])
    const [selectedDocument, setSelectedDocument] = useState<{ docName: string, docUUID: string }>({
        docName: "",
        docUUID: ""
    })
    const [searchResults, setSearchResults] = useState<SearchResultV2[] | null>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = ({
                            bookTitle,
                            chapterTitle,
                            text
                        }: {
        bookTitle: string,
        chapterTitle: string,
        text: string
    }) => {
        setOpen(true);
        setQuoteToAdd(p => ({
            ...p,
            ...{
                bookTitle,
                chapterTitle,
                text
            }
        }))
    }

    const handleChange = (event: SelectChangeEvent) => {
        // @ts-ignore
        setSelectedDocument(p => ({
            ...p,
            ...{
                docUUID: event.target.value.toString(),
                docName: event.target.name
            }
        }))
    }

    const handleClose = () => setOpen(false);
    const [quoteToAdd, setQuoteToAdd] = useState<QuoteToAdd>({
        bookTitle: "",
        chapterTitle: "",
        documentToAddToName: "",
        documentToAddToUUID: "",
        text: ""
    })

    const handleAddToDocument = () => {

    }

    const handleCreateDocument = () => {

    }

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
                const docs: Array<{ docName: string, docUUID: string }> = [
                    {
                        docUUID: "0",
                        docName: "New Document"
                    }
                ]
                setSelectedDocument(() => docs[0])
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

                            className="flex flex-row items-center space-between"
                        >
                            <div className="flex flex-col w-4/5">
                                <div className="flex flex-row items-center py-2">
                                    <p className="opacity-70 text-sx py-1">{chapter_title}</p>
                                    <ArrowForwardIosIcon style={{fontSize: "small"}}/>
                                    <p className="text-grey-500 opacity-50 py-1 text-sx">{book_title}</p>
                                </div>
                                <p>{text}</p>
                            </div>
                            <div className="flex">
                                <Button
                                    className="self-center"
                                    onClick={() => handleOpen({
                                        bookTitle: book_title,
                                        chapterTitle: chapter_title,
                                        text: text
                                    })}
                                    endIcon={<AddIcon/>}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    )))}
                <Dialog open={open} onClose={handleClose} className="">
                    <DialogTitle>Save this Extract to a Collection</DialogTitle>
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
                    <DialogActions>
                        <FormControl fullWidth>
                            <InputLabel id="select-document-label">Select Document</InputLabel>
                            <Select
                                labelId="select-document-label"
                                value={selectedDocument.docUUID}
                                label="Select Document"
                                onChange={handleChange}
                            >
                                {listOfDocuments.map((d) => {
                                    // @ts-ignore
                                    return <MenuItem key={d.docUUID}
                                                     name={d.docName}
                                                     value={d.docUUID}
                                    >{d.docName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        {(selectedDocument.docUUID === "0") ? (
                            <Button onClick={handleCreateDocument}>Create</Button>
                        ) : (
                            <Button onClick={handleAddToDocument}>Add</Button>
                        )}

                    </DialogActions>
                </Dialog>
            </div>

        </Container>
    )
}

export default Home
