import {useRouter} from "next/router";
import Container from "../Components/Container";
import {NextPage} from "next";
import {useEffect, useState} from "react";
import axios from "axios";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

type Extract = {
    [key: string]: {
        [key: string]: {
            text: string[],
        }
    }
}

// export const getServerSideProps = withPageAuthRequired();

//@ts-ignore
const View: NextPage = ({user}) => {
    const router = useRouter();
    const {doc} = router.query;
    const [documentName, setDocumentName] = useState("");
    const [loading, setLoading] = useState(false);
    const [extracts, setExtracts] = useState<Extract[] | null>(null);


    useEffect(() => {
        setLoading(() => true)
        const req = {
            'url': '/v2/api/get-document', 'data': {
                'document_uuid': doc,
            }
        }

        axios.post('/api/v2', req)
            .then((res) => {
                setLoading(() => false)
                setDocumentName(res.data.document_name)
                setExtracts(res.data.extracts);
                console.log(res.data.extracts)
                return res
            })
            .catch((err) => {
                setLoading(() => false)
                return err
            })
    }, [doc]);

    return (
        <Container>
            {(documentName !== "") && <h2>{documentName}</h2>}
            {loading && <h1>Loading Document</h1>}
            <div
                className="flex flex-col gap-10 mt-4"
            >
                {(extracts?.length === 0) && (
                    <div>
                        This document is currently empty!
                    </div>
                )}
                {extracts && !loading && Object.keys(extracts).map((book: string) => {
                    return (
                        <div
                            key={book}
                        >
                            <h4>{book}</h4>
                            <div className="flex-col">
                                {// @ts-ignore
                                    Object.keys(extracts[book]).map((chapter: string) => {
                                    return (
                                        <div key={chapter}>
                                            <h4>{chapter}</h4>
                                            <div className="flex-col">
                                                {//@ts-ignore
                                                    extracts[book][chapter]['text'].map((sentence) => {
                                                    console.log(sentence)
                                                    return (
                                                        <p key={sentence} className="p-2">
                                                            {sentence}
                                                        </p>
                                                    )

                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}

export default View;