import { assert } from '../../../debug/main.js';

export default function expand_self_closing_tags(token_walker){
    assert(token_walker.current() === false && token_walker.look_ahead() !== false);
    for (const token of token_walker) {
        if (token.type == 'TAG_START' && token.self_closing) {
            token_walker.insert_token_after_current([{
                type: "NEW_LINE",
                position: token.position,
                throw: token.throw,
                preprocessing: true
            },{
                "type": "TAG_END",
                "position": token.position,
                throw: token.throw,
                amt: token.amt
            },{
                type: "NEW_LINE",
                position: token.position,
                throw: token.throw,
                preprocessing: true
            }
        ]);
        }
    }

    token_walker.reset_counts();
}