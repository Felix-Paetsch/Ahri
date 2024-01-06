import { assert } from '../../debug/main.js';
import parse_plain_text from "../../Sub_Parser/plain_text.js";
import tokenize_end_line_whitespace from '../Common/tokenize_end_line_whitespace.js';

export default function tokenize_plain_text(text_walker){
    assert(!["\n", " "].includes(text_walker.current()));

    let start_pos = text_walker.get_current_text_pos();
    let text      = "";

    text_walker.step_back();
    for (let char of text_walker){
        if (char !== "\n" && !(char == " " && text_walker.look_ahead() == "\\" && text_walker.look_ahead(2) == "\n")){
            text += char;
        } else {
            break;
        }
    }

    return [{
        "type": "TEXT_SECTION",
        "value": parse_plain_text(text),
        "original_value": text,
        "position": start_pos
    }, ...tokenize_end_line_whitespace(text_walker)];
}