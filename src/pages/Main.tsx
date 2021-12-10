import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddKbEntryForm from "../components/AddKbEntryForm";
import {Box, Button, Chip, Container, Grid, Stack, TextField, useMediaQuery} from "@mui/material";
import {useEffect, useState} from "react";
import {KbEntry} from "../model/kb-entry";
import kbService from "../services/KbService";
import {useDispatch, useSelector} from "react-redux";
import {stateActions} from "../store";
import React from 'react';
import Spinner from "../components/Spinner";
import MarkdownToHtml from "../components/MarkdownToHtml";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Main = () => {
    const dispatcher = useDispatch();
    const kbEntries: KbEntry[] = useSelector((st: any) => st.filteredEntries);
    const allKbEntries: KbEntry[] = useSelector((st: any) => st.kbEntries);
    const [busy, setBusy] = useState({state: false, message: ""});
    const [searchText, setSearchText] = useState("");
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
            setBusy({state: false, message: ""});
        };
        callServer();

    }, [dispatcher]);

    const handleDelete = () => {
        console.log("handleDelete clicked");
    }

    const getDescriptionDisplayJSX = (kb: KbEntry) => {
        if (kb.markdown) {
            return <MarkdownToHtml markdown={kb.desc}/>;
        } else {
            return (
                <Typography
                    key={"typ-" + kb.id}
                    sx={{display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                >
                    {kb.desc}
                </Typography>
            );
        }
    };

    const handleSearch = (event) => {
        const searchString = event.target.value;
        console.log("handleSearch - here is the searchString:");
        console.log(searchString);
        if (!searchString || searchString === "") {
            dispatcher(stateActions.setFilteredEntries(allKbEntries));
            setSearchText("");
        } else {
            // console.log("handleSearch - here is the search string:");
            // console.log(searchString);
            const filteredEntries = allKbEntries.filter(kb => kb.title.toUpperCase().includes(searchString.toUpperCase()) || kb.desc.toUpperCase().includes(searchString.toUpperCase()));
            dispatcher(stateActions.setFilteredEntries(filteredEntries));
            setSearchText(searchString);
        }
    };

    const handleClear = () => {
        setBusy({state: true, message: "Clearing filter..."});
        setSearchText("");
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
                        <TextField value={searchText} sx={{mr: 2}} label="Search Entries" variant="outlined" onChange={handleSearch}/>
                        <Button variant="contained" disabled={kbEntries.length === allKbEntries.length} startIcon={<HighlightOffIcon />} onClick={handleClear}>Clear</Button>
                    </Box>
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {kbEntries && kbEntries.length > 0 && kbEntries.map(kb =>
                        <React.Fragment key={"frag-" + kb.id}>
                            <ListItem key={kb.id} alignItems="flex-start">
                                <ListItemText
                                    key={"lit-" + kb.id}
                                    primary={kb.title}
                                    primaryTypographyProps={{
                                        fontSize: 20,
                                        fontWeight: "bold"
                                    }}
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