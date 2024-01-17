import TokenWalker from "./token_walker.js";
import parse_attributes from "./Attributes/main.js";
import parse_main_section from "./Main_Section/main.js";
import { assert  } from "../../debug/main.js";

export default function parse(tokens) {
    const token_walker = new TokenWalker(tokens);

    const attributes   = parse_attributes(token_walker);
    assert(token_walker.look_back().type == "END_OF_ATTR_SECTION");

    token_walker.remove_previous_tokens();
    const body = parse_main_section(token_walker);

    return {
        attributes,
        body
    }
}