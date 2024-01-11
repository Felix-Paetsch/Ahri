import clean_tag from "./clean_tag.js";
import get_tag_required_resources from "./get_tag_required_resources.js";
import get_code_snippet_required_resources from "./get_code_snippet_required_resources.js";

export default function process_tags(file_AST, resources, external_files_prefix){
    let iterator;
    if (resources.page_template.has_content_sections){
        iterator = tag_iterator(file_AST.body);
    } else {
        if (file_AST.body.length > 1){
            file_AST.throw("Template doesn't support content sections");
        }

        iterator = tag_iterator(file_AST.body[0]);
    }

    const js_dependencies = [];
    const css_dependencies = [];
    const code_snippet_files = [];

    for (const tag of iterator){
        if (tag.type == "CODE_EMBEDDING"){
            const { js, css, code_snippets } = get_code_snippet_required_resources(tag);
            js_dependencies.push(...js);
            css_dependencies.push(...css);
            code_snippet_files.push(...code_snippets);
        } else {
            clean_tag(tag, resources);
            const { js, css } = get_tag_required_resources(tag);
            js_dependencies.push(...js);
            css_dependencies.push(...css);
        }
    }

    js_dependencies.sort((a, b) => {
        if (a.position !== b.position) {
            return a.position - b.position;
        }
        return a.path.localeCompare(b.path);
    });

    css_dependencies.sort((a, b) => {
        if (a.position !== b.position) {
            return a.position - b.position;
        }
        return a.path.localeCompare(b.path);
    });

    return {
        js_dependencies,
        css_dependencies,
        code_snippet_files
    };
}

function* tag_iterator(tag_array){
    for (const t of tag_array){
        yield t
        if (typeof t.children == "undefined"){
            continue;
        }
        yield* tag_iterator(t.children);
    }
}