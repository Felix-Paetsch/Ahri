// Current char is the first "<" char

export default function tokenize_tag_end(text_walker){
    const start_position = text_walker.get_current_text_pos();
    let val = text_walker.current();

    for (let char of text_walker){
        if (char == "<"){
            val += char;
        } else {
            break;
        }
    }

    const ret = [{
        "type": "TAG_END",
        "value": val,
        "original_value": val,
        "position": start_position,
        amt: val.length
    }];

    const current_after_tag_end = text_walker.current();

    if (current_after_tag_end === false || current_after_tag_end === "\n"){
        return ret
    }

    const tag_end_comment_start_position = text_walker.get_current_text_pos();
    let tag_end_comment = current_after_tag_end;
    for (let char of text_walker){
        if (char != "\n" && char !== false){
            tag_end_comment += char;
        } else{
            text_walker.previous();
            break;
        }
    }

    ret.push({
        "type": "TAG_END_COMMENT",
        "value": "",
        "original_value": tag_end_comment,
        "position": tag_end_comment_start_position
    });
    return ret;
}