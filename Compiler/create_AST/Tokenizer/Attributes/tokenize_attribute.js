// Current char is "["

export default function tokenize_attr(text_walker) {
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

    if (text_walker.current() !== "]"){
        text_walker.throw_error_at(`Expected attr end "]"`, text_walker.get_current_text_pos());
    }

    ret.push({
        "type":  "ATTRIBUTE_END",
        "value": "]",
        "original_value": "]",
        "position": text_walker.get_current_text_pos()
    });

    return ret;
}

function tokenize_attr_name(text_walker){
    // Current char is "["
    let parsed_string = "";
    let src_string    = "";

    text_walker.next();
    let attr_name_start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if (["]", ":"].includes(char)) break;
        if (["\n", "["].includes(char)){
            text_walker.throw_error_at(`Expected ":" or "]" for attr value or attr end`, text_walker.get_current_text_pos());
        }
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

    if (src_string.length == 0){
        text_walker.throw_error_at(`Expected attribute name`, text_walker.get_current_text_pos());
    }

    if (!["]", ":"].includes(text_walker.current())){
        text_walker.throw_error_at(`Expected ":" or "]" for attr value or attr end`, text_walker.get_current_text_pos());
    }

    return {
        "type": "ATTRIBUTE_NAME",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_name_start_position
    }
}

function tokenize_attr_value(text_walker){
    // Current char is ":"
    let parsed_string = "";
    let src_string    = "";
    
    text_walker.next();
    let attr_value_start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if (char == "]") break;
        if (["\n", "["].includes(char)){
            text_walker.throw_error_at_current(`Expected attribute value`);
        }
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

    if (src_string.length == 0){
        text_walker.throw_error_at_current(`Expected attribute value`);
    }
    
    // We check above that attribute actually ends with "]"

    return {
        "type": "ATTRIBUTE_VALUE",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_value_start_position
    }
}