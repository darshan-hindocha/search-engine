import type {NextPage} from 'next'
import Link from "next/link";
import Container from "../Components/Container";
import axios from "axios";
import {useEffect, useState} from "react";
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

type Document = {
    document_name: string,
    document_uuid: string,
    number_of_extracts: number,
    index: number,
}

export const getServerSideProps = withPageAuthRequired();


// @ts-ignore
const Documents: NextPage = ({user}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState<{ documents: Document[] } | null>(null)
    const [documentName, setDocumentName] = useState("");

    useEffect(() => {
        handleLoadData()
    }, [])


    const handleCreateDocument = () => {
        setLoading(() => true)
        const req = {
            'url': '/v2/api/create-document', 'data': {
                'document_name': documentName,
                'uid': user.sid
            }
        }

        axios.post('/api/v2', req)
            .then((res) => {
                res = res.data;
                setLoading(() => false)
                setDocumentName(() => "")
                handleLoadData()
                return res
            })
            .catch((err) => {
                setError(() => true)
                setLoading(() => false)
                return err
            })
    }
    const handleLoadData = () => {
        setLoading(() => true)
        const req = {
            'url': '/v2/api/get-users-documents', 'data': {'uid': user.sid}
        }

        axios.post('/api/v2', req)
            .then((res: { data: { documents: Document[] } }) => {
                setData(res.data)
                setLoading(() => false)
                console.log(res)
                return res
            })
            .catch((err) => {
                setError(() => true)
                setLoading(() => false)
                return err
            })
        return
    }

    if (loading) {
        return (
            <Container>
                <div>
                    Loading...
                </div>
            </Container>
        )
    }
    return (
        <Container>
            <>
                {error ? <div>Failed to load with error {error}</div> : <h1>Your Documents</h1>}
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    className="w-full flex my-4 gap-4"
                >
                    <TextField
                        label={"Enter Name to Add Document e.g. Virtues of PSM"}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className={'w-full'}
                    />
                    <div>
                        <Fab
                            aria-label="add"
                            onClick={handleCreateDocument}
                            disabled={documentName === ""}
                        >
                            <AddIcon/>
                        </Fab>
                    </div>
                </Box>
                {data && !error ?
                    data.documents?.map(({document_name, document_uuid, number_of_extracts}) => {
                        return (
                            <Link
                                href={`/view?doc=${document_uuid}`}
                                key={document_uuid}
                            >
                                <div
                                    className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md mt-4"
                                >
                                    <h2>{document_name}</h2>
                                    <p>{number_of_extracts} extracts</p>
                                </div>
                            </Link>
                        )
                    }) :
                    <p>Loading...</p>
                }
            </>
        </Container>

    )
}

export default Documents
