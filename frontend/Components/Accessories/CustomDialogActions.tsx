import {useState, SetStateAction, Dispatch} from "react";
import {FormControl} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CustomButtonGroup from "./CustomButtonGroup";
import TextField from '@mui/material/TextField';
import {QuoteToAdd} from "./CustomButtonGroup";


const CustomDialogActions = ({
                                 quoteToAdd,
                                 listOfDocuments,
                                 uid,
                                 setListOfDocuments,
                             }: {
    quoteToAdd: QuoteToAdd
    listOfDocuments: Array<{ docName: string, docUUID: string }>
    setListOfDocuments: Dispatch<SetStateAction<Array<{ docName: string, docUUID: string }>>>
    uid: string
}) => {
    const [parentButtonGroup, setParentButtonGroup] = useState(
        listOfDocuments.length > 0 ? 'Add to Existing Document' : 'Create New Document'
    );
    const [selectedDocument, setSelectedDocument] = useState<{ docName: string, docUUID: string }>({
        docName: "",
        docUUID: ""
    })

    const handleChange = (event: SelectChangeEvent, index: unknown) => {
        // @ts-ignore
        setSelectedDocument(() => ({
            docUUID: event.target.value.toString(),
            // @ts-ignore
            docName: index?.props?.children?.toString() || ""
        }))
    }

    return (
        <>
            <FormControl fullWidth style={{width: '100%'}}>
                {(parentButtonGroup === 'Add to Existing Document') && (
                    <>
                        <InputLabel id="select-document-label">Select Existing Document</InputLabel>
                        <Select
                            labelId="select-document-label"
                            value={selectedDocument.docUUID}
                            label="Select Document"
                            onChange={handleChange}
                        >
                            {listOfDocuments.map((d) => {
                                // @ts-ignore
                                return <MenuItem key={d.docUUID}
                                                 value={d.docUUID}
                                >{d.docName}</MenuItem>
                            })}
                        </Select>
                    </>
                )}
                {(parentButtonGroup === 'Create New Document') && (
                    <TextField
                        id="outlined-basic"
                        label="Enter Name of New Document"
                        variant="outlined"
                        onChange={(e) => {
                            setSelectedDocument(d => ({
                                    ...d,
                                    ...{docName: e.target.value}
                                }
                            ))
                        }}
                    />
                )}
            </FormControl>

            <div style={{width: '100%',}}>
                <CustomButtonGroup
                    setParentButtonGroup={setParentButtonGroup}
                    quoteToAdd={quoteToAdd}
                    selectedDocument={selectedDocument}
                    setSelectedDocument={setSelectedDocument}
                    setListOfDocuments={setListOfDocuments}
                    numDocuments={listOfDocuments.length}
                    uid={uid}
                />
            </div>
        </>
    )
}

export default CustomDialogActions