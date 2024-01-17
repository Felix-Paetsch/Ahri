import { assert } from '../../../debug/main.js';
import tokenize_end_line_whitespace from '../Common/tokenize_end_line_whitespace.js';
import compile_plain_text from "../../Sub_Parser/plain_text.js"

export default function tokenize_list_item(text_walker){
    const item_type = text_walker.current();
    assert((item_type == "-" || item_type == "*") && text_walker.look_ahead() === " ");

    let start_pos = text_walker.get_current_text_pos();
    let text = "";
    text_walker.next();

    // We are on whitespace after "-" or "*"
    for (let char of text_walker){
        if (char !== "\n" && !(char == " " && text_walker.look_ahead() == "\\" && text_walker.look_ahead(2) == "\n")){
            text += char;
        } else {
            break;
        }
    }

    return [{
        "type": "LIST_ITEM",
        "value": compile_plain_text(text),
        "list_type": item_type,
        "original_value": item_type + " " + text,
        "position": start_pos
    }, ...tokenize_end_line_whitespace(text_walker)];
}