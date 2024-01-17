// Tag from AST not from resources
import add_code_emedding_rendering_fun from "./code_embedding.js";
import add_tag_rendering_fun from "./tag.js"
import { invalid_path } from "../../debug/main.js";

export default function add_tag_rendering_function(tag, rendering_object = {}){
    if (tag.type == "CODE_EMBEDDING"){
        return add_code_emedding_rendering_fun(tag);
    }

    if (["TAG", "SECTION"].includes(tag.type)){
        return add_tag_rendering_fun(tag, rendering_object);
    }

    invalid_path();
}