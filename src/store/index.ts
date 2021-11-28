import {KbEntry} from "../model/kb-entry";
import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Tag} from "../model/tag";

const initialState: {kbEntries: KbEntry[], filterTags: Tag[]} = {kbEntries: [], filterTags: []};

const state = createSlice({
    name: "state",
    initialState: initialState,
    reducers: {
        addKbEntry(state, action) {
            state.kbEntries.push(action.payload);
        },
        setKbEntries(state, action) {
            state.kbEntries = action.payload;
        },
        addFilterTag(state, action) {
            state.filterTags.push(action.payload);
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;