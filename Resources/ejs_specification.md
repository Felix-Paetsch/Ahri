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

#### `css_req`
A list of strings of paths to css files you need to include:

```ejs
    <% for (const css_req of css_requirements){ %>
        <link rel="stylesheet" type="text/css" href="<%- css_req %>">
    <% } %>
```

#### `js_req`
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

Code sections follow in the future.

#### to_url(fp: fp_obj)
The paths you use are all relative to the .ejs file. If you want to have files starting with $/ or §/ (probably from the user) you can call this function.
The first argument should either be a string or an object
```js
_={
    value: "",
    throw: () => {}
}
```
where throw gives an error if the fp is illformatted.
If given a string this will always throw an error if the value is illformatted!
If you want different behaviour set throw accordingly.
You should also use to_url for any file you want to import from "website.path/smth" with "§". For paths relative to the file you dont need to do "$".

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

## Expections for rendering context of server
We have to see about this. Ideally i would want to keep this minmal. We expect these functions:

```js
    to_absolute_path("/url");
```

#### Check:
escape "<%" and "%>" => boolean default true, there might be cases you want this..
=> Rendering config