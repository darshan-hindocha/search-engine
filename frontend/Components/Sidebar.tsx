import {Document} from "../lib/types";
import axios from "axios";
import {useEffect, useState} from "react";
import Container from "./Container";
import Link from "next/link";
import {GetStaticProps, NextPage} from "next";
import cn from "classnames";
import {useRouter} from "next/router";
import {SearchOutlined} from "@mui/icons-material";

type User = {
    user: {
        sid: string
    }
}

const Sidebar = ({userSID}: { userSID: string }) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState<{ documents: Document[] } | null>(null)
    const [documentName, setDocumentName] = useState("");
    const router = useRouter()

    // TODO: only load once during site visit. don't reload on page change.
    useEffect(() => {
        handleLoadData()
    }, [])


    const handleLoadData = () => {
        setLoading(() => true)
        const req = {
            'url': '/v2/api/get-users-documents', 'data': {'uid': userSID}
        }

        axios.post('/api/v2', req)
            .then((res: { data: { documents: Document[] } }) => {
                setData(res.data)
                console.log(res.data)
                return res
            })
            .catch((err) => {
                setError(() => true)
                return err
            })
        return
    }

    return (
        <div className="flex flex-col w-full gap-2 m-4">
            <div className="w-2/3">
                <button
                    className="w-full"
                    onClick={() => router.push('/')}
                >
                    <h4 className={cn(
                        router.pathname === "/" ? "bg-gray-200" : "bg-green-500",
                        "px-2 rounded-md"
                    )}>
                        <SearchOutlined/>
                        Search
                    </h4>
                </button>
            </div>
            <div className="flex flex-col w-3/4 gap-2">
                <h4>
                    Your Documents
                </h4>
                {data && !error ?
                    data.documents?.map(({document_name, document_uuid, number_of_extracts}) => {
                        return (
                            <Link
                                href={`/view?doc=${document_uuid}`}
                                key={document_uuid}
                            >
                                <div
                                    className="flex flex-col p-2 border border-gray-300 rounded-md cursor-pointer"
                                >
                                    <h4>{document_name}</h4>
                                    <p>{number_of_extracts} extracts</p>
                                </div>
                            </Link>
                        )
                    }) :
                    <p>Loading...</p>
                }
            </div>
        </div>
    )
}

export default Sidebar