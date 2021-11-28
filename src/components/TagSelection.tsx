import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import {useState} from "react";

const defaultTags = [
    "Java",
    "Angular",
    "React",
    "SQL",
    "Bash",
    "Python"
];
const TagSelection = () => {
    const [value, setValue] = useState("");
    const [open, toggleOpen] = useState(false);
    const [tags, setTags] = useState(defaultTags);
    const handleClose = () => {
        setDialogValue(null);
        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setValue(dialogValue);
        setTags(prevState => [...prevState, dialogValue]);
        handleClose();
    };


    return (
        <>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string' && !tags.includes(newValue)) {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue(newValue);
                        });
                    } else {
                        setValue(newValue);
                    }
                }}
                id="free-solo-dialog-demo"
                options={tags}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => <TextField {...params} label="Filter by tag" />}
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add a new tag</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You're adding a new tag to the list.  Are you sure?
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            value={dialogValue}
                            onChange={(event) => setDialogValue(event.target.value)}
                            label="title"
                            type="text"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Add</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default TagSelection;