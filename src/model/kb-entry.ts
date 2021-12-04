import {Tag} from "./tag";

export interface KbEntry {
    id: number;
    title: string;
    desc: string;
    markdown: boolean;
    tags: Tag[];
}