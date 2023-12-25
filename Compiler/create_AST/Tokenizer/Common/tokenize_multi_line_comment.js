// Current char is the first "/"

export default function tokenize_multi_line_comment(text_walker){
    const comment_start_position = text_walker.get_current_text_pos();
    let comment = "";
    let comment_finished = false;

    text_walker.next();

    for (let char of text_walker){
        if (char == "\\" && text_walker.look_ahead() !== false){
            comment += char + text_walker.next();
        } else if (char == "*" && text_walker.look_ahead() == "/") {
            comment_finished = true;
            text_walker.next();
            break;
        };
        comment += char;
    }

    if (!comment_finished){
        text_walker.throw_error_at("Multiline comment does not get closed", comment_start_position);
    }
    
    return [{
        "type": "MUTLILINE_COMMENT",
        "value": comment,
        "original_value": "/*" + comment + "*/",
        "position": comment_start_position
    }]
}