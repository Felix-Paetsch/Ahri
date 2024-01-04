import { assert } from '../../debug/main.js'
import tokenize_end_line_whitespace from '../Common/tokenize_end_line_whitespace.js';

export default function tokenize_attr(text_walker) {
    assert(text_walker.current() == "[");

    const ret = [{
        "type":  "ATTRIBUTE_START",
        "value": "[",
        "original_value": "[",
        "position": text_walker.get_current_text_pos()
    }];

    ret.push(tokenize_attr_name(text_walker));

    if (text_walker.current() === ":"){
        ret.push({
            "type":  "ATTRIBUTE_SEP",
            "value": ":",
            "original_value": ":",
            "position": text_walker.get_current_text_pos()
        });

        ret.push(tokenize_attr_value(text_walker));
    }

    text_walker.assert(text_walker.current() === "]", `Expected attr end "]"`);
    text_walker.next();
    
    ret.push({
        "type":  "ATTRIBUTE_END",
        "value": "]",
        "original_value": "]",
        "position": text_walker.get_current_text_pos()
    }, ...tokenize_end_line_whitespace(text_walker));

    return ret;
}

function tokenize_attr_name(text_walker){
    assert(text_walker.current() == "[");

    let parsed_string = "";
    let src_string    = "";

    text_walker.next();
    let attr_name_start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if (["]", ":"].includes(char)) break;

        text_walker.assert(!["\n", "["].includes(char), `Expected ":" or "]" for attr value or attr end`);

        if (char == "+"){
            parsed_string += " ";
            src_string += char;
            continue;
        }
        if ("\\" == char){
            if (["]", ":", "\\", "[", "+"].includes(text_walker.look_ahead())){
                const next_char = text_walker.next();
                parsed_string  += next_char;
                src_string     += "\\" + next_char;
                continue;
            }
        }
        parsed_string += char;
        src_string += char;
    }

    text_walker.assert(src_string.length > 0, `Expected attribute name`);
    text_walker.assert(["]", ":"].includes(text_walker.current()), `Expected ":" or "]" for attr value or attr end`);

    return {
        "type": "ATTRIBUTE_NAME",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_name_start_position
    }
}

function tokenize_attr_value(text_walker){
    assert(text_walker.current() == ":");

    let parsed_string = "";
    let src_string    = "";
    
    text_walker.next();
    let attr_value_start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if (char == "]") break;
        
        text_walker.assert(!["\n", "["].includes(char), `Attribute value not valid`);
        
        if (char == "+"){
            parsed_string += " ";
            src_string += char;
            continue;
        }
        if ("\\" == char){
            if (["]", "\\", "[", "+"].includes(text_walker.look_ahead())){
                const next_char = text_walker.next();
                parsed_string  += next_char;
                src_string     += "\\" + next_char;
                continue;
            }
        }
        parsed_string += char;
        src_string += char;
    }

    text_walker.assert(src_string.length > 0, `Expected attribute value`);

    return {
        "type": "ATTRIBUTE_VALUE",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_value_start_position
    }
}