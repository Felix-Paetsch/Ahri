import { assert } from '../../debug/main.js'
import sub_parse_tag from "../../Sub_Parser/tag_start.js";

export default function tokenize_tag_start(text_walker){
    assert(text_walker.current() == ">" || (text_walker.current() == "!" && text_walker.look_ahead() == ">"));

    const position = text_walker.get_current_text_pos();

    const tag_tokens = [
        parse_tag_start(text_walker),
        ...tokenize_tag_whitespace(text_walker, 1),
        parse_tag_name(text_walker),
        ...white_space_or_expect_new_line(text_walker)
    ];

    while (true){
        // Current char is first char of tag attr / string_attr / char after end of tag
        const tag_attr_tokens = parse_tag_attr(text_walker);
        if (tag_attr_tokens.length == 0) break;
        tag_tokens.push(...tag_attr_tokens);
        tag_tokens.push(...white_space_or_expect_new_line(text_walker));
    }

    while (true){
        const string_attr_tokens = parse_string_attr(text_walker);
        if (string_attr_tokens.length == 0) break;
        tag_tokens.push(...string_attr_tokens);
        assert([false, "\n", "-"].includes(text_walker.current()))
    }

    tag_tokens.push({
        type: "TAG_START_END_FLAG",
        value: "",
        original_value: "",
        position: text_walker.get_current_text_pos()
    })

    tag_tokens.forEach(t => t.throw = (msg) => {
        text_walker.throw_error_at(msg, t.position);
    });
    
    const {
        amt,
        tag_name,
        attributes,
        string_attributes,
        self_closing
    } = sub_parse_tag(tag_tokens);

    if (text_walker.current() == "\n"){
        text_walker.previous();
    }

    return [{
        type: "TAG_START",
        amt,
        tag_name,
        attributes,
        string_attributes,
        self_closing,
        original_value: tag_tokens.map(t => t.original_value).join(""),
        tokens: tag_tokens,
        position
    }];
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

    text_walker.assert(text_walker.current() !== ":", 'Expected atribute value');

    return ret;
}

function tokenize_tag_attr_string(text_walker){
    // Current char is first of tag_attr_str
    text_walker.assert(!["\n", " ", false].includes(text_walker.current()), "Expected attribute value");
    text_walker.assert(text_walker.current() !== ":", 'Unexpected ":"');
    
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

    text_walker.assert(parsed_string.length > 0, `Expected attribute name`);

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
        if (["\n"].includes(char)) break;
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
        "value": parsed_string.trim(),
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

    text_walker.assert(val.length > 0, 'Expected "-"');

    return {
        "type": "TAG_STRING_ATTR_SEP",
        "value": val,
        "original_value": val,
        position: start_position
    }
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

    text_walker.assert(
        val.length > 0 ||  (text_walker.current() !== false && !["\n", "-", "\\"].includes(text_walker.current())),
        "Expected tagname"
    );

    text_walker.assert(val.length > 0, "Tagname may fit the regex /[a-zA-Z_][a-zA-Z_0-9\-]*/");
    text_walker.assert(!/[0-9\-]/.test(val[0]), "Tagname may fit the regex /[a-zA-Z_][a-zA-Z_0-9\-]*/", start_position)
    text_walker.assert([false, " ", "\n"].includes(text_walker.current()), "Tagname may fit the regex /[a-zA-Z_][a-zA-Z_0-9\-]*/", start_position)

    return {
        "type": "TAG_NAME",
        "value": val,
        original_value: val,
        position: start_position
    }
}

function parse_tag_start(text_walker){
    assert(text_walker.current() == ">" || (text_walker.current() == "!" && text_walker.look_ahead() == ">"));

    const self_closing_tag = text_walker.current() == "!"
    if (self_closing_tag){
        text_walker.next();
    }      

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
        original_value: self_closing_tag ? "!" + val : val,
        position: start_position,
        self_closing: self_closing_tag,
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

    text_walker.assert(val.length >= min_amt, 'Expected " "');

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