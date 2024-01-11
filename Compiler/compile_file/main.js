import clean_tag from "./clean_tag.js";

export default function compile_file(file_AST, resources, external_files_prefix = "generated_"){
    const {
        css_dependencies,
        js_dependencies
    } = process_tags(file_AST, resources);
}

function process_tags(file_AST, resources){
    let iterator;
    if (resources.page_template.has_content_sections){
        iterator = tag_iterator(file_AST.body);
    } else {
        if (file_AST.body.length > 1){
            file_AST.throw("Template doesn't support content sections");
        }

        iterator = tag_iterator(file_AST.body[0]);
    }

    for (const tag of iterator){
        clean_tag(tag, resources);
    }

    return {};
}

function* tag_iterator(tag_array){
    for (const t of tag_array){
        yield t
        yield* tag_iterator(t.children);
    }
}