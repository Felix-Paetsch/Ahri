// Current char is the first ">" char

export default function tokenize_whitespace(text_walker){
    const ret = [
        parse_tag_start(text_walker),
        ...tokenize_tag_whitespace(text_walker, 1),
        parse_tag_name(text_walker),
        ...white_space_or_expect_new_line(text_walker)
    ];

    while (true){
        // Current char is first char of tag attr / string_attr / char after end of tag
        const tag_attr_tokens = parse_tag_attr(text_walker);
        if (tag_attr_tokens.length == 0) break;
        ret.push(...tag_attr_tokens);
        ret.push(...white_space_or_expect_new_line(text_walker));
    }

    while (true){
        const string_attr_tokens = parse_string_attr(text_walker);
        if (string_attr_tokens.length == 0) break;
        ret.push(...string_attr_tokens); 
        // Current char is false, "\n" or "-"
    }
    
    return ret;
}

function parse_tag_attr(text_walker){
    // Current char is first char of tag attr / string_attr / char after end of tag
    if ([false, "-", "\n"].includes(text_walker.current())){
        return [];
    }

    // We either have tag_attr_first_string || tag_attr_str:tag_attr_value
    const ret = [tokenize_tag_attr_string(text_walker)];

    if (text_walker.current() !== ":"){
        return ret;
    }
    
    ret.push({
        "type": "TAG_ATTR_SEP",
        "value": ":",
        "original_value": ":",
        position: text_walker.get_current_text_pos()
    });

    text_walker.next();
    ret.push(tokenize_tag_attr_string(text_walker));

    if (text_walker.current() === ":"){
        return text_walker.throw_error_at_current('Expected whitespace " "');
    }

    return ret;
}

function tokenize_tag_attr_string(text_walker){
    // Current char is first of tag_attr_name (we know its not \n, " " or false)
    let parsed_string = "";
    let src_string    = "";
    
    let start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if ([" ", ":"].includes(char)) break;
        if (char == "+"){
            parsed_string += " ";
            src_string += char;
            continue;
        }
        if ("\\" == char){
            if (["\\", ":", "+"].includes(text_walker.look_ahead())){
                const next_char = text_walker.next();
                parsed_string  += next_char;
                src_string     += "\\" + next_char;
                continue;
            }
        }
        parsed_string += char;
        src_string += char;
    }

    if (parsed_string.length == 0){
        // i.e. the string starts directly with ":"
        text_walker.throw_error_at_current(`Expected attribute name`);
    }
    
    // We check above that attribute actually ends with "]"

    return {
        "type": "TAG_ATTR_STRING",
        "value": parsed_string,
        "original_value": src_string,
        "position": start_position
    }
}

function parse_string_attr(text_walker){
    // Current char is first char of tag attr / string_attr / char after end of tag
    if ([false, "\n"].includes(text_walker.current())){
        return [];
    }



    return [
        tokenize_string_attr_sep(text_walker),
        ...white_space_or_expect_new_line(text_walker),
        tokenize_string_attr_value(text_walker)
    ];
}

function tokenize_string_attr_value(text_walker){
    // Current char is first of string attr value, assuming one exists
    if ([false, "-", "\n"].includes(text_walker.current())){
        return {
            "type": "TAG_STRING_ATTR_VALUE",
            value: "",
            original_value: "",
            position: text_walker.get_current_text_pos()
        }
    }

    let parsed_string = "";
    let src_string    = "";
    
    let start_position = text_walker.get_current_text_pos();
    text_walker.previous();

    for (let char of text_walker){
        if (["-", "\n"].includes(char)) break;
        if ("\\" == char && ["\\", "-"].includes(text_walker.look_ahead())){
            const next_char = text_walker.next();
            parsed_string  += next_char;
            src_string     += "\\" + next_char;
            continue;
        }
        parsed_string += char;
        src_string += char;
        if (char == " " && text_walker.look_ahead() == "-"){
            text_walker.next();
            break;
        }
    }

    return {
        "type": "TAG_STRING_ATTR_VALUE",
        "value": parsed_string,
        "original_value": src_string,
        "position": start_position
    }
}

function tokenize_string_attr_sep(text_walker){
    // Current char is first (supposetly) whitespace
    const start_position = text_walker.get_current_text_pos();
    let val = "";
    text_walker.step_back();

    for (let char of text_walker){
        if (char == "-"){
            val += char;
        } else {
            break;
        }
    }

    if (val.length == 0){
        text_walker.throw_error_at_current('Expected "-"');
    }

    return [{
        "type": "TAG_STRING_ATTR_SEP",
        "value": val,
        "original_value": val,
        position: start_position
    }]
}

function parse_tag_name(text_walker){
    // Current char is first char of Tagname
    const start_position = text_walker.get_current_text_pos();
    let val = "";
    text_walker.step_back();

    for (let char of text_walker){
        if (/[a-zA-Z_0-9\-]/.test(char)){
            val += char;
        } else {
            break;
        }
    }

    if (val.length == 0){
        // So the next chat after '>> ' is not in the regex and not " " 
        if (text_walker.current() === false || ["\n", "-", "\\"].includes(text_walker.current())){
            text_walker.throw_error_at_current("Expected tagname");
        } else {
            text_walker.throw_error_at_current("Tagname may fit the regex /[a-zA-Z_][a-zA-Z_0-9\-]*/");
        }
    } else if (/[0-9\-]/.test(val[0]) || ![false, " ", "\n"].includes(text_walker.current())){
        text_walker.throw_error_at("Tagname may fit the regex /[a-zA-Z_][a-zA-Z_0-9\-]*/", start_position)
    }

    return {
        "type": "TAG_NAME",
        "value": val,
        original_value: val,
        position: start_position,
        amt: val.length
    }
}

function parse_tag_start(text_walker){
    // Current char is first ">"
    const start_position = text_walker.get_current_text_pos();
    let val = text_walker.current();

    for (let char of text_walker){
        if (char == ">"){
            val += char;
        } else {
            break;
        }
    }

    return {
        "type": "TAG_START",
        "value": val,
        original_value: val,
        position: start_position,
        amt: val.length
    }
}

function white_space_or_expect_new_line(text_walker){
    if (text_walker.current() == "\n" || text_walker.current() === false){
        return [];
    }

    return tokenize_tag_whitespace(text_walker, 1);
}

function tokenize_tag_whitespace(text_walker, min_amt = 1){
    // Current char is first (supposetly) whitespace
    const start_position = text_walker.get_current_text_pos();
    let val = "";
    text_walker.step_back();

    for (let char of text_walker){
        if (char == " "){
            val += char;
        } else {
            break;
        }
    }

    if (val.length < min_amt){
        text_walker.throw_error_at_current('Expected " "');
    }

    if (text_walker.look_ahead() === false){
        text_walker.next();
    }

    return [{
        "type": "TAG_WHITESPACE",
        "value": val,
        "original_value": val,
        position: start_position
    }]
}