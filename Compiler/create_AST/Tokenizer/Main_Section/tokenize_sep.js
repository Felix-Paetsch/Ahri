import { assert } from '../../debug/main.js'

export default function tokenize_sep(text_walker){
    assert(text_walker.current() == "=");

    const start_position = text_walker.get_current_text_pos();
    let sep = text_walker.current();

    for (let char of text_walker){
        if (char == "="){
            sep += char;
        } else {
            break;
        }
    }

    const ret = [{
        "type": "SECTION_SEPERATOR",
        "value": "",
        "original_value": sep,
        "position": start_position
    }];

    const current_after_sep = text_walker.current();

    if (current_after_sep === false || current_after_sep === "\n"){
        return ret
    }

    const sep_comment_start_position = text_walker.get_current_text_pos();
    let sep_comment = text_walker.current();
    for (let char of text_walker){
        if (char != "\n" && char !== false){
            sep_comment += char;
        } else{
            text_walker.previous();
            break;
        }
    }

    ret.push({
        "type": "SECTION_SEPERATOR_COMMENT",
        "value": "",
        "original_value": sep_comment,
        "position": sep_comment_start_position
    });
    return ret;
}