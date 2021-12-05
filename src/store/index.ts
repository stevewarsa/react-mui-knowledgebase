import {configureStore, createSlice} from "@reduxjs/toolkit";
import {KbEntry} from "../model/kb-entry";
import {Tag} from "../model/tag";

export interface KbState {
    kbEntries: KbEntry[];
    editingEntry: KbEntry;
    filterTags: Tag[];
    allTags: Tag[];
    nextTagId: number;
}

const initialState: KbState = {kbEntries: [], editingEntry: null, filterTags: [], allTags: [], nextTagId: 1} as KbState;

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
            let maxTagId: number = 0;
            state.allTags.forEach(tg => {
                if (tg.tagId > maxTagId) {
                    maxTagId = tg.tagId;
                }
            });
            state.nextTagId = maxTagId + 1;
        },
        addNewTag(state, action) {
            state.allTags.push({ ...action.payload, tagId: state.nextTagId });
            state.nextTagId += 1;
        },
        setEditingKbEntry(state, action) {
            state.editingEntry = action.payload;
        },
        clearEditingKbEntry(state) {
            state.editingEntry = null;
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;