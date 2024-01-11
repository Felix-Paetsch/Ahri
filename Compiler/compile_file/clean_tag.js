export default function clean_tag(tag, resources){
    const tag_arr = resources.tags.filter(t => t.tag_name.toUpperCase() == tag.tag_name.toUpperCase());

    if (tag_arr.length == 0){
        tag.throw(`Tag name '${ tag.tag_name }' doesn't exist`);
    }

    add_utils(tag);

    const tag_conf = tag_arr[0];
    tag.tag_conf = tag_conf;

    update_attributes(tag);
    handle_string_attributes(tag);
}

function update_attributes(tag){
    tag.get_set("attributes", []);

    const attr_dict = {};
    for (const attr of tag.attributes){
        attr.name = attr.name.toUpperCase();
        attr_dict[attr.name.toLowerCase()] = attr;
        attr_dict[attr.name.toUpperCase()] = attr;
    }

    for (const conf_attr of tag.tag_conf.attributes){
        const current_attr = attr_dict[conf_attr.name];

        // Add non present boolean tags
        if (conf_attr.type == "boolean" && typeof current_attr == "undefined"){
            const attr = {
                name: conf_attr.name,
                value: false,
                type: conf_attr.type,
                throw: tag.throw
            }

            attr_dict[attr.name.toLowerCase()] = attr;
            attr_dict[attr.name.toUpperCase()] = attr;
        }

        // Assure that tag is present if it is required
        if (
            conf_attr.required 
            && conf_attr.default == null 
            && typeof attr_dict[conf_attr.name.toUpperCase()] == "undefined"
        ){
            tag.throw(`Missing required argument '${ conf_attr.name }'`);
        }

        // Create tag
        if (typeof current_attr == "undefined"){
            const attr = {
                name: conf_attr.name,
                value: conf_attr.default,
                type: conf_attr.type,
                throw: tag.throw
            }

            attr_dict[attr.name.toLowerCase()] = attr;
            attr_dict[attr.name.toUpperCase()] = attr;
        }

        // Check that type matches
        if (conf_attr.type == "BOOLEAN"){
            const attr = attr_dict[conf_attr.name]
            if (attr.type !== "BOOLEAN"){
                if (attr.toUpperCase() == "FALSE"){
                    attr.type = "BOOLEAN";
                    attr.value = false;
                } else if (attr.toUpperCase() == "FALSE"){
                    attr.type = "BOOLEAN";
                    attr.value = true;
                } else {
                    attr.throw("Expected boolean attribute");
                }
            }
        } else if (conf_attr.type == "VALUE"){
            const attr = attr_dict[conf_attr.name]
            if (attr.type !== "VALUE"){
                attr.throw("Expected valued attribute");
            }
        } else if (conf_attr.type == "ENUM"){
            const attr = attr_dict[conf_attr.name];
            if (attr.type !== "VALUE"){
                attr.throw("Expected enum attribute");
            }
            attr.value = attr.value.toUpperCase();
            if (conf_attr.options.includes(attr.value)){
                attr.type = "ENUM";
            } else {
                attr.value_throw("Invalid enum option");
            }
        }
    }
}

function handle_string_attributes(tag){
    tag.get_set("string_attributes", []);

    tag.assert(
        tag.string_attributes.length >= tag.tag_conf.string_attributes[0],
        "Number of string attributes to low"
    );
    
    tag.assert(
        tag.string_attributes.length <= tag.tag_conf.string_attributes[1],
        "Number of string attributes to high"
    );
}

function add_utils(tag){
    tag.assert = function assert(b, err) {
        if (!b){
            this.throw(err);
        }
    }

    tag.get_set = (function (key, def = null) {
        if (this.hasOwnProperty(key)){
            return this[key]
        }

        this[key] = def;
        return def;
    }).bind(tag);
}