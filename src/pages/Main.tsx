import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddKbEntryForm from "../components/AddKbEntryForm";
import {
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    Grid, InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    useMediaQuery
} from "@mui/material";
import {useEffect, useState} from "react";
import {KbEntry} from "../model/kb-entry";
import kbService from "../services/KbService";
import {useDispatch, useSelector} from "react-redux";
import {stateActions} from "../store";
import React from 'react';
import Spinner from "../components/Spinner";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PsychologyIcon from '@mui/icons-material/Psychology';
import showdown from "showdown";
import {Tag} from "../model/tag";

const Main = () => {
    const dispatcher = useDispatch();
    const converter = new showdown.Converter();
    const kbEntries: KbEntry[] = useSelector((st: any) => st.filteredEntries);
    const allKbEntries: KbEntry[] = useSelector((st: any) => st.kbEntries);
    const existingTags: Tag[] = useSelector((st: any) => st.allTags);
    const [busy, setBusy] = useState({state: false, message: ""});
    const [searchText, setSearchText] = useState("");
    const [filterTag, setFilterTag] = useState(-1);
    const largeScreen = useMediaQuery("(min-width:600px)");

    useEffect(() => {
        const callServer = async () => {
            setBusy({state: true, message: "Loading KBs from server..."});
            const tagData: any = await kbService.getTags();
            dispatcher(stateActions.setAllTags(tagData.data));
            const kbEntriesData: any = await kbService.getEntries();
            if (tagData.data !== null && tagData.data.length > 0) {
                kbEntriesData.data.forEach(kb => {
                    if (kb.tags && kb.tags.length > 0) {
                        for (let tag of kb.tags) {
                            const foundTag = tagData.data.find(tg => tg.tagId === tag.tagId);
                            if (foundTag !== null) {
                                tag.tagNm = foundTag.tagNm;
                                tag.tagCd = foundTag.tagCd;
                            }
                        }
                    }
                });
            }
            dispatcher(stateActions.setKbEntries(kbEntriesData.data));
            setFilterTag(-1);
            setBusy({state: false, message: ""});
        };
        callServer();

    }, [dispatcher]);

    const handleDelete = () => {
        console.log("handleDelete clicked");
    }

    const markMatches = (text: string) => {
        if (!searchText || searchText === "") {
            return text;
        } else {
            //console.log("markMatches - searchText: '" + searchText);
            const reg = new RegExp('('+searchText+')', 'gi');
            return text.replace(reg, "<span style=\"background-color: #FFFF00\">$1</span>");
        }
    };

    const getDescriptionDisplayJSX = (kb: KbEntry) => {
        if (kb.markdown) {
            return <span dangerouslySetInnerHTML={{__html: markMatches(converter.makeHtml(kb.desc))}}/>;
        } else {
            return (
                <Typography
                    key={"typ-" + kb.id}
                    sx={{display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    dangerouslySetInnerHTML={{__html: markMatches(kb.desc)}}
                />
            );
        }
    };

    const SEARCH_TEXT = "searchText";
    const FILTER_TAG = "filterTag";
    const handleSearch = (event, src: string) => {
        // reusable text filter function to be called in either case
        const textFilterFunc = (baseEntryList: KbEntry[], searchCriteria: string) => {
            return baseEntryList.filter(knowledgebaseEntry =>
                knowledgebaseEntry.title.toUpperCase().includes(searchCriteria.toUpperCase()) ||
                knowledgebaseEntry.desc.toUpperCase().includes(searchCriteria.toUpperCase()));
        }
        // reusable tag filter function to be called in either case
        const tagFilterFunc = (baseEntryList: KbEntry[], tagId: number) => allKbEntries.filter(kb => kb.tags.find(tg => tg.tagId === tagId));
        let newEntryList: KbEntry[] = [];
        if (src === SEARCH_TEXT) {
            const searchString = event.target.value;
            // console.log("handleSearch - here is the searchString:");
            // console.log(searchString);
            if (!searchString || searchString === "") {
                newEntryList = filterTag === -1 ? allKbEntries : tagFilterFunc(allKbEntries, filterTag);
                setSearchText("");
            } else {
                // console.log("handleSearch - here is the search string:");
                // console.log(searchString);
                // If there is currently a filter tag selected, then search within that, otherwise, search all entries
                let baseEntryList = filterTag === -1 ? allKbEntries : kbEntries;
                newEntryList = textFilterFunc(baseEntryList, searchString);
                setSearchText(searchString);
            }
        } else if (src === FILTER_TAG) {
            const locFilterTag = parseInt(event.target.value);
            if (locFilterTag === -1) {
                // clearing tag filter
                if (searchText && searchText !== "") {
                    // there is a text filter
                    newEntryList = textFilterFunc(allKbEntries, searchText);
                } else {
                    // there is no text filter
                    newEntryList = allKbEntries;
                }
            } else {
                // setting tag filter
                if (searchText && searchText !== "") {
                    // there is a text filter
                    newEntryList = textFilterFunc(tagFilterFunc(allKbEntries, locFilterTag), searchText);
                } else {
                    // there is no text filter
                    newEntryList = tagFilterFunc(allKbEntries, locFilterTag);
                }
            }
            setFilterTag(locFilterTag);
        }
        dispatcher(stateActions.setFilteredEntries(newEntryList));
    };

    const handleClear = () => {
        setBusy({state: true, message: "Clearing filter..."});
        setSearchText("");
        setFilterTag(-1);
        dispatcher(stateActions.setFilteredEntries(allKbEntries));
        setBusy({state: false, message: ""});
    };

    return (
        <Container>
            {busy.state && <Spinner message={busy.message}/>}
            {!busy.state &&
                <>
                    <Grid container sx={{ mt: 2, py: 4, border: 3, borderColor: 'grey.500'}} spacing={2}>
                        <Grid item xs={1}>
                            <PsychologyIcon sx={largeScreen ? { fontSize: 50 } : { fontSize: 30 }}/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography variant={largeScreen ? "h3" : "h5"} fontWeight="bold">Knowledgebase</Typography>
                        </Grid>
                    </Grid>
                    <AddKbEntryForm/>
                    <p><strong>Number of entries shown:</strong> {kbEntries.length}</p>
                    <Box>
                        <TextField
                            style={{ height: 60 }}
                            value={searchText}
                            label="Search Entries"
                            variant="outlined"
                            onChange={(event) => handleSearch(event, SEARCH_TEXT)}/>
                        <FormControl>
                            <InputLabel sx={{ml: 2}} id="tag-filter-label">Tag</InputLabel>
                            <Select
                                labelId="tag-filter-label"
                                value={filterTag}
                                label="Tag"
                                sx={{ml: 2, mr: 2}}
                                style={{ height: 56 }}
                                onChange={(event) => handleSearch(event, FILTER_TAG)}
                            >
                                <MenuItem key={-1} value={-1}>All Tags</MenuItem>
                                {existingTags.map(tg => <MenuItem key={tg.tagId} value={tg.tagId}>{tg.tagNm}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button style={{ height: 56 }} variant="contained" disabled={kbEntries.length === allKbEntries.length} startIcon={<HighlightOffIcon />} onClick={handleClear}>Clear</Button>
                    </Box>
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {kbEntries && kbEntries.length > 0 && kbEntries.map(kb =>
                        <React.Fragment key={"frag-" + kb.id}>
                            <ListItem key={kb.id} alignItems="flex-start">
                                <ListItemText
                                    key={"lit-" + kb.id}
                                    disableTypography
                                    primary={
                                        <Typography
                                            sx={{fontSize: 20,fontWeight: "bold"}}
                                            dangerouslySetInnerHTML={{__html: markMatches(kb.title)}}/>
                                    }
                                    secondary={getDescriptionDisplayJSX(kb)}
                                />
                            </ListItem>
                            <Stack sx={{ml: 2}} spacing={2}>
                                <Box>
                                    {kb.tags.map(tg => <Chip key={kb.id + "-" + tg.tagId}
                                                             label={tg.tagNm}
                                                             sx={{mr: 1}}
                                                             variant="outlined"
                                                             onDelete={handleDelete}/>)}
                                </Box>
                                <Box><Button variant="contained" startIcon={<EditIcon />} onClick={() => {
                                    console.log("Edit Button Clicked - setting editing entry to:");
                                    console.log(kb);
                                    dispatcher(stateActions.setEditingKbEntry(kb));
                                    window.scroll({top: 0, behavior: "smooth"});
                                }}>Edit</Button></Box>
                                <Divider key={"div-" + kb.id} variant="inset" component="li"/>
                            </Stack>
                        </React.Fragment>
                    )}
                    </List>
                </>}
        </Container>
    );
};

export default Main;