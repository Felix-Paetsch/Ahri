import { assert } from '../../debug/main.js'

export default function tokenize_whitespace(text_walker){
    assert(/\s/.test(text_walker.current()));

    const whitespace_start_position = text_walker.get_current_text_pos();
    let space = text_walker.current();

    for (let char of text_walker){
        if (/\s/.test(char)){
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
        "position": whitespace_start_position
    }]
}