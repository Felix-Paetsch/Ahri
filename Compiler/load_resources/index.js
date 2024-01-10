import fs from "fs";
import path from "path";
import updated_json from "./validate_and_update_json.js";

export default function load_resources(path_arr){
    if (!(path_arr instanceof Array)){
        path_arr = [path_arr];
    }

    const loaded_tags = [];
    path_arr.reverse(); // So the later tags overwrite the earlier tags
    for (const folder of path_arr) {
        const folder_tags = load_resources_from_folder(folder);
        for (const tag of folder_tags) {
            if (!loaded_tags.some(loadedTag => loadedTag.tag_name === tag.tag_name)) {
                loaded_tags.push(tag);
            }
        }
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
            loaded_tags.push(load_resource_in_folder(folder, fullPath));
        }
    }

    return loaded_tags;
}

function load_resource_in_folder(folder, config_file_path) {
    // Your logic to load resource in the folder
    console.log('Loading resource from file:', config_file_path);
    console.log(updated_json(folder, config_file_path));
    return {};
}