import { assert } from '../../../debug/main.js';

export default function remove_new_lines(token_walker){
    assert(token_walker.next().type == "SECTION_SEPERATOR");
    for (const token of token_walker) {
        if (token.type == "NEW_LINE" || token.type == "EOF"){
            continue;
        }

        token_walker.assert(
            token_walker.look_back() == false || token_walker.look_back().type == "NEW_LINE",
            `Expected new line`
        )

        if (token.type == "TEXT_SECTION"){
            while (token_walker.look_ahead().type == "NEW_LINE" && token_walker.look_ahead(2).type == "TEXT_SECTION"){
                token.value += "<br />" + token_walker.look_ahead(2).value;
                token.preprocessing = true;
                token_walker.delete_next_token();
                token_walker.delete_next_token();
            }
        }
    }

    token_walker.tokens = token_walker.tokens.filter(t => t.type !== "NEW_LINE");
    token_walker.reset_counts();
}