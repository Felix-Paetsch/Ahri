import katex from "katex"

export function create_rendering_object(file_AST){
    function* get_uid() {
        let i = 0;
        while (true) {
            yield 'compile_uid__' + (++i);
        }
    }
    
    const uidGenerator = get_uid();
    const _throw = (msg) => {
        let fp;
        try {
            fp = file_AST.meta.file_path;
        } catch {
            fp = "";
        }

        rendering_throw(msg, fp)
    };

    const _internal_throw = (msg) => {
        let fp;
        try {
            fp = file_AST.meta.file_path;
        } catch {
            fp = "";
        }

        rendering_throw(msg, true, fp)
    };
    
    return {
        get_uid: () => {
            return uidGenerator.next().value
        },
        data: {},
        throw: _throw,
        assert: (b, msg) => {
            if (!b) _throw(msg);
        },
        katex,
        internal_throw: _internal_throw,
        internal_assert: (b, msg) => {
            if (!b) _internal_throw(msg);
        },
        attributes: file_AST.attributes
    }   
}

function rendering_throw(msg, internal = false, fp = ""){
    console.log(`There was an ${ internal ? "INTERNAL " : ""}error during compiling:`);
    console.log("");
    if (fp !== ""){
        console.log(`File: ${ fp }`)
    }

    if (!internal){
        console.log(`[ no specific line]`);
    }

    console.log("==========================")
    console.log(" ", msg);
    
    console.log("\n---- end of error msg ----");
    throw new Error(`Error during compiling: ${msg}`);
}

export function update_rendering_object_for_template(
    rendering_object, file_AST, resources, css_dependencies, js_dependencies
){
    rendering_object.css_requirements  = css_dependencies.map(d => d.path);
    rendering_object.js_requirements   = {
        page_begin: js_dependencies.filter(r => r.position == "DOCUMENT_BEGIN").map(r => {
            return {
                path: r.path,
                is_module: r.is_module
            }
        }),
        page_end: js_dependencies.filter(r => r.position == "DOCUMENT_END").map(r => {
            return {
                path: r.path,
                is_module: r.is_module
            }
        }),
    }

    if (resources.page_template.has_content_sections){
        rendering_object.content_sections = file_AST.body;
    } else {
        rendering_object.content  = file_AST.body[0].children;
        rendering_object.children = file_AST.body[0].children;
    }
}