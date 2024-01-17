Takes in the tokens and returns the AST.
It will look like this:

```js
{
    attributes: [{
        name: attr_name.value,
        value: true,
        type: "boolean",
        throw: attr_name.throw
    },{
        name: attr_name.value,
        value: attr_value.value,
        type: "value",
        throw: attr_name.throw
    }],
    body: [{
        type: "SECTION",
        tag_name: "SECTION",
        throw: section_start_token.throw,
        children: [{
            type: "TAG",
            tag_name: token.tag_name,
            throw: token.throw,
            attributes: token.attributes,
            string_attributes: token.string_attributes,
            children: AST_with_indent(tw, token.amt)
            // Same as SECTION.children
        },{
            "type": "TEXT_SECTION",
            "value": compile_plain_text(text),
            "original_value": text,
            "position": start_pos,
            throw: (msg) => {}
        },{
            "type": "MULTILINE_MATH",
            "value": val,
            "original_value": original_val,
            "position": start_pos,
            throw: (msg) => {}
        },{
            "type": "CODE_EMBEDDING",
            "value": val,
            "original_value": original_val,
            "tokens": [],
            "position": start_pos,
            language,
            dependencies, 
            // note: currently dependencies are ignored && only valid deps are js, js_module, html, css
            code,
            throw: (msg) => {}
        }]
    }]
}
```