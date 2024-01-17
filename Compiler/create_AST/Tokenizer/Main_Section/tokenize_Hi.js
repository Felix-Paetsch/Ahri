import { assert } from '../../../debug/main.js'
import parse_plain_text from "../../Sub_Parser/plain_text.js";

export default function tokenize_Hi(text_walker){
    assert(text_walker.current() == "#");

    const start_position = text_walker.get_current_text_pos();

    let original_value = text_walker.current();
    let value = ""

    while (text_walker.next() == "#"){
        original_value += "#";
    }

    const amt = original_value.length;

    text_walker.assert(amt < 6, "To many hashtags, use between 1 and 6");
    text_walker.assert(text_walker.current() == " ", 'Expected " "');

    original_value += " ";

    for (let char of text_walker){
        if (char === false) {
            break;
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            text_walker.step_back();
            break;
        } else if (char == "\\" && ["\\", "/"].includes(text_walker.look_ahead())){
            let next_char = text_walker.next();
            value += next_char;
            original_value += "\\" + next_char;
        } else if (char == "\n"){
            text_walker.step_back();
            break;
        } else {
            value += char;
            original_value += char;
        }
    }

    value = value.trim();
    text_walker.assert(value.length > 0, "Heading is empty")
    
    return [{
        "type": "HEADING",
        "value": parse_plain_text(value),
        "original_value": original_value,
        "position": start_position,
        amt
    }]
}