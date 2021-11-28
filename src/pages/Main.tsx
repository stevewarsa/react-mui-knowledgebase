import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AddKbEntryForm from "../components/AddKbEntryForm";
import TagSelection from "../components/TagSelection";
import {Box, Chip, Container, Stack} from "@mui/material";
import {useState} from "react";
import {KbEntry} from "../model/kb-entry";
import {Tag} from "../model/tag";
import React from 'react';

const initalTags: Tag[] = [
    {tagId: 1, tagCd: "java", tagNm: "Java"},
    {tagId: 2, tagCd: "angular", tagNm: "Angular"},
    {tagId: 3, tagCd: "react", tagNm: "React"},
    {tagId: 4, tagCd: "sql", tagNm: "SQL"},
    {tagId: 5, tagCd: "bash", tagNm: "Bash"},
    {tagId: 6, tagCd: "python", tagNm: "Python"},
    {tagId: 7, tagCd: "git", tagNm: "Git"},
    {tagId: 8, tagCd: "javascript", tagNm: "JavaScript"}
];
const initialKbEntries: KbEntry[] = [
    {
        id: 1,
        title: "A Java KB",
        desc: "A Java KB Desc",
        tags: [initalTags.find(tg => tg.tagCd === "java")]
    },
    {
        id: 2,
        title: "A JavaScript KB",
        desc: "A JavaScript KB Desc",
        tags: [initalTags.find(tg => tg.tagCd === "javascript")]
    },
    {
        id: 3,
        title: "An SQL KB",
        desc: "An SQL KB Desc",
        tags: [initalTags.find(tg => tg.tagCd === "sql")]
    },
    {
        id: 4,
        title: "KB w/ 2 tags",
        desc: "KB w/ 2 tags Desc",
        tags: [initalTags.find(tg => tg.tagCd === "sql"), initalTags.find(tg => tg.tagCd === "javascript")]
    }
];
const Main = () => {
    const [kbEntries, setKbEntries] = useState(initialKbEntries);

    const handleDelete = () => {
        console.log("handleDelete clicked");
    }

    return (
        <Container>
            <AddKbEntryForm/>
            <TagSelection/>
            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {kbEntries && kbEntries.length && kbEntries.map(kb =>
                    <React.Fragment key={"frag-" + kb.id}>
                        <ListItem key={kb.id} alignItems="flex-start">
                            <ListItemAvatar key={"lia-" + kb.id}>
                                <Avatar key={"avt-" + kb.id}
                                        alt={kb.tags && kb.tags.length > 0 ? kb.tags[0].tagCd : "No Tags"}
                                        src="/static/images/avatar/1.jpg"/>
                            </ListItemAvatar>
                            <ListItemText
                                key={"lit-" + kb.id}
                                primary={kb.title}
                                secondary={
                                    <Typography
                                        key={"typ-" + kb.id}
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {kb.desc}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Stack spacing={2}>
                            <Box>
                                {kb.tags.map(tg => <Chip key={kb.id + "-" + tg.tagId} label={tg.tagNm}
                                                         variant="outlined"
                                                         onDelete={handleDelete}/>)}
                            </Box>
                            <Divider key={"div-" + kb.id} variant="inset" component="li"/>
                        </Stack>
                    </React.Fragment>
                )}
            </List>
        </Container>
    );
};

export default Main;