The tokenizer returns an array of tokens.
Here are the tokens. Each token looks like:

{
    "type": "WHITESPACE",
    "value": space,
    "original_value": "space",
    "position": [line, column]
}

Here are the token types for the attributes section:

```js
[
    {
        "type":  "ATTRIBUTE_START",
        "value": "[",
        "original_value": "[",
        "position": text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        "type": "ATTRIBUTE_NAME",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_name_start_position,
        throw: (msg) => {}
    },{
        "type":  "ATTRIBUTE_SEP",
        "value": ":",
        "original_value": ":",
        "position": text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        "type": "ATTRIBUTE_VALUE",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_value_start_position,
        throw: (msg) => {}
    },
    {
        "type":  "ATTRIBUTE_END",
        "value": "]",
        "original_value": "]",
        "position": text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        "type": "WHITESPACE",
        "value": space,
        "original_value": "space",
        "position": whitespace_start_position,
        throw: (msg) => {}
    },{
        type: "END_LINE_WHITESPACE",
        value: whitespace_val,
        original_value: whitespace_val,
        position: whitespace_start_pos,
        throw: (msg) => {}
    }, {
        type: "LINE_CONTINUATION",
        value: "",
        original_value: "\\",
        position: text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        "type": "INLINE_COMMENT",
        "value": comment,
        "original_value": "//" + comment,
        "position": comment_start_position,
        throw: (msg) => {}
    },{
        "type": "MUTLILINE_COMMENT",
        "value": comment,
        "original_value": "/*" + comment + "*/",
        "position": comment_start_position,
        throw: (msg) => {}
    },{
        type: "TRANSITION_TEXT",
        value: "\\",
        original_value: "\\",
        position: text_walker.get_current_text_pos(),
        _descr: "needed on transition between enviroments, but the escape char has for new env no meaning",
        throw: (msg) => {}
    },{
        type: "END_OF_ATTR_SECTION",
        value: "",
        original_value: "",
        position: text_walker.get_current_text_pos(),
        throw: (msg) => {}
    }
]
```

Here are the tokens of the main section:

```js
[
    {
        type: "NEW_LINE",
        value: "\n",
        original_value: "\n",
        position: text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        type: "TRANSITION_TEXT",
        value: "",
        original_value: "\\",
        position: text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
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
        "type": "HEADING",
        "value": value,
        "original_value": original_value,
        "position": start_position,
        amt,
        throw: (msg) => {}
    },{
        "type": "LIST_ITEM",
        "value": compile_plain_text(text),
        "list_type": item_type,
        "original_value": item_type + " " + text,
        "position": start_pos,
        throw: (msg) => {}
    },{
        "type": "MULTILINE_MATH",
        "value": val,
        "original_value": original_val,
        "position": start_pos,
        throw: (msg) => {}
    },{
        "type": "TEXT_SECTION",
        "value": compile_plain_text(text),
        "original_value": text,
        "position": start_pos,
        throw: (msg) => {}
    },{
        "type": "SECTION_SEPERATOR",
        "value": "",
        "original_value": sep,
        "position": start_position
    },{
        "type": "SECTION_SEPERATOR_COMMENT",
        "value": "",
        "original_value": sep_comment,
        "position": sep_comment_start_position,
        throw: (msg) => {}
    },{
        "type": "WHITESPACE",
        "value": space,
        "original_value": space,
        "position": space_start_position,
        throw: (msg) => {}
    },{
        "type": "TAG_END",
        "value": val,
        "original_value": val,
        "position": start_position,
        amt: val.length,
        throw: (msg) => {}
    },{
        "type": "TAG_END_COMMENT",
        "value": "",
        "original_value": tag_end_comment,
        "position": tag_end_comment_start_position,
        throw: (msg) => {}
    },{
        type: "TAG_START",
        amt,
        tag_name,
        attributes,
        string_attributes,
        original_value: tag_tokens.map(t => t.original_value).join(""),
        tokens: tag_tokens,
        position,
        self_closing
    },{
        type: "END_LINE_WHITESPACE",
        value: whitespace_val,
        original_value: whitespace_val,
        position: whitespace_start_pos,
        throw: (msg) => {}
    },{
        type: "LINE_CONTINUATION",
        value: "",
        original_value: "\\",
        position: text_walker.get_current_text_pos(),
        throw: (msg) => {}
    },{
        "type": "INLINE_COMMENT",
        "value": comment,
        "original_value": "//" + comment,
        "position": comment_start_position,
        throw: (msg) => {}
    },{
        "type": "MUTLILINE_COMMENT",
        "value": comment,
        "original_value": "/*" + comment + "*/",
        "position": comment_start_position,
        throw: (msg) => {}
    },{
        "type": "EOF",
        "value": "",
        "original_value": "",
        "position": comment_start_position,
        throw: (msg) => {}
    }
]
```