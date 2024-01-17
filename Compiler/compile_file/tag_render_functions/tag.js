import { render } from "ejs";

export default function add_tag_rendering_fun(tag, rendering_object){
    const after_content = tag.tag_conf.js_files.filter(f => f.position == "AFTER_CONTENT");
    tag.render_self_with_params = () => {
        rendered_string = render(tag.tag_conf.ejs_code, rendering_object, { async: false });
        return rendered_string + after_content.map(js => {
            if (js.is_module){
                return `<script type="module" src="${ js.path }"></script>`
            }
            return `<script src="${ js.path }"></script>`
        }).join("");
    }
}