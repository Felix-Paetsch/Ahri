Preprocessing does the following:

Edit the tokens (inside the token_walker) to ease later processing. The following things are done in order:

- Remove Comments and Transition Text and Whitespace
- If no SECTION_SEPERATOR token is at the beginning, than add one
- Replace self closing tags
- Replace all H1-H6  with the corresponding Tags
- Replace List Items with the corresponding Tags (making sure the things inside them stay inside, given "\")
- Add List opening and closing around list items
- Remove new lines:
    - Validate there are only new lines before components if needed
    - Merge Text Sections only one new line Appart
    - Convert Text Sections and multiline math to tags

The possible tokens now are:

[
    {
        "type": "CODE_EMBEDDING",
        "value": val,
        "original_value": original_val,
        "tokens": [],
        "position": start_pos,
        language,
        dependencies,
        code,
        throw: (msg) => {}
    },{
        "type": "SECTION_SEPERATOR",
        "value": "",
        "original_value": sep,
        "position": start_position
    },{
        "type": "TAG_END",
        "value": val,
        "original_value": val,
        "position": start_position,
        amt: val.length,
        throw: (msg) => {}
    },{
        type: "TAG_START",
        amt,
        tag_name,
        attributes,
        string_attributes,
        original_value: tag_tokens.map(t => t.original_value).join(""),
        tokens: tag_tokens,
        position
    },{
        "type": "EOF",
        "value": "",
        "original_value": "",
        "position": comment_start_position,
        throw: (msg) => {}
    }
]