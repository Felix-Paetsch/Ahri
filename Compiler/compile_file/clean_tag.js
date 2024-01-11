export default function clean_tag(tag, resources){
    const tag_arr = resources.tags.filter(t => t.tag_name.toLowerCase() == tag.tag_name.toLowerCase());

    if (tag_arr.length == 0){
        tag.throw(`Tag name '${ tag.tag_name }' doesn't exist`);
    }

    const tag_conf = tag_arr[0];
    tag.tag_conf = tag_conf;
}