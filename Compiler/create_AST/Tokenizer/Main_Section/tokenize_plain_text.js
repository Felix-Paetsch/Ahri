import { assert } from '../../debug/main.js'

export default function tokenize_plain_text(text_walker){
    assert(!["\n", " "].includes(text_walker.current()));

    let start_pos = text_walker.get_current_text_pos();
    let text      = "";

    text_walker.step_back();
    for (let char of text_walker){
        if (char !== "\n"){
            text += char;
        } else {
            text_walker.step_back();
            break;
        }
    }

    return [{
        "type": "TEXT_SECTION",
        "value": text,
        "original_value": text,
        "tokens": [],
        "position": start_pos
    }];
}