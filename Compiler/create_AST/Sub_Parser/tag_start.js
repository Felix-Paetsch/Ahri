import { assert } from '../debug/main.js'
import TokenWalker from "../Parser/token_walker.js";

export default (tag_tokens) => {
    const tw = new TokenWalker(tag_tokens);
    
    assert(tw.next().type == "TAG_START");
    const amt = tw.current().amt;
    
    assert(tw.next().type == "TAG_WHITESPACE");
    assert(tw.next().type == "TAG_NAME");
    const tag_name_token = tw.current();

    
    assert(["TAG_START_END_FLAG", "TAG_WHITESPACE"].includes(tw.next().type));
    if (tw.current().type == "TAG_START_END_FLAG"){
        tw.previous();
    }

    const attributes = [];
    while (tw.look_ahead().type == "TAG_ATTR_STRING"){
        const attr_string_token = tw.next();
        let next = tw.next();
        if (next.type == "TAG_ATTR_SEP"){
            const attr_value_token = tw.next();
            assert(attr_value_token.type == "TAG_ATTR_STRING");
            attributes.push({
                name: attr_string_token.value,
                value: attr_value_token.value,
                type: "value",
                throw: attr_string_token.throw
            });
        } else {
            attributes.push({
                name: attr_string_token.value,
                value: true,
                type: "boolean",
                throw: attr_string_token.throw
            });
        }

        if (tw.look_ahead().type == "TAG_WHITESPACE"){
            tw.next();
        }
    }

    const string_attributes = [];
    while (tw.look_ahead().type == "TAG_STRING_ATTR_SEP"){
        tw.step_forward(2);
        if (tw.current().type == "TAG_WHITESPACE"){
            tw.next();
        }
        
        const attr_value_token = tw.current();
        assert(attr_value_token.type == "TAG_STRING_ATTR_VALUE");
        string_attributes.push({
            value: attr_value_token.value,
            throw: attr_value_token.throw
        })
    }

    assert(tw.next().type == "TAG_START_END_FLAG");

    return {
        amt,
        tag_name: {
            value: tag_name_token.value,
            throw: tag_name_token.throw
        },
        attributes,
        string_attributes
    }
}