// Tag from AST not from resources
import add_code_emedding_rendering_fun from "./code_embedding.js"

export default function add_tag_rendering_function(tag){
    if (tag.type == "CODE_EMBEDDING"){
        return add_code_emedding_rendering_fun(tag);
    }

    console.log(tag);

    /*tag.render_self = () => {
        return "";
    }


    console.log(tag);*/
}