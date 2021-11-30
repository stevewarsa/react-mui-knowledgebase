import axios from "axios";
import {KbEntry} from "../model/kb-entry";
import {Tag} from "../model/tag";

class KbService {
    public getEntries() {
        return axios.get("/kb/server/get_kb_entries.php");
    }

    public addEntry(entry: KbEntry) {
        return axios.post("/kb/server/add_kb_entry.php", entry);
    }

    public getTags() {
        return axios.get("/kb/server/get_tag_list.php");
    }

    public addNewTag(tag: Tag) {
        return axios.post("/kb/server/add_new_tag.php", tag);
    }
}

export default new KbService();