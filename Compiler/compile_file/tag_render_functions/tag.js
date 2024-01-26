import ejs from "ejs";
import path from "path";

export default function add_tag_rendering_fun(tag, rendering_object){
    const after_content = tag.tag_conf.js_files.filter(f => f.position == "AFTER_CONTENT");
    tag.render_self = () => {
        const rendered_string = ejs.render(tag.tag_conf.ejs_content, {
            ...rendering_object,
            ...tag,
            ...tag_rendering_utils(tag)
        }, {
            async: false,
            filename: path.resolve(tag.tag_conf.ejs_entry)
        });
        
        return rendered_string + after_content.map(js => {
            if (js.is_module){
                return `<script type="module" src="${ js.path }"></script>`
            }
            return `<script src="${ js.path }"></script>`
        }).join("");
    }
}

function tag_rendering_utils(tag){
    return {
        get_attr: (...args) => get_attr(tag, ...args)
    }
}

function get_attr(tag, ...args){
    // args[0] == Attribute name (up to case)
    // args[1] == default value, if not given => error
    const ret = tag.attributes.filter(t => {
        return t.name.toUpperCase() == args[0].toUpperCase();
    });

    if (ret.length > 0) {
        return ret[0];
    }
    if (args.length > 1) {
        return {
            name: args[0].toUpperCase(),
            value: args[1],
            type: "_fallback",
            throw: tag.throw
        }
    }
    tag.throw("Attribute " + args[0].toUpperCase() + " is not defined!");
}