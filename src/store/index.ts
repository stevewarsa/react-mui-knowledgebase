import {KbEntry} from "../model/kb-entry";
import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Tag} from "../model/tag";

const initialState: {kbEntries: KbEntry[], filterTags: Tag[], allTags: Tag[]} = {kbEntries: [], filterTags: [], allTags: []};

const state = createSlice({
    name: "state",
    initialState: initialState,
    reducers: {
        addKbEntry(state, action) {
            state.kbEntries.unshift(action.payload);
        },
        setKbEntries(state, action) {
            state.kbEntries = action.payload;
        },
        addFilterTag(state, action) {
            state.filterTags.push(action.payload);
        },
        setAllTags(state, action) {
            state.allTags = action.payload;
        },
        addNewTag(state, action) {
            state.allTags.push(action.payload);
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;