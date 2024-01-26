# Abt
If you want to create a page template, just put a config file in whatever folder as specified in "PAGE_conf_specification.md".
You will also need an ejs file. Here is the relevant stuff for you concerning this. Most sections also apply to the components.

## Enviroment
You will be provided with the following variables when making your page:

```js
{

}
```

Here is what they are about:

#### `get_uid()`
Returns a random (string) unique id.

#### `attributes`
The parsed page attributes.
These include the attributes you specify (all are present, perhaps though with value `null`).
Aditionally these include all other attributes set by the user. It is an object where the key is the attribute uppercased or lowercased (both are present).

#### `get_attribute(attr_name, attr_value)`
Gives you the attribute with that name. It looks like:

```js
{
    name: "attr_name_uppercase",
    value: "attr value",
    type: "attr_type",
    "throw": (e) => { throw new Error(e) } 
    // The error will be shown to the user at the position for the tag
}
```

If you leave attr_value empty it will either return you an object like above or throw an error.
If you set attr_value it will try to return the object above. If the attr is not set however it
uses your attr_value as a fallback.

#### `css_requirements`
A list of strings of paths to css files you need to include:

```ejs
    <% for (const css_req of css_requirements){ %>
        <link rel="stylesheet" type="text/css" href="<%- css_req %>">
    <% } %>
```

#### `current_dir`
The rendered files directory path relativ to the server. 
Usefull i.e. when you need to import a file, butt cannot do so using conventional imports via the config file.
Example usecase:

```html
<script type="module">
    import { createSnowflake } from '<%- current_dir %>/snowflake.js';

    setInterval(() => {
        createSnowflake('<%- id %>');
    }, 200);
</script>
```

Hint:
If you render ./component and import in there from ./component/subcomponent
the current_dir will still be that of ./component!

#### `js_requirements`
An object like:

```js
    {
        page_begin: [{
            path: "",
            is_module: false
        }],
        page_end: []
    }
```

where `page_begin` should be ofc loaded at the beginning and `page_end` at the end. Additionally, some are modules some are not and they should be importet as such.

```ejs

    <% for (const js_req of js_requirements.page_begin){ %>
        <%- `<script ${ js_req.is_module ? 'type="module"' : "" } src="${ js_req.path }"></script>` %>
    <% } %>
    
    <% for (const js_req of js_requirements.page_end){ %>
        <%- `<script ${ js_req.is_module ? 'type="module"' : "" } src="${ js_req.path }"></script>` %>
    <% } %>

```

#### content_sections
This is an array with the content. Each section is represented by a section tag. If you specified you do not want content sections in the json file, then instead you get "content"

#### content
Same as children if it wore a tag

#### children
If you are working with a tag, then instead of content_sections you will just have `children` directly.

##### content
The content section has children. Those are the tags for that section. You may render them via:

```ejs
    <% for (const child of cs.children) { %>
        <%- child.render_self() %>
    <% } %>
```

#### data
An object every render thing has access to

#### throw(err)
#### assert(b, err)
#### internal_throw(err)
#### internal_assert(b, err)
The difference between throw and internal_throw is that one will be givne to the user as feedback and the other one means something in the Compiler chain went wrong.

#### Notes
The ouput of your file will be an ejs file. You can use
```ejs
    <%%- CONF.host %%>
```
To escape stuff.