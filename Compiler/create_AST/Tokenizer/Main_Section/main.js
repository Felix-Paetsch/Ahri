import { assert } from '../../../debug/main.js'

import tokenize_spaces from './tokenize_spaces.js';
import tokenize_single_line_comment from '../Common/tokenize_single_line_comment.js';
import tokenize_multi_line_comment from '../Common/tokenize_multi_line_comment.js';
import tokenize_Hi from './tokenize_Hi.js';
import tokenize_sep from './tokenize_sep.js';
import tokenize_tag_start from "./tokenize_tag_start.js";
import tokenize_tag_end from "./tokenize_tag_end.js";
import tokenize_plain_text from "./tokenize_plain_text.js";
import tokenize_code_embedding from "./tokenize_code_embedding.js";
import tokenize_list_item from "./tokenize_list_item.js";
import tokenize_multiline_math from './tokenize_multi_line_math.js';

/*
subtokenizers (strings, embedding)

tests

*/

export default (tokens, text_walker) => {
    // Text walker is before the first char or main section (or false)

    for (let char of text_walker){
        // Prev we have FALSE or "\n           "
        
        if (char == ">" || (char == "!" && text_walker.look_ahead() == ">")){
            tokens.push(...tokenize_tag_start(text_walker));
        } else if (char == "<"){
            tokens.push(...tokenize_tag_end(text_walker));
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            tokens.push(...tokenize_single_line_comment(text_walker));
            // Current char is before \n
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            tokens.push(...tokenize_multi_line_comment(text_walker));
            // Current char is "/"
        } else if (" " == char){
            tokens.push(...tokenize_spaces(text_walker));
            // Current char is last whitespace
        } else if ("\n" == char){
            tokens.push({
                type: "NEW_LINE",
                value: "\n",
                original_value: "\n",
                position: text_walker.get_current_text_pos()
            });
        } else if (char == "#"){
            tokens.push(...tokenize_Hi(text_walker));
            // Current char is before \n
        } else if (
            char == "=" 
            && text_walker.look_ahead() == "="
            && text_walker.look_ahead(2) == "="
        ){
            tokens.push(...tokenize_sep(text_walker));
        } else if ((char == "-" || char == "*") && text_walker.look_ahead() === " "){
            tokens.push(...tokenize_list_item(text_walker));
        } else if (char == "\\" && [">", "<", "=", "#", "*", "-", "\\", "/", "!"].includes(text_walker.look_ahead())){
            tokens.push({
                type: "TRANSITION_TEXT",
                value: "",
                original_value: "\\",
                position: text_walker.get_current_text_pos()
            });
            text_walker.next();

            tokens.push(...tokenize_plain_text(text_walker));
        } else if ((char == "-" || char == "*") && text_walker.look_ahead() === " "){
            tokens.push(...tokenize_list_item(text_walker));
        } else if (char == "`" && text_walker.look_ahead() === "`" && text_walker.look_ahead(2) == "`"){
            tokens.push(...tokenize_code_embedding(text_walker));
        } else if (char == "$" && text_walker.look_ahead() === "$"){
            tokens.push(...tokenize_multiline_math(text_walker));
        } else {
            tokens.push(...tokenize_plain_text(text_walker));
        }
    }

    tokens.push({
        "type": "EOF",
        "value": "",
        "original_value": "",
        "position": text_walker.get_current_text_pos()
    });

    return tokens;
}

