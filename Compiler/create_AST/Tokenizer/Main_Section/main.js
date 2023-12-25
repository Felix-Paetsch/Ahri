import tokenize_spaces from './tokenize_spaces.js';
import tokenize_comment from '../Common/tokenize_comment.js';
import tokenize_Hi from './tokenize_Hi.js';

export default (tokens, text_walker) => {
    // Text walker is before the first char

    for (let char of text_walker){
        console.log(char);
        if (char === false) {
            tokens.push({
                type: "EOF",
                value: "",
                original_value: "",
                position: text_walker.get_current_text_pos()
            });
        
            break;    
        } else if (char == ">"){
            tokens.push(...tokenize_tag(text_walker));
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            tokens.push(...tokenize_comment(text_walker));
            // Current char is before \n
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
        } else if ((char == "-" || char == "*") && text_walker.look_ahead() === " "){
            tokens.push(...tokenize_list_item(text_walker));
        } else if (char == "\\" && ["]", "["].includes(text_walker.look_ahead())){
            tokens.push({
                type: "REMOVED_TEXT",
                value: "\\",
                original_value: "\\",
                position: text_walker.get_current_text_pos()
            });
            // Start the main section with "[" or "]"
            break;
        } else { // String, Embedding, Math - will see
            text_walker.step_back();
            break;
        }
    }

    return tokens;
}

