/*
    Edit the tokens (inside the token_walker) to ease later processing. The following things are done:

    If no SECTION_SEPERATOR token is at the beginning, than add one
    Replace all H1-H6  with the corresponding Tags
    Replace List Items with the corresponding Tags (making sure the things inside them stay inside, given "\")
    Add List opening and closing around list items
*/

import { assert } from '../../../debug/main.js';

export default function pre_process_tokens(token_walker){
    return [];
}