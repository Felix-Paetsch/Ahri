export default function remove_comments(token_walker){
    for (const token of token_walker) {
        if ([
            "TRANSITION_TEXT", 
            "SECTION_SEPERATOR_COMMENT",
            "TAG_END_COMMENT",
            "END_LINE_WHITESPACE",
            "INLINE_COMMENT",
            "MUTLILINE_COMMENT"
        ].includes(token.type)) {
            token_walker.delete_current_token();
        }
        
        if (token.type == "MUTLILINE_COMMENT"){
            if (token_walker.next().type == "END_LINE_WHITESPACE"){
                token_walker.delete_current_token();
                token_walker.next();
            }

            token_walker.assert(token.current().type == "NEW_LINE", "Expected new line after multiline comment");
            token_walker.delete_current_token();
        }
    }

    token_walker.reset_counts();
}