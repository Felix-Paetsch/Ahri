import tokenize_spaces from './tokenize_spaces.js';
import tokenize_single_line_comment from '../Common/tokenize_single_line_comment.js';
import tokenize_multi_line_comment from '../Common/tokenize_multi_line_comment.js';
import tokenize_Hi from './tokenize_Hi.js';
import tokenize_sep from './tokenize_sep.js';
import tokenize_tag_start from "./tokenize_tag_start.js";
import tokenize_tag_end from "./tokenize_tag_end.js";

export default (tokens, text_walker) => {
    // Text walker is before the first char

    for (let char of text_walker){
        if (char === false) {
            tokens.push({
                type: "EOF",
                value: "",
                original_value: "",
                position: text_walker.get_current_text_pos()
            });
        
            break;    
        } else if (char == ">"){
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
            // Current char is last "="
        } else if ((char == "-" || char == "*") && text_walker.look_ahead() === " "){
            tokens.push(...tokenize_list_item(text_walker));
        } else if (char == "\\" && [">", "<", "=", "#", "*", "-", "\\", "/"].includes(text_walker.look_ahead())){
            tokens.push({
                type: "TRANSITION_TEXT",
                value: "",
                original_value: "\\",
                position: text_walker.get_current_text_pos()
            });

            // Tokenize as Text Or Embedding or Multiline Math
        } else {
            // Tokenize as Text Or Embedding or so
            text_walker.step_back();
            break;
        }
    }

    return tokens;
}

