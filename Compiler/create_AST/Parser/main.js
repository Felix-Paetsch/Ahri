import TokenWalker from "./token_walker.js";
import parse_attributes from "./Attributes/main.js";

export default function parse(tokens) {
    const token_walker = new TokenWalker(tokens);
    
    return {
        attributes: parse_attributes(token_walker)
    }
}