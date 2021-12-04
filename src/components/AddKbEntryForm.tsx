import {
    Box,
    Button, Checkbox,
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
import MarkdownToHtml from "./MarkdownToHtml";

const defaultBlankEntry = {
    title: "",
    desc: "",
    tags: []
} as KbEntry;

const AddKbEntryForm = () => {
    const dispatcher = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [markdown, setMarkdown] = useState(false);
    const [newEntry, setNewEntry] = useState(defaultBlankEntry);
    const largeScreen = useMediaQuery("(min-width:600px)");

    const handleToggleForm = (event) => {
        setShowForm(prevState => !prevState);
        event.preventDefault();
    };

    const handleAddEntry = async () => {
        setSaving(true);
        const entryToAdd = {...newEntry, markdown: markdown};
        const addEntryResult: any = await kbService.addEntry(entryToAdd);
        dispatcher(stateActions.addKbEntry(addEntryResult.data));
        const tagsResult = await kbService.getTags();
        dispatcher(stateActions.setAllTags(tagsResult.data));
        setNewEntry(defaultBlankEntry);
        setShowForm(false);
        setSaving(false);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const handleFormValueChange = (prop) => (event) => {
        setNewEntry(prevState => {
            return {...prevState, [prop]: event.target.value};
        });
    };

    const handleTagSelection = (tag: Tag) => {
        setNewEntry(prevState => {
            return {...prevState, tags: [...prevState.tags, tag]};
        });
    };

    const handleRemoveTag = (tagId: number) => {
        setNewEntry(prevState => {
            return {...prevState, tags: prevState.tags.filter(tg => tg.tagId !== tagId)};
        });
    }

    const toggleMarkdown = () => {
        setMarkdown(prevState => !prevState);
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
                    <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'controlled' }} checked={markdown} onChange={toggleMarkdown} />} label="Description in markdown?" />
                    <TextField label="Description" multiline minRows={3} variant="outlined" value={newEntry.desc} onChange={handleFormValueChange("desc")}/>
                    {markdown && <MarkdownToHtml markdown={newEntry.desc}/>}
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