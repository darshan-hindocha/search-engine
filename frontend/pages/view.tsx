import {useRouter} from "next/router";
import Container from "../Components/Container";
import {NextPage} from "next";
import {useEffect, useState} from "react";
import axios from "axios";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";

type Extract = {
    text: string,
    book_title: string,
    index: number,
    chapter_title: string,
    paragraph_index: number,
    sentence_index: number
}

export const getServerSideProps = withPageAuthRequired();

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
                return res
            })
            .catch((err) => {
                setLoading(() => false)
                return err
            })
    }, [doc]);

    return (
        <Container>
            {(documentName !== "") && <h1>Viewing:{` `+documentName}</h1>}
            {loading && <h1>Loading Document</h1>}
            <div
                className="flex flex-col gap-10 p-4 border border-gray-300 rounded-md mt-4"
            >
                {(extracts?.length === 0) && (
                    <div>
                        This document is currently empty!
                    </div>
                )}
                {extracts && !loading && extracts.map((extract) => {
                    return (
                        <div key={extract.text + extract.index.toString()}>
                            <h2>{extract.book_title}</h2>
                            <h3>{extract.chapter_title}</h3>
                            <p>{extract.text}</p>
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}

export default View;