import {
    Box,
    Button, Checkbox,
    Chip,
    Collapse, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Stack,
    TextField,
    useMediaQuery
} from "@mui/material";
import {useEffect, useState} from "react";
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {Cancel, ChevronRight, ExpandMore} from "@mui/icons-material";
import {KbEntry} from "../model/kb-entry";
import kbService from "../services/KbService";
import {useDispatch, useSelector} from "react-redux";
import {KbState, stateActions} from "../store";
import {Tag} from "../model/tag";
import TagSelection from "./TagSelection";
import Spinner from "./Spinner";
import MarkdownToHtml from "./MarkdownToHtml";

interface AddEntryState {
    showForm: boolean;
    saving: boolean;
    buttonText: string;
    markdown: boolean;
    newEntry: KbEntry;
    openRemoveConfirmationDialog: boolean;
}

const defaultBlankEntry = {
    title: "",
    desc: "",
    tags: []
} as KbEntry;

const defaultState = {
    showForm: false,
    saving: false,
    buttonText: "",
    markdown: false,
    newEntry: defaultBlankEntry,
    openRemoveConfirmationDialog: false
} as AddEntryState;
const AddKbEntryForm = () => {
    const dispatcher = useDispatch();
    const entryToEdit = useSelector((state: KbState) => state.editingEntry);
    const [addEntryState, setAddEntryState] = useState(defaultState);
    const largeScreen = useMediaQuery("(min-width:600px)");

    useEffect(() => {
        if (entryToEdit) {
            setAddEntryState(prevState => {
                return {...prevState, showForm: true, newEntry: {...entryToEdit}, markdown: entryToEdit.markdown, buttonText: largeScreen ? "Update Entry" : ""};
            });
        } else {
            setAddEntryState(prevState => {
                return {...prevState, showForm: false, newEntry: defaultBlankEntry, markdown: false, buttonText: largeScreen ? "Add Entry" : ""};
            });
        }
    }, [entryToEdit, largeScreen]);

    const handleToggleForm = (event) => {
        setAddEntryState(prevState => {
            return {...prevState, showForm: !prevState.showForm};
        });
        event.preventDefault();
    };

    const handleAddEntry = async () => {
        setAddEntryState(prevState => {
            return {...prevState, saving: true};
        });
        const entryToAdd = {...addEntryState.newEntry, markdown: addEntryState.markdown};
        const addEntryResult: any = await kbService.addEntry(entryToAdd);
        if (typeof addEntryResult.data === "string" && addEntryResult.data.startsWith("error")) {
            console.log("Error came back from addEntry: " + addEntryResult.data);
        } else {
            dispatcher(stateActions.addKbEntry(addEntryResult.data));
            const tagsResult = await kbService.getTags();
            dispatcher(stateActions.setAllTags(tagsResult.data));
            setAddEntryState(prevState => {
                return {...prevState, saving: false, showForm: false, newEntry: defaultBlankEntry};
            });
            dispatcher(stateActions.clearEditingKbEntry());
        }
    };

    const handleCancel = () => {
        setAddEntryState(prevState => {
            return {...prevState, showForm: false};
        });
        dispatcher(stateActions.clearEditingKbEntry());
    };

    const handleFormValueChange = (prop) => (event) => {
        setAddEntryState(prevState => {
            const locEntry = {...prevState.newEntry, [prop]: event.target.value};
            return {...prevState, newEntry: locEntry};
        });
    };

    const handleTagSelection = (tag: Tag) => {
        // console.log("handleTagSelection - the selected tag is:");
        // console.log(tag);
        setAddEntryState(prevState => {
            const locEntry = {...prevState.newEntry};
            locEntry.tags = [...locEntry.tags, tag];
            return {...prevState, newEntry: locEntry};
        });
    };

    const handleRemoveTag = (tagId: number) => {
        setAddEntryState(prevState => {
            const locEntry = {...prevState.newEntry};
            locEntry.tags = locEntry.tags.filter(tg => tg.tagId !== tagId);
            return {...prevState, newEntry: locEntry};
        });
    }

    const toggleMarkdown = () => {
        setAddEntryState(prevState => {
            return {...prevState, markdown: !prevState.markdown};
        });
    }

    const handleRemoveEntry = () => {
        console.log("handleRemoveEntry...");
        handleClose();
    };

    const handleClose = () => {
        console.log("handleClose");
        setAddEntryState(prevState => {
            return {...prevState, openRemoveConfirmationDialog: false};
        });
    };

    return (
        <>
            {addEntryState.saving && <Spinner message={"Saving new entry..."}/>}
            <FormControlLabel
                label={addEntryState.showForm ? "Hide Add Form" : "Show Add Form"}
                control={
                    <IconButton
                        onClick={handleToggleForm}
                        sx={{m: 2}}>
                        {addEntryState.showForm ? <ExpandMore sx={{fontSize: 40}} /> : <ChevronRight sx={{fontSize: 40}}/>}
                    </IconButton>
                }
            />
            <Collapse in={addEntryState.showForm}>
                <Stack spacing={2} sx={{p: 2}}>
                    <h3>{entryToEdit ? "Edit " : "New "}Knowledgebase Entry</h3>
                    <TextField label="Title" variant="outlined" value={addEntryState.newEntry.title} onChange={handleFormValueChange("title")}/>
                    <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'controlled' }} checked={addEntryState.markdown} onChange={toggleMarkdown} />} label="Description in markdown?" />
                    <TextField label="Description" multiline minRows={3} variant="outlined" value={addEntryState.newEntry.desc} onChange={handleFormValueChange("desc")}/>
                    {addEntryState.markdown && <MarkdownToHtml markdown={addEntryState.newEntry.desc}/>}
                    <TagSelection selectedTagIds={addEntryState.newEntry.tags.map(tg => tg.tagId)} tagSelectionCallback={handleTagSelection}/>
                    {addEntryState.newEntry.tags.length > 0 &&
                    <Box>
                        {addEntryState.newEntry.tags.map(tg => <Chip key={tg.tagId} label={tg.tagNm} sx={{mr: 1}} variant="outlined" onDelete={() => handleRemoveTag(tg.tagId)}/>)}
                    </Box>
                    }
                    <Box>
                        <Button sx={{mr: 2}} startIcon={<SaveIcon/>} onClick={handleAddEntry} variant="contained">{addEntryState.buttonText}</Button>
                        {entryToEdit && <Button sx={{mr: 2}} color="error" startIcon={<RemoveCircleIcon/>} onClick={() => {
                            setAddEntryState(prevState => {
                                return {...prevState, openRemoveConfirmationDialog: true};
                            });
                        }} variant="contained">Remove Entry</Button>}
                        <Button startIcon={<Cancel/>} onClick={handleCancel}  variant="contained"
                                color="secondary">{largeScreen ? "Cancel" : ""}</Button>
                    </Box>
                    <Dialog
                        open={addEntryState.openRemoveConfirmationDialog}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Remove entry?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you would like to permanently remove this entry?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} autoFocus>Keep</Button>
                            <Button onClick={() => handleRemoveEntry()}>
                                Remove
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Collapse>
        </>
    );
};

export default AddKbEntryForm;