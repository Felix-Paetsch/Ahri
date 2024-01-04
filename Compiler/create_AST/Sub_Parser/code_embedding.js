export default (code_embedding, throw_error) => {
    let first_line = "";
    for (const char of code_embedding){
        if (char !== "\n"){
            first_line += char;
        } else break;
    }

    const [language, ...dependencies] = first_line.split(" ").filter(s => s.trim().length > 0);

    if (typeof language == "undefined"){
        throw_error("Expected specification of programming language");
    }

    return {
        language,
        dependencies,
        code: code_embedding.slice(first_line.length).trim()
    };
}