import TextWalker from './text_walker.js';
import tokenize_attribute_section from "./Attributes/main.js";
import tokenize_main_section from "./Main_Section/main.js";


export default function tokenize(text) {
    if (text.length === 0) return [];

    const tokens = [];
    const text_walker = new TextWalker(text);

    tokenize_attribute_section(tokens, text_walker);
    // Current char is the last attribute char
    tokenize_main_section(tokens, text_walker);

    console.log(tokens);
}