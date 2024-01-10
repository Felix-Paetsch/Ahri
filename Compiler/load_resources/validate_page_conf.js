import {
    create_ejs_entry,
    create_descr,
    update_or_create_css_files_key,
    update_or_create_js_files_key
} from "./validate_common.js"

export default function update_page_template_json(CONF, folder){
    create_ejs_entry(CONF, folder);
    create_descr(CONF, folder);

    update_or_create_css_files_key(CONF, folder);
    update_or_create_js_files_key(CONF, folder);

    CONF.get_set("has_content_sections", true);
}