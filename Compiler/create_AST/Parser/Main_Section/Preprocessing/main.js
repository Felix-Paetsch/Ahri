import insert_first_section_sep from "./insert_first_section_sep.js";
import replace_h1_to_h6_with_tags from "./replace_h1_to_h6_with_tags.js";
import replace_list_items from "./replace_list_items.js";

export default function pre_process_tokens(token_walker){
    insert_first_section_sep(token_walker);
    replace_h1_to_h6_with_tags(token_walker);
    replace_list_items(token_walker);
    console.log(token_walker.get_tokens());
    return [];
}