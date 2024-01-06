import pre_process_tokens from './Preprocessing/main.js';

export default function parse_main_section(token_walker){
    pre_process_tokens(token_walker);
    // console.log(token_walker.get_tokens());
    return [];
}