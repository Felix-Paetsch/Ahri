import clean_tag from "./clean_tag.js";
import add_tag_rendering_function from "./tag_render_functions/add_tag_rendering_function.js";

export default function process_tags(file_AST, resources, rendering_object = {}){
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

    for (const tag of iterator){
        if (tag.type !== "CODE_EMBEDDING"){
            clean_tag(tag, resources);
            js_dependencies.push(...tag.tag_conf.js_files.filter(f => f.position !== "AFTER_CONTENT"));
            css_dependencies.push(...tag.tag_conf.css_files);
        }

        add_tag_rendering_function(tag, rendering_object);
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
        css_dependencies
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