import {useRouter} from "next/router";
import Container from "../Components/Container";
import {NextPage} from "next";
import {useEffect, useState} from "react";
import axios from "axios";
import cn from "classnames";
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
    const [viewTab, setViewTab] = useState("noCommentary");


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

    const handleViewTab = (tab: string) => {
        setViewTab(tab)
    }

    return (
        <Container>
            {(documentName !== "") && <h2>{documentName}</h2>}
            <div className="flex flex-row w-full justify-center divide-x-2 divide-black">
                <button
                    className={cn(
                        viewTab === "noCommentary" ? "bg-gray-200" : "bg-gray-100",
                        "px-2 py-4 w-1/4 rounded-2xl rounded-r-none"
                    )}
                    onClick={() => handleViewTab("noCommentary")}
                >
                    Extracts Only
                </button>
                <button
                    className={cn(
                        viewTab === "withCommentary" ? "bg-gray-200" : "bg-gray-100",
                        "px-2 py-4 w-1/4 rounded-2xl rounded-l-none"
                    )}
                    onClick={() => handleViewTab("withCommentary")}
                >
                    Extracts with Commentary
                </button>
            </div>
            {loading && <h1>Loading Document</h1>}
            <div
                className="flex flex-col gap-10 mt-4"
            >
                {(extracts?.length === 0) && (
                    <div>
                        This document is currently empty!
                    </div>
                )}
                {extracts && viewTab === "noCommentary" && !loading && Object.keys(extracts).map((book: string) => {
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
                {extracts && viewTab === "withCommentary" && !loading && Object.keys(extracts).map((book: string) => {
                    return (
                        <div
                            key={book}
                        >
                            <h4>{book}</h4>
                            <div className="flex flex-col gap-8">
                                {// @ts-ignore
                                    Object.keys(extracts[book]).map((chapter: string) => {
                                        return (
                                            <div key={chapter}>
                                                <h4>{chapter}</h4>
                                                <div className="flex flex-col gap-4">
                                                    {//@ts-ignore
                                                        extracts[book][chapter]['text'].map((sentence) => {
                                                            console.log(sentence)
                                                            return (
                                                                <div key={sentence} className="p-2">
                                                                    <p className="border-l-2 pl-2">
                                                                        {sentence}
                                                                    </p>
                                                                    <p className="italic ">
                                                                        add commentary here
                                                                    </p>
                                                                </div>
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