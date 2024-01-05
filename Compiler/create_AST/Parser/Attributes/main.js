import { text } from 'express';
import { assert, invalid_path } from '../../debug/main.js';

export default function parse_attributes(token_walker){
    const attributes = [];

    for (const token of token_walker){
        if (token.type == "END_OF_ATTR_SECTION"){
            break;
        }
        if ([
            "WHITESPACE", 
            "END_LINE_WHITESPACE", 
            "INLINE_COMMENT",
            "MUTLILINE_COMMENT",
            "TRANSITION_TEXT"
        ].includes(token.type)){
            continue;
        }
        if (token.type == "LINE_CONTINUATION"){
            token.throw("Line continuations are only valid in lists");
        }
        if (token.type == "ATTRIBUTE_START"){
            attributes.push(parse_attribute(token_walker));
            assert(token_walker.current().type == "ATTRIBUTE_END");
            continue;
        }

        invalid_path();
    }

    return attributes;
}

function parse_attribute(token_walker){
    assert(token_walker.current().type == "ATTRIBUTE_START");

    const attr_name = token_walker.next();
    assert(attr_name.type == "ATTRIBUTE_NAME"); // Guarantee from tokenizer

    const next = token_walker.next();
    if (next.type == "ATTRIBUTE_END"){
        return {
            name: attr_name.value,
            value: true,
            type: "boolean",
            throw: attr_name.throw
        }
    }

    assert(token_walker.current().type == "ATTRIBUTE_SEP");
    
    const attr_value = token_walker.next();
    assert(attr_value.type == "ATTRIBUTE_VALUE");
    assert(token_walker.next().type == "ATTRIBUTE_END");
    
    return {
        name: attr_name.value,
        value: attr_value.value,
        type: "value",
        throw: attr_name.throw
    }
}