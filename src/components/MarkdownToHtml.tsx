import React from 'react'
import ReactMarkdown from 'react-markdown'
export default function MarkdownToHtml({markdown}){
    return(
        <ReactMarkdown>{markdown}</ReactMarkdown>
    );
}