import {Dispatch, Fragment} from "react";
import {useState, useRef, SetStateAction} from "react";
import Alert, {AlertColor} from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import axios from "axios";

export type QuoteToAdd = {
    text: string,
    chapterTitle: string,
    bookTitle: string,
    sentenceIndex: number,
}

const options = ['Add to Existing Document', 'Create New Document'];

function CustomButtonGroup({
                               setParentButtonGroup,
                               quoteToAdd,
                               selectedDocument,
                               setSelectedDocument,
                               setListOfDocuments,
                               uid,
                               numDocuments,
                           }: {
    setParentButtonGroup: Dispatch<SetStateAction<string>>
    quoteToAdd: QuoteToAdd
    selectedDocument: { docName: string, docUUID: string }
    setSelectedDocument: Dispatch<SetStateAction<{ docName: string, docUUID: string }>>
    setListOfDocuments: Dispatch<SetStateAction<Array<{ docName: string, docUUID: string }>>>
    numDocuments: number
    uid: string
}) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(numDocuments > 0 ? 0 : 1);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ open: boolean, message: string, severity: AlertColor | undefined }>({
        open: false,
        message: "",
        severity: undefined
    })

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
        setLoading(() => true)
        const req = {
            'url': '/v2/api/add-extract-to-document', 'data': {
                'document_uuid': selectedDocument.docUUID,
                'document_name': selectedDocument.docName,
                'uid': uid,
                'sentence_index': quoteToAdd.sentenceIndex,
            }
        }

        axios.post('/api/v2', req)
            .then((res) => {
                    setLoading(() => false)
                    if (options[selectedIndex] === 'Create New Document') {
                        setAlert({
                            open: true,
                            message: "Extract added to new Document '" + selectedDocument.docName + "' successfully",
                            severity: "success"
                        })
                        setParentButtonGroup("Add to Existing Document")
                        setSelectedIndex(0)
                        setListOfDocuments(d => [...d, {
                            docName: selectedDocument.docName,
                            docUUID: res.data.document_uuid
                        }])
                        setSelectedDocument(d => ({
                            docName: d.docName,
                            docUUID: res.data.document_uuid
                        }))
                    } else {
                        setSelectedDocument(d => ({
                            docName: d.docName,
                            docUUID: res.data.document_uuid
                        }))
                        setAlert({
                            open: true,
                            message: "Extract added to " + selectedDocument.docName + " successfully",
                            severity: "success"
                        })
                    }
                    return
                }
            )
            .catch((err) => {
                setLoading(() => false)
                setAlert({
                    open: true,
                    message: "Error adding extract to document",
                    severity: "error"
                })
                return
            })
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        setParentButtonGroup(options[index])
        setSelectedDocument(() => ({docName: "", docUUID: ""}))
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
        <Fragment>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button
                    onClick={handleClick}
                    style={{
                        backgroundColor: (selectedIndex === 1) ? "#3f51b5" : "#238636",
                        opacity: (selectedDocument.docName==="") ? 0.7 : 1,
                }}
                disabled={selectedDocument.docName === ""}
                >{options[selectedIndex]}</Button>
            <Button
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="menu"
                onClick={handleToggle}
                style={selectedIndex === 1 ?
                    {backgroundColor: "#3f51b5"} :
                    {backgroundColor: "#238636"}
                }
            >
                <ArrowDropDownIcon/>
            </Button>
        </ButtonGroup>
        <Popper
            sx={{
                zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            transition
            disablePortal
        >
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" autoFocusItem>
                                {options.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        disabled={index === 2}
                                        selected={index === selectedIndex}
                                        onClick={(event) => handleMenuItemClick(event, index)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
        </Fragment>
    {
        alert.open && (
            <Alert
                style={{width: '100%', marginTop: '10px'}}
                severity={alert.severity}
            >
                {alert.message}
            </Alert>
        )
    }
</>
)
    ;
}

export default CustomButtonGroup