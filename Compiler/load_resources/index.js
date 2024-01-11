import fs from "fs";
import path from "path";
import updated_json from "./validate_and_update_json.js";

export default function load_resources(path_arr = "./Resources", page_template_folder = null){
    if (!(path_arr instanceof Array)){
        path_arr = [path_arr];
    }

    const loaded_tags = [];
    path_arr.reverse(); // So the later tags overwrite the earlier tags
    for (const folder of path_arr) {
        const folder_tags = load_resources_from_folder(folder);
        for (const tag of folder_tags) {
            if (tag.page_template === true || !loaded_tags.some(loadedTag => loadedTag.tag_name === tag.tag_name)) {
                loaded_tags.push(tag);
            }
        }
    }

    if (page_template_folder !== null){
        return {
            tags: loaded_tags.filter(t => t.page_template === false),
            page_template: load_resources_from_folder(page_template_folder)
        }
    }

    const page_template = loaded_tags.filter(t => t.page_template)[0];

    if (typeof page_template == "undefined") throw new Error("The parsed resources don't contain a page template");
    
    return {
        page_template,
        tags: loaded_tags.filter(t => t.page_template === false)
    }
}

function load_resources_from_folder(folder) {
    const loaded_tags = [];

    let items;
    items = fs.readdirSync(folder, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(folder, item.name);
        if (item.isDirectory()) {
            loaded_tags.push(...load_resources_from_folder(fullPath));
        } else if (item.isFile() && path.extname(item.name) === '.json') {
            console.log(`Load: ${ fullPath }`);
            loaded_tags.push(updated_json(folder, fullPath));
        }
    }

    return loaded_tags;
}