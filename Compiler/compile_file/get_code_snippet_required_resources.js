/*

The returned paths will either be :
Urls
Relative to locahlost:8000/           - §/wha
Relative to the script calling_folder - $/Resources/
Code snippet path                     - %/Code_snippet_path

*/

import path from "path";

export default function get_code_snippet_required_resources(snippet){
    // console.log(snippet);
    return {
        js: [],
        css: [],
        code_snippets: []
    };
}