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
        "position": text_walker.get_current_text_pos()
    },{
        "type": "ATTRIBUTE_NAME",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_name_start_position
    },{
        "type":  "ATTRIBUTE_SEP",
        "value": ":",
        "original_value": ":",
        "position": text_walker.get_current_text_pos()
    },{
        "type": "ATTRIBUTE_VALUE",
        "value": parsed_string,
        "original_value": src_string,
        "position": attr_value_start_position
    },
    {
        "type":  "ATTRIBUTE_END",
        "value": "]",
        "original_value": "]",
        "position": text_walker.get_current_text_pos()
    },{
        "type": "WHITESPACE",
        "value": space,
        "original_value": "space",
        "position": whitespace_start_position
    },{
        "type": "INLINE_COMMENT",
        "value": comment,
        "original_value": "//" + comment,
        "position": comment_start_position
    },{
        type: "TRANSITION_TEXT",
        value: "\\",
        original_value: "\\",
        position: text_walker.get_current_text_pos(),
        _descr: "needed on transition between enviroments, but the escape char has for new env no meaning"
    },{
        type: "END_OF_ATTR_SECTION",
        value: "",
        original_value: "",
        position: text_walker.get_current_text_pos()
    }
]
```