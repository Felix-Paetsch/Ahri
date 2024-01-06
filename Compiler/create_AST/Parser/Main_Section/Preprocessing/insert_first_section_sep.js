import { assert } from '../../../debug/main.js';

export default function insert_first_section_sep(token_walker){
    assert(token_walker.current() === false);
    if (token_walker.look_ahead().type !== "SECTION_SEPERATOR"){
        token_walker.insert_token_after_current({
            type: "SECTION_SEPERATOR",
            value: "",
            original_value: "",
            position: token_walker.look_ahead().position,
            throw: token_walker.look_ahead().throw,
            preprocessing: true
        });
    }
}