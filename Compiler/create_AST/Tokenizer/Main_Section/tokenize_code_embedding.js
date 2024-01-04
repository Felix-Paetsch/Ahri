import { assert } from '../../debug/main.js'
import tokenize_end_line_whitespace from "../Common/tokenize_end_line_whitespace.js"

export default function tokenize_code_embedding(text_walker){
    assert(text_walker.current() == "`" && text_walker.next() == "`" && text_walker.next() == "`");

    let start_pos = text_walker.get_current_text_pos();
    let val          = "";
    let original_val = "```";
    text_walker.step_forward(2);

    for (let char of text_walker){
        if (char == "`" && text_walker.look_ahead() == "`" && text_walker.look_ahead(2) == "`"){
            original_val += "```";
            text_walker.next();
            text_walker.next();
            break;
        }
        val += char;
        original_val += char;
    }

    // We are expected to be on last "```"
    text_walker.assert(
        text_walker.current() == "`" && text_walker.look_back() == "`" && text_walker.look_back(2) == "`",
        "Code embedding doesn't close",
        start_pos
    );

    text_walker.next();

    return [{
        "type": "CODE_EMBEDDING",
        "value": val,
        "original_value": original_val,
        "tokens": [],
        "position": start_pos
    }, ...tokenize_end_line_whitespace(text_walker)];
}