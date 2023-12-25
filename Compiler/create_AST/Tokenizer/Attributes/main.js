import tokenize_attr from './tokenize_attribute.js';
import tokenize_comment from '../Common/tokenize_comment.js';
import tokenize_whitespace from './tokenize_whitespace.js';

export default (tokens, text_walker) => {
    // Text walker is before the first char

    for (let char of text_walker){
        if (char === false) { // EOF, will be parsed by main section
            break;    
        } else if (char == "["){
            tokens.push(...tokenize_attr(text_walker));
            // Text walker is on the "]"
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            tokens.push(...tokenize_comment(text_walker));
            // Text walker is on char before "\n" or EOF (those are not parsed)
        } else if (/\s/.test(char)){
            tokens.push(...tokenize_whitespace(text_walker));
            // Text walker is on last whitespace character
        } else if (char == "]"){
            text_walker.throw_error_at_current("Unexpected attribute closing bracket. You may want to escape it: \"\\]\"");
        } else if (char == "\\" && ["]", "["].includes(text_walker.look_ahead())){
            tokens.push({
                type: "REMOVED_TEXT",
                value: "\\",
                original_value: "\\",
                position: text_walker.get_current_text_pos()
            });
            // Start the main section with "[" or "]"
            break;
        } else {
            text_walker.step_back();
            break;
        }
    }

    tokens.push({
        type: "END_OF_ATTR_SECTION",
        value: "",
        original_value: "",
        position: text_walker.get_current_text_pos()
    });

    return tokens;
}

