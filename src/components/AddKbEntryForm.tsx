import {Box, Button, Collapse, Container, FormControlLabel, Stack, Switch, TextField} from "@mui/material";
import {useState} from "react";

const AddKbEntryForm = () => {
    const [showForm, setShowForm] = useState(false);
    const handleToggleForm = () => {
        setShowForm(prevState => !prevState);
    };

    const handleAddEntry = () => {
        setShowForm(false);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    return (
        <Container>
        <FormControlLabel
            control={<Switch checked={showForm} onChange={handleToggleForm} />}
            label={showForm ? "Hide Add Form" : "Show Add Form"}
        />
            <Collapse in={showForm}>
                <Stack spacing={2} sx={{p: 5}}>
                    <TextField label="Title" variant="outlined"/>
                    <TextField label="Description" multiline minRows={3} variant="outlined"/>
                    <TextField label="New/Existing Tag" variant="outlined"/>
                    <Box>
                        <Button onClick={handleAddEntry} variant="contained">Add Entry</Button>
                        <Button onClick={handleCancel} color="secondary">Cancel</Button>
                    </Box>
                </Stack>
            </Collapse>
        </Container>
    );
};

export default AddKbEntryForm;