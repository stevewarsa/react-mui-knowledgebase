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
import {Tag} from "../model/tag";
import {useSelector} from "react-redux";

const defaultTag: Tag = {tagCd: "", tagNm: "", tagId: -1};

const TagSelection = ({tagSelectionCallback}) => {
    const existingTags: Tag[] = useSelector((st: any) => st.allTags);
    const [value, setValue] = useState(defaultTag);

    const [dialogOpen, toggleDialogOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState(defaultTag);

    const handleDialogClose = () => {
        setDialogValue(defaultTag);
        toggleDialogOpen(false);
    };

    const handleDialogSubmit = (event) => {
        console.log("TagSelection.handleDialogSubmit - here is the event:");
        console.log(event);
        event.preventDefault();
        setValue(dialogValue);
        tagSelectionCallback(dialogValue);
        handleDialogClose();
    };

    const handleDialogTagCdChange = (event) => {
        setDialogValue(prevState => {
            return {...prevState, tagCd: event.target.value};
        });
    };

    const handleDialogTagNmChange = (event) => {
        setDialogValue(prevState => {
            return {...prevState, tagNm: event.target.value};
        });
    };

    const handleAutoCompleteChange = (event, newValue: Tag) => {
        console.log("handleAutoCompleteChange - here is the event:");
        console.log(event);
        console.log("handleAutoCompleteChange - here is the newValue:");
        console.log(newValue);
        if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
                // what the user typed DOES NOT match an existing tag name, so pop open the dialog
                setDialogValue({...defaultTag, tagNm: newValue, tagCd: newValue});
                toggleDialogOpen(true);
            });
        } else {
            const existingTag = existingTags.find(tg => tg.tagNm.toUpperCase().includes(newValue.tagNm.toUpperCase()));
            if (!existingTag) {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                    // what the user typed DOES NOT match an existing tag name, so pop open the dialog
                    toggleDialogOpen(true);
                    setDialogValue(newValue);
                });
            } else {
                // what the user typed matches an existing tag name, so don't pop open the dialog
                console.log("TagSelection.handleAutoCompleteChange - setting value to existingTag:");
                console.log(existingTag);
                setValue(existingTag);
                tagSelectionCallback(existingTag);
            }
        }
    };

    const handleGetOptionLabel = (option: Tag) => {
        return option.tagNm ? option.tagNm : "";
    };

    return (
        <>
            <Autocomplete
                value={value}
                onChange={handleAutoCompleteChange}
                id="tag-selection"
                options={existingTags}
                getOptionLabel={handleGetOptionLabel}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => <TextField {...params} label="Type a tag name" />}
            />
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <form onSubmit={handleDialogSubmit}>
                    <DialogTitle>Add New Tag?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You're adding a new tag to the list.  Are you sure?
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="tagCd"
                            value={dialogValue.tagCd}
                            onChange={handleDialogTagCdChange}
                            label="Tag Code"
                            type="text"
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="tagNm"
                            value={dialogValue.tagNm}
                            onChange={handleDialogTagNmChange}
                            label="Tag Name"
                            type="text"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Add</Button>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default TagSelection;