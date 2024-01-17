This returns the config files for the page template and the loaded tags as follows:

```js
{
    page_template: {
            "_is_template":  true,
            "page_template": true,
            "ejs_entry": "./main.ejs",
            "descr": "Some descr",
            "js_files": [{
                "path": "entry.js",
                "position": "DOCUMENT_BEGIN",        // Uppercased
                "loading_index": 2,
                "is_module": true
            }],
            "css_files": [{
                "path": "entry.js",
                "loading_index": 2
            }],
            "has_content_sections": true,
            "assert": (b, err) => {},
            "throw":  (err) => {},
            "folder": "Resources/some_folder"
    },
    tags: [
        {
            tag_name: 'SECTION',                      // Uppercased
            get_set: [Function: bound ],
            assert: [Function (anonymous)],
            throw: [Function (anonymous)],
            _is_template: true,
            page_template: false,
            ejs_entry: '$/component.ejs',
            descr: 'Component: SECTION',
            css_files: [],
            js_files: [],
            string_attributes: [Array],
            attributes: [],
            folder: 'Resources\\wha'
        },
        {
            _is_template: true,
            page_template: false,
            tag_name: 'text_section',
            ejs_entry: './component.ejs',
            descr: './descr.md',
            js_files: [Array],
            css_files: [Array],
            string_attributes: [Array],
            attributes: [{
                name: 'ENUM',                       // Uppercased
                type: 'ENUM',                       // Uppercased
                required: true,
                options: [Array],                   // Uppercased
                default: null
            }],
            get_set: [Function: bound ],
            assert: [Function (anonymous)],
            throw: [Function (anonymous)],
            folder: 'Resources\\wha copy'
        }
    ]
}
```

In general: All values which are not case sensitive should be uppercased