import pre_process_tokens from './Preprocessing/main.js';
import create_AST from './create_AST.js';

export default function parse_main_section(token_walker){
    pre_process_tokens(token_walker);
    return create_AST(token_walker);
}