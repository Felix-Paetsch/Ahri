import {
    create_ejs_entry,
    create_descr,
    update_or_create_css_files_key,
    update_or_create_js_files_key
} from "./validate_common.js"

export default function update_component_template_json(CONF, folder){
    CONF.assert(typeof CONF.tag_name == "string", "Invalid tag name");
    CONF.tag_name = CONF.tag_name.toLowerCase();

    create_ejs_entry(CONF, folder);
    create_descr(CONF, folder);

    update_or_create_css_files_key(CONF, folder);
    update_or_create_js_files_key(CONF, folder);

    CONF.get_set("string_attributes", 0);
    if (typeof CONF.string_attributes === 'number' && !isNaN(CONF.string_attributes)){
        CONF.string_attributes = [CONF.string_attributes, CONF.string_attributes];
    }

    if (!(CONF.get_set("attributes", []) instanceof Array)){
        CONF.attributes = [CONF.attributes];
    }

    CONF.attributes.forEach(a => {
        if (typeof a.required == "undefined"){
            a.required = true;
        }

        if (typeof a.default == "undefined"){
            a.default = null;
        }

        if (typeof a.options !== "undefined"){
            a.type = "enum";
            a.options = a.options.map(v => v.toUpperCase());
        }

        if (typeof a.type == "undefined"){
            a.type == "boolean"
        }

        a.name = a.name.toUpperCase();
    });
}