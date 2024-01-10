import tokenize from './Tokenizer/main.js';
import parse from "./Parser/main.js";

export default function create_AST_from_string(text, src_path = ""){
    const tokens = tokenize(text, src_path);
    const { attributes, body } = parse(tokens);
    return { attributes, body };
};