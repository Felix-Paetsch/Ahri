import process_tags from "./process_tags.js";
import add_tag_rendering_functions from "./add_tag_rendering_functions.js";

export default function compile_file(file_AST, resources){
    add_tag_rendering_functions(resources);

    const {
        css_dependencies,
        js_dependencies
    } = process_tags(file_AST, resources);
}