import { assert } from '../../../../debug/main.js';

export default function remove_new_lines(token_walker){
    console.log(token_walker.get_tokens());
    assert(token_walker.next().type == "SECTION_SEPERATOR");
    let indent_amt_stack = [0];

    for (const token of token_walker) {
        if (token.type == "NEW_LINE" || token.type == "EOF"){
            continue;
        }

        token_walker.assert(
            token_walker.look_back() == false || token_walker.look_back().type == "NEW_LINE",
            `Expected new line`
        )

        if (token.type == "TAG_START"){
            while (indent_amt_stack[indent_amt_stack.length - 1] >= token.amt){
                indent_amt_stack.pop();
            }

            indent_amt_stack.push(token.amt);
            continue;
        }

        if (token.type == "TAG_END"){
            while (indent_amt_stack[indent_amt_stack.length - 1] > token.amt){
                indent_amt_stack.pop();
            }

            if (indent_amt_stack[indent_amt_stack.length - 1] == token.amt){
                indent_amt_stack.pop();
            } else {
                token.throw("Closing tag has not opening tag");
            }

            continue;
        }

        if (token.type == "TEXT_SECTION"){
            token_walker.previous(); // The now current token is a NEW_LINE and the after the Text section from above

            token_walker.insert_token_before_current([
                {
                    type: "TAG_START",
                    tag_name: "TEXT_SECTION",
                    attributes: [],
                    string_attributes: [],
                    amt: indent_amt_stack[indent_amt_stack.length - 1] + 1,
                    position: token_walker.current().position,
                    throw: token_walker.current().throw,
                    preprocessing: true
                }
            ]);

            while (token_walker.current().type == "NEW_LINE" && ["TEXT_SECTION", "MULTILINE_MATH"].includes(token_walker.look_ahead(1).type)){
                const text_token = token_walker.look_ahead(1);
                token_walker.insert_token_before_current([
                    {
                        type: "TAG_START",
                        tag_name: "TEXT_PARAGRAPH",
                        attributes: [{
                            name: "text_type",
                            value: text_token.type == "MULTILINE_MATH" ? "PLAIN_TEXT" : "MULTILINE_MATH",
                            type: "VALUE",
                            throw: text_token.throw
                        }],
                        string_attributes: [text_token.value.trim()],
                        amt: indent_amt_stack[indent_amt_stack.length - 1] + 2,
                        position: text_token.position,
                        throw: text_token.throw,
                        preprocessing: true
                    },{
                        "type": "TAG_END",
                        "value": "",
                        "original_value": "",
                        "position": text_token.position,
                        amt: indent_amt_stack[indent_amt_stack.length - 1] + 2,
                        throw: text_token.throw,
                        preprocessing: true
                    }
                ]);

                token_walker.delete_next_token();
                token_walker.delete_current_token();
                token_walker.next();
            }

            token_walker.insert_token_before_current([
                {
                    "type": "TAG_END",
                    "value": "",
                    "original_value": "",
                    "position": token.position,
                    amt: indent_amt_stack[indent_amt_stack.length - 1] + 1,
                    throw: token.throw,
                    preprocessing: true
                }
            ]); // We are at (supposetly) new line or EOF
        }
    }

    token_walker.tokens = token_walker.tokens.filter(t => t.type !== "NEW_LINE");
    token_walker.reset_counts();
}