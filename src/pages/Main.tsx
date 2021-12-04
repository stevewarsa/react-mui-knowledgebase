import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddKbEntryForm from "../components/AddKbEntryForm";
import {Box, Chip, Container, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {KbEntry} from "../model/kb-entry";
import kbService from "../services/KbService";
import {useDispatch, useSelector} from "react-redux";
import {stateActions} from "../store";
import React from 'react';
import Spinner from "../components/Spinner";
import MarkdownToHtml from "../components/MarkdownToHtml";

const Main = () => {
    const dispatcher = useDispatch();
    const kbEntries: KbEntry[] = useSelector((st: any) => st.kbEntries);
    const [busy, setBusy] = useState({state: false, message: ""});

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

    return (
        <Container>
            {busy.state && <Spinner message={busy.message}/>}
            {!busy.state && <AddKbEntryForm/>}
            {!busy.state && <List sx={{width: '100%', bgcolor: 'background.paper'}}>
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
                            <Divider key={"div-" + kb.id} variant="inset" component="li"/>
                        </Stack>
                    </React.Fragment>
                )}
            </List>}
        </Container>
    );
};

export default Main;