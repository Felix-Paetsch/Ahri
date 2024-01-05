export default class TokenWalker {
    constructor(tokens){
        if (tokens.length === 0){
            throw new Error("Internal: Expecting tokens to have length > 0");
        }

        this.tokens = tokens;
        this.reset_counts();
    }

    get_tokens(){
        return this.tokens;
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                const t = this.next();
                if (t === false){
                    return {
                        done: true
                    }
                }
                return {
                    value: t,
                    done: false
                }
            }
        };
    }

    remove_previous_tokens(){
        this.tokens = this.tokens.slice(this.current_index);
        this.current_index = -1;
    }

    next(){
        // Returns the next char and sets state of this object to belong to that char
        if (this.current_index < this.tokens.length - 1) {
            this.current_index += 1;
            return this.tokens[this.current_index];
        } else {
            this.current_index += 1;
            return false;
        }
    }

    previous() {
        // Returns the previous char and sets state of this object to belong to that char
        if (this.current_index > 0) {
            return this.tokens[--this.current_index];
        }
        
        return false;
    }

    step_back(n = 1){
        for (let i = 0; i < n; i++){
            this.previous();
        }
    }

    step_forward(n = 1){
        for (let i = 0; i < n; i++){
            this.next();
        }
    }

    current(){
        const t = this.tokens[this.current_index];
        if (typeof t == "undefined") return false;
        return t;
    }

    look_back(n = 1){
        if (this.current_index - n < 0){
            throw new Error("Internal: Looked back before the 0th index");
        } 
        return this.tokens[this.current_index - n];
    }

    look_ahead(n = 1){
        if (this.current_index + n > this.tokens.length - 1) return false;
        return this.tokens[this.current_index + n];
    }

    reset_counts(){
        this.current_index = -1;
    }

    get_current_text_pos(){
        const t = this.current();
        if (t === false) return [0,0];
        return t.position;
    }

    assert(b, msg, pos = false){
        if (b) return;
        if (pos === false) this.throw_error_at_current(msg);
        this.throw_error_at(msg, pos);
    }

    throw_error_at_current(msg){
        this.throw_error_at(msg, this.get_current_text_pos());
    }

    throw_error_at(msg, token){
        if (Array.isArray(line)){
            col  = line[1];
            line = line[0];
        }
        console.log("There is an error:")
        console.log(`Line: ${ line + 1 }, Col: ${ col + 1 }`);
        throw new Error(msg);
    }
}