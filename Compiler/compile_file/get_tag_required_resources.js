/*

The returned paths will either be :
Urls
Relative to locahlost:8000/      - §/wha
Relative to the script calling_folder   - $/Resources/

*/

import path from "path";

export default function get_required_resources(tag){
    return {
        js: tag.tag_conf.js_files.map(f => {
            return {
                ...f,
                path: update_file_path(f.path, tag.tag_conf.folder, tag.tag_conf)
            }
        }),
        css: tag.tag_conf.css_files.map(f => {
            return {
                ...f,
                path: update_file_path(f.path, tag.tag_conf.folder, tag.tag_conf)
            }
        })
    };
}

function update_file_path(fp, folder_path, tag_conf){
    if (fp.startsWith("http") || fp.startsWith("§")){
        return fp;
    }

    if (!fp.startsWith("$/")){
        tag_conf.throw("Invalid path in config file: " + fp);
    }

    fp = "." + fp.slice(1);

    return `$/${ path.join(folder_path, fp) }`;
}