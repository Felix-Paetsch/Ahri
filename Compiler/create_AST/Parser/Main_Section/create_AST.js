import { assert, invalid_path } from "../../../debug/main.js";
import TokenWalker from './../token_walker.js';

export default function create_AST(token_walker){
    const sections = [];

    for (const token of token_walker){
        if (token.type == "SECTION_SEPERATOR"){
            if (sections.length > 0){
                sections[sections.length - 1].push({
                    type: "EOF",
                    throw: token.throw,
                    position: token.position
                });
            }

            sections.push([{
                type: "SECTION_START",
                throw: token.throw,
                position: token.position
            }]);
        } else {
            sections[sections.length - 1].push(token);
        }
    }

    return sections.map(section_AST);
}

function section_AST(section){
    const tw = new TokenWalker(section);
    const section_start_token = tw.next();

    return {
        type: "SECTION",
        tag_name: "SECTION",
        throw: section_start_token.throw,
        children: AST_with_indent(tw, 0)
    };
}

function AST_with_indent(tw, parent_indent){
    // We are on token after TAG_START
    const children = [];
    tw.previous();
    
    for (const token of tw){
        if (token.type == "TAG_START"){
            if (token.amt > parent_indent){
                tw.next();
                children.push({
                    type: "TAG",
                    tag_name: token.tag_name,
                    throw: token.throw,
                    attributes: token.attributes,
                    string_attributes: token.string_attributes,
                    children: AST_with_indent(tw, token.amt)
                });
                continue;
            } else {
                tw.previous();
                break;
            }
        }

        if (["TEXT_SECTION", "MULTILINE_MATH", "CODE_EMBEDDING"].includes(token.type)){
            children.push(token);
            continue;
        }

        if ("TAG_END" == token.type){
            tw.assert(token.amt <= parent_indent, "No opening tag found for closing tag");
            if (token.amt < parent_indent){
                tw.previous(); // Parent still has to see this
            }
            break;
        }

        if ("EOF" == token.type) {
            break;
        }

        invalid_path();
    }

    return children;
}