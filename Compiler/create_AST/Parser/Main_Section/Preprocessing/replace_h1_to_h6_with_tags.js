import { assert } from '../../../../debug/main.js';

export default function replace_h1_to_h6_with_tags(token_walker){
    assert(token_walker.current() === false && token_walker.look_ahead() !== false);
    for (const token of token_walker) {
        if (token.type == 'HEADING') {
            token_walker.insert_token_after_current([
                {
                    "type": "TAG_START",
                    amt: 1,
                    tag_name: "H" + token.amt,
                    attributes: [],
                    string_attributes: [],
                    original_value: "",
                    tokens: [],
                    position: token.position,
                    throw: token.throw,
                    preprocessing: true
                },{
                    type: "NEW_LINE",
                    value: "",
                    original_value: "",
                    position: token.position,
                    throw: token.throw,
                    preprocessing: true
                },{
                    "type": "TEXT_SECTION",
                    "value": token.value,
                    "original_value": token.original_value,
                    "position": token.position,
                    throw: token.throw,
                    preprocessing: true
                },{
                    type: "NEW_LINE",
                    value: "",
                    original_value: "",
                    position: token.position,
                    throw: token.throw,
                    preprocessing: true
                },{
                    "type": "TAG_END",
                    "value": "",
                    "original_value": "",
                    "position": token.position,
                    amt: 1,
                    throw: token.throw,
                    preprocessing: true
                }
            ]);

            token_walker.delete_current_token();
        }
    }

    token_walker.reset_counts();
}