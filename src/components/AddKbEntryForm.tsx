import {
    Box,
    Button,
    Chip,
    Collapse,
    FormControlLabel,
    IconButton,
    Stack,
    TextField,
    useMediaQuery
} from "@mui/material";
import {useState} from "react";
import SaveIcon from '@mui/icons-material/Save';
import {Cancel, ChevronRight, ExpandMore} from "@mui/icons-material";
import {KbEntry} from "../model/kb-entry";
import kbService from "../services/KbService";
import {useDispatch} from "react-redux";
import {stateActions} from "../store";
import {Tag} from "../model/tag";
import TagSelection from "./TagSelection";
import Spinner from "./Spinner";

const defaultBlankEntry = {
    title: "",
    desc: "",
    tags: []
} as KbEntry;

const AddKbEntryForm = () => {
    const dispatcher = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newEntry, setNewEntry] = useState(defaultBlankEntry);
    const largeScreen = useMediaQuery("(min-width:600px)");
    const handleToggleForm = (event) => {
        console.log("handleToggleForm");
        setShowForm(prevState => !prevState);
        event.preventDefault();
    };

    const handleAddEntry = async () => {
        setSaving(true);
        console.log("handleAddEntry - the value of the entry is:");
        console.log(newEntry);
        const addEntryResult: any = await kbService.addEntry(newEntry);
        console.log("AddEntry.handleAddEntry - here is the response:");
        console.log(addEntryResult);
        dispatcher(stateActions.addKbEntry(addEntryResult.data));
        const tagsResult = await kbService.getTags();
        dispatcher(stateActions.setAllTags(tagsResult.data));
        setNewEntry(defaultBlankEntry);
        setShowForm(false);
        setSaving(false);
    };

    const handleCancel = () => {
        console.log("handleCancel");
        setShowForm(false);
    };

    const handleFormValueChange = (prop) => (event) => {
        setNewEntry(prevState => {
            return {...prevState, [prop]: event.target.value};
        });
    };

    const handleTagSelection = (tag: Tag) => {
        console.log("handleTagSelection - here is the tag selected:");
        console.log(tag);
        setNewEntry(prevState => {
            return {...prevState, tags: [...prevState.tags, tag]};
        });
    };

    const handleRemoveTag = (tagId: number) => {
        setNewEntry(prevState => {
            return {...prevState, tags: prevState.tags.filter(tg => tg.tagId !== tagId)};
        });
    }

    return (
        <>
            {saving && <Spinner message={"Saving new entry..."}/>}
            <FormControlLabel
                label={showForm ? "Hide Add Form" : "Show Add Form"}
                control={
                    <IconButton
                        onClick={handleToggleForm}
                        sx={{m: 2}}>
                        {showForm ? <ExpandMore sx={{fontSize: 40}} /> : <ChevronRight sx={{fontSize: 40}}/>}
                    </IconButton>
                }
            />
            <Collapse in={showForm}>
                <Stack spacing={2} sx={{p: 2}}>
                    <h3>New Knowledgebase Entry</h3>
                    <TextField label="Title" variant="outlined" value={newEntry.title} onChange={handleFormValueChange("title")}/>
                    <TextField label="Description" multiline minRows={3} variant="outlined" value={newEntry.desc} onChange={handleFormValueChange("desc")}/>
                    <TagSelection tagSelectionCallback={handleTagSelection}/>
                    {newEntry.tags !== null && newEntry.tags.length > 0 &&
                    <Box>
                        {newEntry.tags.map(tg => <Chip key={tg.tagId} label={tg.tagNm} sx={{mr: 1}} variant="outlined" onDelete={() => handleRemoveTag(tg.tagId)}/>)}
                    </Box>
                    }
                    <Box>
                        <Button sx={{mr: 2}} startIcon={<SaveIcon/>} onClick={handleAddEntry} variant="contained">{largeScreen ? "Add Entry" : ""}</Button>
                        <Button startIcon={<Cancel/>} onClick={handleCancel}  variant="contained"
                                color="secondary">{largeScreen ? "Cancel" : ""}</Button>
                    </Box>
                </Stack>
            </Collapse>
        </>
    );
};

export default AddKbEntryForm;