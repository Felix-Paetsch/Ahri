import { assert } from '../../../debug/main.js'
import tokenize_end_line_whitespace from "../Common/tokenize_end_line_whitespace.js"
import parse_code_embedding from "../../Sub_Parser/code_embedding.js";

export default function tokenize_code_embedding(text_walker){
    assert(text_walker.current() == "`" && text_walker.next() == "`" && text_walker.next() == "`");

    let start_pos = text_walker.get_current_text_pos();
    let val          = "";
    let original_val = "```";

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

    const {
        language,
        dependencies,
        code
    } = parse_code_embedding(val, (msg) => {
        text_walker.throw_error_at(msg, start_pos)
    });

    return [{
        "type": "CODE_EMBEDDING",
        "value": val,
        "original_value": original_val,
        "position": start_pos,
        language,
        dependencies,
        code
    }, ...tokenize_end_line_whitespace(text_walker)];
}