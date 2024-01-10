import fs from "fs";
import path from "path";

export function update_or_create_css_files_key(CONF, folder){
    if (CONF.get_set("css_files", null) == null){
        CONF["css_files"] = fs.readdirSync(folder)
                                .filter(file => path.extname(file) === '.css')
                                .map(f => {
                                    return {
                                        "path": `$/${ f }`,
                                        "loading_index": 5
                                    }});
    }

    if (!(CONF["css_files"] instanceof Array)){
        CONF["css_files"] = [CONF["css_files"]]
    }

    for (let i = 0; i < CONF["css_files"].length; i++){
        if (typeof CONF["css_files"][i] == "string"){
            CONF["css_files"][i] = {
                "path": CONF["css_files"][i]
            }
        }

        if (typeof CONF["css_files"][i]["loading_index"] == "undefined"){
            CONF["css_files"][i]["loading_index"] = 5
        }
    }
}

export function update_or_create_js_files_key(CONF, folder){
    if (CONF.get_set("js_files", null) == null){
        const jsFiles = fs.readdirSync(folder).filter(file => path.extname(file) === '.js');
    
        if (jsFiles.length === 1 || jsFiles.includes('entry.js')) {
            CONF["js_files"] = jsFiles.includes('entry.js') ? '$/entry.js' : "$/" + jsFiles[0];
        } else {
            CONF["js_files"] = [];
        }
    }

    if (!(CONF["js_files"] instanceof Array)){
        CONF["js_files"] = [CONF["js_files"]]
    }

    for (let i = 0; i < CONF["css_files"].length; i++){
        if (typeof CONF["js_files"][i] == "string"){
            CONF["js_files"][i] = {
                "path": CONF["css_files"][i]
            }
        }

        if (typeof CONF["js_files"][i]["loading_index"] == "undefined"){
            CONF["js_files"][i]["loading_index"] = 5
        }

        if (typeof CONF["js_files"][i]["is_module"] == "undefined"){
            CONF["js_files"][i]["is_module"] = true
        }

        if (typeof CONF["js_files"][i]["position"] == "undefined"){
            CONF["js_files"][i]["position"] = "DOCUMENT_END"
        }

        CONF["js_files"][i]["position"] = CONF["js_files"][i]["position"].toUpperCase();
    }
}

export function create_ejs_entry(CONF, folder){
    if (CONF.get_set("ejs_entry", null) == null){
        const entryFile = path.join(folder, 'entry.ejs');

        if (fs.existsSync(entryFile)) {
            CONF.ejs_entry = 'entry.ejs';
        } else {
            // Find all .ejs files in the folder
            const ejsFiles = fs.readdirSync(folder).filter(file => path.extname(file) === '.ejs');

            if (ejsFiles.length === 1) {
                // If there's exactly one EJS file, use that
                CONF.ejs_entry = "$/" + ejsFiles[0];
            } else {
                // If there are none or more than one, throw an error
                CONF.throw("Unable to determine the EJS entry file.");
            }
        }
    }
}

export function create_descr(CONF, folder){
    if (CONF.get_set("descr", null) == null){
        const descrFile = path.join(folder, 'description.md');
    
        if (fs.existsSync(descrFile)) {
            CONF.descr = fs.readFileSync(descrFile, 'utf8');
        } else {
            const mdFiles = fs.readdirSync(folder).filter(file => path.extname(file) === '.md');
    
            if (mdFiles.length === 1) {
                CONF.descr = fs.readFileSync(path.join(folder, mdFiles[0]), 'utf8');
            } else {
                CONF.descr = `Component: ${ CONF.tag_name.toUpperCase() }`
            }
        }
    } else if (CONF.descr.startsWith("$")){
        CONF.descr = fs.readFileSync(path.join(folder, "." + CONF.descr.slice(1)), 'utf8');
    } 
}