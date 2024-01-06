import { assert, invalid_path } from '../../../debug/main.js';

export default function replace_list_items(token_walker){
    let indent_amt_stack = [0];

    for (const token of token_walker){
        if ([
            "NEW_LINE", 
            "CODE_EMBEDDING", 
            "MULTILINE_MATH", 
            "TEXT_SECTION",
            "WHITESPACE",
            "TAG_END",
            "TAG_START",
            "EOF"
        ].includes(token.type)){
            continue
        }

        if (token.type == "LINE_CONTINUATION"){
            token.throw("Line continuations are only valid after list items");
        }

        
        if (token.type == "SECTION_SEPERATOR"){
            indent_amt_stack = [0];
            continue;
        }

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

        if (token.type == "LIST_ITEM"){
            create_list(token_walker, indent_amt_stack[indent_amt_stack.length - 1]);
            continue;
        }

        invalid_path();
    }
    
    token_walker.reset_counts();
}

function create_list(tw, current_index_amt){
    assert(tw.current().type == "LIST_ITEM");
    const list_type = tw.current().list_type; // "-" or "*"

    const list_token = {
        type: "TAG_START",
        tag_name: "LIST",
        attributes: [],
        string_attributes: [],
        amt: current_index_amt + 1,
        original_value: "",
        position: tw.current().position,
        throw: tw.current().throw,
        preprocessing: true
    }

    if (list_type == "-"){
        list_token.attributes.push({
            name: "enumerated",
            value: true,
            type: "boolean",
            throw: tw.current().throw
        });
    }

    tw.insert_token_before_current([
        list_token,
        {
            type: "NEW_LINE",
            value: "",
            original_value: "",
            position: list_token.position,
            throw: list_token.throw,
            preprocessing: true
        }
    ]);

    tw.previous();
    for (const token of tw){
        if (token.type == "LIST_ITEM" && token.list_type == list_type){
            tw.insert_token_before_current([{
                    "type": "TAG_START",
                    amt: current_index_amt + 2,
                    tag_name: "LIST_ITEM",
                    attributes: [],
                    string_attributes: [],
                    original_value: token.original_value,
                    value: "",
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
                    "original_value": "",
                    "position": token.position,
                    throw: token.throw,
                    preprocessing: true
                }
            ]);

            tw.delete_current_token(); // The list item itself
            // We are on text section

            while (tw.look_ahead().type == "LINE_CONTINUATION"){
                tw.next();
                tw.delete_current_token();
                assert(tw.next().type == "NEW_LINE");

                while ([
                    "MULTILINE_MATH",
                    "TEXT_SECTION",
                    "WHITESPACE"
                ].includes(tw.next().type)){}
                
                assert(["EOF", "NEW_LINE", "LINE_CONTINUATION"].includes(tw.current().type));
                tw.previous();
            }

            assert(["EOF", "NEW_LINE"].includes(tw.next().type));
            
            tw.insert_token_before_current([{
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
                    amt: current_index_amt + 2,
                    throw: token.throw,
                    preprocessing: true
                }
            ]);

            if (tw.current().type == "EOF"){
                break;
            }
        } else {
            tw.previous();
            break;
        }
    }

    assert(tw.look_back().type == "TAG_END");

    tw.insert_token_before_current([{
            type: "NEW_LINE",
            value: "",
            original_value: "",
            position: tw.look_back().position,
            throw: tw.look_back().throw,
            preprocessing: true
        },{
            "type": "TAG_END",
            "value": "",
            "original_value": "",
            "position": tw.look_back().position,
            amt: current_index_amt + 1,
            throw: tw.look_back().throw,
            preprocessing: true
    }]);
}