import process_tags from "./process_tags.js";

export default function compile_file(file_AST, resources){
    const {
        css_dependencies,
        js_dependencies
    } = process_tags(file_AST, resources);
}