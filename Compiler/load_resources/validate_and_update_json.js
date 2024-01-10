import fs from "fs";
import update_component_template_json from "./validate_tag_conf.js"
import update_page_template_json from "./validate_page_conf.js";

export default function updated_json(folder, config_file_path){
    const CONF = JSON.parse(fs.readFileSync(config_file_path, 'utf8'));
    add_manipultation_fun(CONF, folder);
    
    if (!CONF.get_set("_is_template", true)){
        return {
            template_type: null // "TAG", "PAGE"
        }
    }

    if (CONF.get_set("page_template", false)){
        update_page_template_json(CONF, folder)
    } else {
        update_component_template_json(CONF, folder)
    }

    CONF.folder = folder;
    return CONF
}

function add_manipultation_fun(object, folder){
    object.get_set = (function (key, def = null) {
        if (this.hasOwnProperty(key)){
            return object[key]
        }

        object[key] = def;
        return def;
    }).bind(object);

    object.assert = (bool, err) => {
        if (!bool) {
            object.throw(err);
        }
    }

    object.throw = (err) => {
        if (!bool) {
            console.log("Error with component:", folder)
            throw new Error(err)
        }
    }
}