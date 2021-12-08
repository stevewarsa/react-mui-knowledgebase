import {configureStore, createSlice} from "@reduxjs/toolkit";
import {KbEntry} from "../model/kb-entry";
import {Tag} from "../model/tag";

export interface KbState {
    kbEntries: KbEntry[];
    editingEntry: KbEntry;
    filterTags: Tag[];
    allTags: Tag[];
    nextTagId: number;
    filteredEntries: KbEntry[];
}

const initialState: KbState = {kbEntries: [], editingEntry: null, filterTags: [], allTags: [], nextTagId: 1, filteredEntries: []} as KbState;

const state = createSlice({
    name: "state",
    initialState: initialState,
    reducers: {
        addKbEntry(state, action) {
            const incomingKb = action.payload as KbEntry;
            const matchingKbIndexFromStore = state.kbEntries.findIndex(kb => kb.id === incomingKb.id);
            if (matchingKbIndexFromStore >= 0) {
                console.log("addKbEntry - the incoming KB already exists in the store at index '" +
                    matchingKbIndexFromStore + "', replacing store KB with it...");
                state.kbEntries[matchingKbIndexFromStore] = incomingKb;
            } else {
                console.log("addKbEntry - the incoming KB does NOT exist in the store, adding it...");
                state.kbEntries.unshift(action.payload);
            }
        },
        setKbEntries(state, action) {
            state.kbEntries = action.payload;
            state.filteredEntries = action.payload;
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
        },
        setFilteredEntries(state, action) {
            if (action.payload) {
                state.filteredEntries = action.payload;
            }
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;