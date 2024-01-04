export default function tokenize_end_line_whitespace(text_walker){
    // at first presumable whitespace char
    let whitespace_start_pos = text_walker.get_current_text_pos();
    let whitespace_val = "";

    text_walker.step_back();
    for (let char of text_walker){
        if (char == " "){
            whitespace_val += char;
        } else if (char == "\\" && text_walker.look_ahead() == "\n") {
            text_walker.assert(whitespace_val.length > 0, "Expected whitespace", whitespace_start_pos);

            return [{
                type: "END_LINE_WHITESPACE",
                value: whitespace_val,
                original_value: whitespace_val,
                position: whitespace_start_pos
            }, {
                type: "LINE_CONTINUATION",
                value: "",
                original_value: "\\",
                position: text_walker.get_current_text_pos()
            }]
        } else if (char == "\n"){
            break;
        } else {
            text_walker.throw_error_at_current("Expected new line");
        }
    }

    // On last whitespace char if there are some
    text_walker.step_back();

    if (whitespace_val.length > 0){
        return [{
            type: "END_LINE_WHITESPACE",
            value: whitespace_val,
            original_value: whitespace_val,
            position: whitespace_start_pos
        }];
    }

    return [];
}