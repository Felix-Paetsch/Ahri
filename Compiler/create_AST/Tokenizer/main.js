import TextWalker from './text_walker.js';
import tokenize_attribute_section from "./Attributes/main.js";
import tokenize_main_section from "./Main_Section/main.js";


export default function tokenize(text, src_path = "") {
    if (text.length === 0) return [{
        type: "END_OF_ATTR_SECTION",
        value: "",
        original_value: "",
        position: [0,-1]
    },{
        "type": "EOF",
        "value": "",
        "original_value": "",
        "position": [0,-1]
    }];

    const tokens = [];
    const text_walker = new TextWalker(text, src_path);

    tokenize_attribute_section(tokens, text_walker);
    // Current char is the last attribute char
    tokenize_main_section(tokens, text_walker);
    
    tokens.forEach(t => t.throw = (msg) => {
        text_walker.throw_error_at(msg, t.position);
    });

    return tokens;
}