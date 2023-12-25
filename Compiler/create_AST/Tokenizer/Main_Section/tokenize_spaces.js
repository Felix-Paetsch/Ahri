// Current char is the first \s char

export default function tokenize_whitespace(text_walker){
    const space_start_position = text_walker.get_current_text_pos();
    let space = text_walker.current();;

    for (let char of text_walker){
        if (char == " "){
            space += char;
        } else{
            text_walker.previous();
            break;
        }
    }
    
    return [{
        "type": "WHITESPACE",
        "value": space,
        "original_value": space,
        "position": space_start_position
    }]
}