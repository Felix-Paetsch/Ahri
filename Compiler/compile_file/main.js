import process_tags from "./process_tags.js";
import ejs from "ejs";
import { create_rendering_object, update_rendering_object_for_template } from "./rendering_object.js";

export default function compile_file(file_AST, resources){
    const rendering_object = create_rendering_object(file_AST);

    const {
        css_dependencies,
        js_dependencies
    } = process_tags(file_AST, resources, rendering_object);

    update_rendering_object_for_template(rendering_object, file_AST, resources, css_dependencies, js_dependencies)
    return ejs.renderFile(resources.page_template.ejs_entry, {});
}