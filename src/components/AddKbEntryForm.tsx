import {Box, Button, Collapse, FormControlLabel, IconButton, Stack, TextField, useMediaQuery} from "@mui/material";
import {useState} from "react";
import SaveIcon from '@mui/icons-material/Save';
import {Cancel, ChevronRight, ExpandMore} from "@mui/icons-material";
import {KbEntry} from "../model/kb-entry";

const AddKbEntryForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: "",
        desc: "",
        tags: []
    } as KbEntry);
    const largeScreen = useMediaQuery("(min-width:600px)");
    const handleToggleForm = (event) => {
        console.log("handleToggleForm");
        setShowForm(prevState => !prevState);
        event.preventDefault();
    };

    const handleAddEntry = () => {
        console.log("handleAddEntry - the value of the entry is:");
        console.log(newEntry);
        setShowForm(false);
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

    const handleTagEntrySelection = () => {
        console.log("handleTagEntrySelection");
    };

    return (
        <>
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
                <Stack spacing={2} sx={{p: 5}}>
                    <TextField label="Title" variant="outlined" value={newEntry.title} onChange={handleFormValueChange("title")}/>
                    <TextField label="Description" multiline minRows={3} variant="outlined" onChange={handleFormValueChange("desc")}/>
                    <TextField label="New/Existing Tag" variant="outlined" onChange={handleTagEntrySelection}/>
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