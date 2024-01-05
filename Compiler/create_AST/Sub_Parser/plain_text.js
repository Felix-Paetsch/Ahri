export default (line) => {
    const parsed = {
        type: "ROOT",
        tokens: parse_string(line)
    };

    return to_HTML(parsed.tokens);
}

function parse_string(line) {
    if (line.length == 0){
        return [];
    }
    if ("\\" == line[0] && ["\\", "*", "~", "-", "["].includes(line[1])){
        return [{
            type: "CHAR",
            value: line[1]
        }, ...parse_string(line.slice(2))];
    }
    if ("/" == line[0] && line[1] == "("){
        return try_parse_inline_math(line);
    }
    if (["*", "~", "-"].includes(line[0])){
        return try_parse_hightlight_section(line);
    }
    if (line[0] == "["){
        return try_parse_link(line);
    }
    return [{
        type: "CHAR",
        value: line[0]
    }, ...parse_string(line.slice(1))];
}

function try_parse_link(line){
    let text_val = "";

    for (let i = 1; i < line.length; i++){
        if (line[i] == "]"){
            break;
        }
        if (line[i] == "\\" && ["\\", "]"].includes(line[i+1])){
            text_val += line[i+1];
            i++;
        }
        text_val += line[i];
    }

    if (
        text_val.length == 0 
        || !(line[text_val.length + 1] == "]") 
        || !(line[text_val.length + 2] == "(")
    ){
        return [{
            type: "CHAR",
            value: "["
        }, ...parse_string(line.slice(1))];
    }

    let url_section = line.slice(text_val.length + 2);
    const includes_angles = url_section[0] == "<";
    let href = "";

    for (let i = includes_angles ? 2 : 1; i < url_section.length; i++){
        if (
            url_section[i] == ")" 
            || (url_section[i] == ">" && url_section[i+1] == ")" && includes_angles)
        ){
            const new_start_index = href.length + 2 + includes_angles * 2;
            const rest_line = url_section.slice(new_start_index);
            return [{
                type: "LINK",
                value: parse_string(text_val),
                href
            }, ...parse_string(rest_line)]
        }
        href += url_section[i];
    }

    // If it was valid, we would have returned earlier
    return [{
        type: "CHAR",
        value: "["
    }, ...parse_string(line.slice(1))];
}

function try_parse_hightlight_section(line){
    const type = line[0];
    let amt = 0;
    for (let i = 0; i < line.length; i++){
        if (line[i] == type){
            amt += 1;
        } else {
            break;
        }
    }

    if (amt > 3 || (amt != 2 && type == "~")){
        return [{
            type: "CHAR",
            value: line[0]
        }, ...parse_string(line.slice(1))]
    }

    let val = "";
    for (let i = amt; i < line.length; i++){
        if (line.slice(i, i + amt) == type.repeat(amt)){
            return [{
                type,
                value: parse_string(val),
                amt
            }, ...parse_string(line.slice(i + amt))]
        }

        val += line[i];
    }
    
    return [{
        type: "CHAR",
        value: line[0]
    }, ...parse_string(line.slice(1))]
}

function try_parse_inline_math(line){
    // If it finds /( /) a /) which is not escaped, it will return a token for that and the rest parsed
    // Else if will return the two chars and the rest parsed

    line = line.slice(2);
    let value = "";
    for (let i = 0; i < line.length; i++){
        if (line[i] == "/" && line[i + 1] == ")"){
            return [{
                type: "INLINE_MATH",
                value
            }, ...parse_string(line.slice(i + 2))]
        }

        if (line[i] == "\\" && line[i + 1] == "/" && line[i + 2] == ")"){
            value += "\\/)";
            i += 2;
        } else {
            value += line[i]
        }
    }

    // At thif point not closing tag was found
    return [{
        type: "CHAR",
        value: "/"
    }, {
        type: "CHAR",
        value: "("
    }, ...parse_string(line)]
}

function to_HTML(tokens){
    let res = "";
    for (let t of tokens){
        if (t.type == "CHAR"){
            res += sanitizeHtml(t.value);
        } else if (t.type == "LINK"){
            res += `<a href="${ sanatizeLink(t.href) }">${ to_HTML(t.value) }</a>`
        } else if (t.type == "INLINE_MATH"){
            res += `/(${ t.value }/)`
        } else if (t.type == "~"){
            res += `<del>${ to_HTML(t.value) }</del>`
        } else if (t.amt == 1){
            res += `<em>${ to_HTML(t.value) }</em>`
        } else if (t.amt == 2){
            res += `<strong>${ to_HTML(t.value) }</strong>`
        } else if (t.amt == 3){
            res += `<strong><em>${ to_HTML(t.value) }</em></strong>`
        }
    }

    return res;
}

function sanitizeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

function sanatizeLink(str){
    return str.replace(/\n/g, ' ')
              .replace(/\//g, '&#47;')
              .replace(/"/g, '&quot;');
}