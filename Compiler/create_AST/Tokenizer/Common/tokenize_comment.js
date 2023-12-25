// Current char is the first "/"

export default function tokenize_comment(text_walker){
    const comment_start_position = text_walker.get_current_text_pos();
    let comment = "";

    text_walker.next();

    for (let char of text_walker){
        if (char == "\n"){
            text_walker.previous();
            break;
        };
        comment += char;
    }
    
    return [{
        "type": "INLINE_COMMENT",
        "value": comment,
        "original_value": "//" + comment,
        "position": comment_start_position
    }]
}