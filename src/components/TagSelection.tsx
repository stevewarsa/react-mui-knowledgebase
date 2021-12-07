import {
    Autocomplete,
    Button, createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import {useState} from "react";
import {Tag} from "../model/tag";
import {useDispatch, useSelector} from "react-redux";
import {stateActions} from "../store";

const defaultTag: Tag = { tagCd: "", tagNm: "", tagId: -1 };
const filter = createFilterOptions();
const TagSelection = ({ tagSelectionCallback, selectedTagIds }) => {
    const dispatcher = useDispatch();
    const existingTags: Tag[] = useSelector((st: any) => st.allTags);
    const nextTagId: number = useSelector((st: any) => st.nextTagId);
    const [value, setValue] = useState(null);

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
        tagSelectionCallback(dialogValue);
        dispatcher(stateActions.addNewTag(dialogValue));
        handleDialogClose();
    };

    const handleDialogTagCdChange = (event) => {
        setDialogValue((prevState) => {
            return { ...prevState, tagCd: event.target.value };
        });
    };

    const handleDialogTagNmChange = (event) => {
        setDialogValue((prevState) => {
            return { ...prevState, tagNm: event.target.value };
        });
    };

    const tagIsNew = (val: string) => {
        return !existingTags.some((tg) =>
            tg.tagNm.toUpperCase().includes(val.toUpperCase())
        );
    };

    const handleAutoCompleteChange = (event, newValue: any, reason: any, details: any) => {
        console.log("handleAutoCompleteChange - here is the event:");
        console.log(event);
        console.log("handleAutoCompleteChange - here is the newValue:");
        console.log(newValue);
        console.log("handleAutoCompleteChange - here is the reason:");
        console.log(reason);
        console.log("handleAutoCompleteChange - here are the details:");
        console.log(details);
        if (reason && reason === "selectOption" && details && details.option) {
            const existingTag = existingTags.find((tg: Tag) => tg.tagId === details.option.id);
            console.log("handleAutoCompleteChange - reason is selectOption and details are populated - setting value back to defaultTag...  Here's the event:");
            console.log(event);
            setValue(defaultTag);
            tagSelectionCallback(existingTag);
            return;
        }
        if (newValue === null) {
            setValue(defaultTag);
            return;
        }
        if (typeof newValue === "string") {
            console.log("handleAutoCompleteChange - newValue is string");
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
                // what the user typed DOES NOT match an existing tag name, so pop open the dialog
                setDialogValue({
                    ...defaultTag,
                    tagNm: newValue,
                    tagCd: newValue.toLowerCase(),
                    tagId: nextTagId
                });
                toggleDialogOpen(true);
            });
        } else if (newValue && newValue.inputValue) {
            console.log("handleAutoCompleteChange - newValue.inputValue is populated");
            if (tagIsNew(newValue.inputValue)) {
                toggleDialogOpen(true);
                setDialogValue((prevState) => {
                    return {
                        ...prevState,
                        tagNm: newValue.inputValue,
                        tagCd: newValue.inputValue.toLowerCase(),
                        tagId: nextTagId
                    };
                });
            } else {
                const existingTag = existingTags.find((tg: Tag) => tg.tagNm.toUpperCase().includes(newValue.inputValue.toUpperCase()));
                console.log("handleAutoCompleteChange - newValue.inputValue is populated (else) - setting value back to defaultTag...");
                setValue(defaultTag);
                tagSelectionCallback(existingTag);
            }
        } else {
            let existingTag = null;
            if (newValue.inputValue) {
                console.log("handleAutoCompleteChange(else) - newValue.inputValue is populated");
                existingTag = existingTags.find((tg: Tag) => tg.tagNm.toUpperCase().includes(newValue.inputValue.toUpperCase()));
            } else if (newValue.title) {
                console.log("handleAutoCompleteChange(else) - newValue.title is populated");
                existingTag = existingTags.find((tg) => tg.tagNm.toUpperCase().includes(newValue.title.toUpperCase()));
            }

            if (!existingTag) {
                console.log("handleAutoCompleteChange(else) - no existing tags match");
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
                setValue(defaultTag);
                tagSelectionCallback(existingTag);
            }
        }
    };

    return (
        <>
            <Autocomplete
                value={value}
                onChange={handleAutoCompleteChange}
                onInputChange={(event: React.SyntheticEvent, value: string, reason: string) => {
                    console.log("onInputChange - Here are the values passed in: value=" + value + ", reason=" + reason + ", event:");
                    console.log(event);
                    if (reason === "reset") {
                        setValue(defaultTag);
                        if (event) {
                            event.preventDefault();
                        }
                    }
                }}
                onClose={(event: React.SyntheticEvent, reason: string) => {
                    console.log("onClose - Here are the values passed in: reason=" + reason + ", event:");
                    console.log(event);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const filteredWoSelectedTags = filtered.filter((tg: any) => !selectedTagIds.includes(tg.id))
                    // console.log("filterOptions - filtered array contains:");
                    // console.log(filteredWoSelectedTags);
                    if (params.inputValue !== "") {
                        //console.log("filterOptions - pushing new array element...");
                        filteredWoSelectedTags.push({
                            inputValue: params.inputValue,
                            title: `Add "${params.inputValue}"`
                        });
                    }

                    return filteredWoSelectedTags;
                }}
                id="tag-selection-typeahead"
                options={existingTags.map((tg: Tag) => {
                    return { title: tg.tagNm, inputValue: tg.tagNm, id: tg.tagId };
                })}
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === "string") {
                        // console.log("getOptionLabel - returning option as string:");
                        // console.log(option);
                        return option;
                    }
                    if (option.inputValue) {
                        // console.log("getOptionLabel - returning option.inputValue:");
                        // console.log(option);
                        return option.inputValue;
                    }
                    // console.log("getOptionLabel - returning empty string for option:");
                    // console.log(option);
                    return "";
                }}
                selectOnFocus
                clearOnBlur={true}
                handleHomeEndKeys
                renderOption={(props, option) => (
                    <li key={option.id} {...props}>
                        {option.title}
                    </li>
                )}
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Type a tag name" />
                )}
            />
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <form onSubmit={handleDialogSubmit}>
                    <DialogTitle>Add New Tag?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You're adding a new tag to the list. Are you sure?
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
