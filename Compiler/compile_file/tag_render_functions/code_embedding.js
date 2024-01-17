export default function add_code_emedding_rendering_fun(tag){
    if (tag.language == "js_module"){
        tag.render_self = () => {
            return `<script type="module">${ tag.code }</script>`
        }
        return;
    }
    if (tag.language == "js"){
        tag.render_self = () => {
            return `<script>{${ tag.code }}</script>`
        }
        return;
    }
    if (tag.language == "css"){
        tag.render_self = () => {
            return `<style>${ tag.code }</style>`
        }
        return;
    }
    if (tag.language == "html"){
        tag.render_self = () => {
            return ` ${ tag.code } `
        }
        return;
    }
    
    tag.throw("Invalid code embedding type!")
}