import ejs from "ejs";
import path from "path";

export default function add_tag_rendering_fun(tag, rendering_object){
    const after_content = tag.tag_conf.js_files.filter(f => f.position == "AFTER_CONTENT");
    tag.render_self = () => {
        const rendered_string = ejs.render(tag.tag_conf.ejs_content, {
            ...rendering_object,
            ...tag
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