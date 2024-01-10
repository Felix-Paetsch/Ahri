import remove_comments from "./remove_comments.js";
import insert_first_section_sep from "./insert_first_section_sep.js";
import expand_self_closing_tags from "./expand_self_closing_tags.js";
import replace_h1_to_h6_with_tags from "./replace_h1_to_h6_with_tags.js";
import replace_list_items from "./replace_list_items.js";
import remove_new_lines from "./remove_new_lines.js";

export default function pre_process_tokens(token_walker){
    remove_comments(token_walker);
    insert_first_section_sep(token_walker);
    expand_self_closing_tags(token_walker);
    replace_h1_to_h6_with_tags(token_walker);
    replace_list_items(token_walker);
    remove_new_lines(token_walker);
}