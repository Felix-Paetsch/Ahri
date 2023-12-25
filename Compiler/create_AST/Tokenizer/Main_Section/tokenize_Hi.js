// Current char is the first # char

export default function tokenize_Hi(text_walker){
    const start_position = text_walker.get_current_text_pos();

    let original_value = text_walker.current();
    let value = ""

    while (text_walker.next() == "#"){
        original_value += "#";
    }

    const amt = original_value.length;
    if (amt > 6){
        text_walker.throw_error_at("To many hashtags, use between 1 and 6", start_position);
    }

    if (text_walker.current() !== " "){
        text_walker.throw_error_at_current('Expected " "');
    }

    original_value += " ";

    for (let char of text_walker.next()){
        if (char === false) {
            break;
        } else if (char == "/" && text_walker.look_ahead() == "/"){
            text_walker.step_back();
            break;
        } else if (char == "\\" && ["\\", "/"].includes(text_walker.look_ahead())){
            let next_char = text_walker.next();
            value += next_char;
            original_value += "\\" + next_char;
        } else if (char == "\n"){
            text_walker.step_back();
            break;
        } else {
            value += char;
            original_value += char;
        }
    }

    value = value.trim();
    if (value.length == 0){
        text_walker.throw_error_at_current("Heading is empty")
    }
    
    return [{
        "type": "HEADING",
        "value": value,
        "original_value": original_value,
        "position": start_position,
        amt
    }]
}