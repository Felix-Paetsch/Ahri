# About

Here is how the file for a page template should look like:

```json
{
    "_is_template":  true,
    "page_template": true, // Required
    "has_content_sections": false,
    "ejs_entry": "./component.ejs",
    "descr": "./descr.md",
    "js_files": [{
        "path": "entry.js",
        "position": "DOCUMENT_BEGIN",
        "loading_index": 2,
        "is_module": true
    }],
    "css_files": [{
        "path": "entry.js",
        "loading_index": 2
    }]
}
```

There is a default for most of the values if they are not given. Also a lot is in common with tagsl What the properties do is listed in the following:

### `_is_template`
Set to `false` if you want to have config files for other purposes than components.
Default: `true`

### `page_template`
This folder belongs to a page template and not a specific component. Set to `true for page template`

### `has_content_sections`
In the atricle files you can seperate content sections with "==========="
I.e. if you want to have a slideshow with several pages. Set to false if you just want to have one (perhaps big) content section.
Default: true

### `ejs_entry`
The ejs file belonging to the component. A valid path (see below).
Default: 
1. the single .ejs file in the same folder
2. entry.ejs
3. Error!

### `descr`
A description of the tag. Either a valid path (see below) or the text content.
Default:
1. the contents of the single .md file in the folder
2. the contents of description.md
3. Component: tag_name.to_upper()

### ´js_files´
An object (or string) or array of of objects (or strings):

```js
{
    path: "a valid path",
    position: "DOCUMENT_BEGIN", // "DOCUMENT_END", "AFTER_CONTENT"
    loading_index: 5,
    is_module: true
}
```

##### `position:`
Where to place the js script tag:
DOCUMENT_BEGIN: In head of document
AFTER_CONTENT: After each instance the component is rendered
DOCUMENT_END: At the end of the document

Default: "DOCUMENT_END"

##### `loading_index`
Sometimes you need scripts to be loaded before or after other scripts at the beginning or end of the page. Scripts will be sorted by loading_index (float), highest first, lowest last (for all cases of position)
The sorting will happen after all scripts for the page to render are collected, not when the tag is rendered.
Default: 5

##### "is_module"
Whether to load js file as module.
Default: True

If only a string is given for a js file, it will be interpreted as the object

```js
{
    path: original_string
}
```

##### default
If nothing is given:
1. Import the single js file in the same folder as a module.
2. If the are more than 1 js files, import `entry.js` as module
3. Dont import anything

### `css_files`
Paths for all css files you want to have loaded.
An object (or string) or array of of objects (or strings):

```js
{
    path: "a valid path",
    loading_index: 5
}
```

##### `loading_index`
To make sure the syling doesnt depend on the order of the tags used, but only on which ones (to reduce bugs) the files will be sorted. First by loading index, then by tag_name, then by file_name.
Default: 5

##### default
If nothing is given:
Import all css files in the directory (only on same level as `config.json`)

# About paths
Paths to files should have the following form:
- URL:                           https://* or http://*
- Relative to *.json:            ./hello.ejs
- Relative to website_name.de:   /whaa.js