export default class TextWalker {
    constructor(text, fp = ""){
        if (text.length === 0){
            throw new Error("Internal: Expecting text to have length > 0");
        }

        this.fp = fp;
        this.text = text.replace(/\r/g, "");;
        this.reset_counts();
    }

    get_text(){
        return this.text;
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                const char = this.next();
                if (char === false){
                    return {
                        done: true
                    }
                }
                return {
                    value: char,
                    done: false
                }
            }
        };
    }

    next(){
        // Returns the next char and sets state of this object to belong to that char
        if (this.current_index < this.text.length - 1) {
            this.current_index += 1;
            const char = this.text[this.current_index];

            if (this.current_index > 0 && this.text[this.current_index - 1] === "\n"){
                this.current_line += 1;
                this.current_col = 0;
            } else {
                this.current_col += 1;
            }

            return char;
        } else {
            this.current_index += 1;
            return false;
        }
    }

    previous() {
        // Returns the previous char and sets state of this object to belong to that char
        if (this.current_index == this.text.length) {
            return this.text[--this.current_index];
        }
        
        if (this.current_index > -1) {
            this.current_index -= 1;
            const char = this.text[this.current_index];
    
            if (this.text[this.current_index] === "\n") {
                // Move up to the previous line
                this.current_line -= 1;
                // Find the length of the previous line to set current_col
                let previousNewLineIndex = this.text.lastIndexOf("\n", this.current_index - 1);
                this.current_col = this.current_index - (previousNewLineIndex + 1);
            } else {
                this.current_col -= 1;
            }
    
            return char;
        } else {
            return false;
        }
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

    current(n = 0){
        const char = this.text[this.current_index + n];
        if (typeof char == "undefined") return false;
        return char;
    }

    look_back(n = 1){
        if (this.current_index - n < 0){
            throw new Error("Internal: Looked back before the 0th index");
        } 
        return this.text[this.current_index - n];
    }

    look_ahead(n = 1){
        if (this.current_index + n > this.text.length - 1) return false;
        return this.text[this.current_index + n];
    }

    reset_counts(){
        this.current_index = -1;
        this.current_line  = 0;
        this.current_col   = -1;
        // If line is empty only the ending \n is part of this line
        // EOF is like the ending \n
    }

    get_current_text_pos(){
        return [
            this.current_line,
            this.current_col
        ]
    }

    assert(b, msg, pos = false){
        if (b) return;
        if (pos === false) this.throw_error_at_current(msg);
        this.throw_error_at(msg, pos);
    }

    throw_error_at_current(msg){
        this.throw_error_at(msg, this.get_current_text_pos());
    }
    throw_error_at(msg, line, col) {
        if (Array.isArray(line)) {
            col  = line[1];
            line = line[0];
        }
    
        let errorSnippet = this._getErrorSnippet(line, col);
        console.log("There was an error during compiling:");
        console.log("");
        if (this.fp !== ""){
            console.log(`File: ${ this.fp }`)
        }
        console.log(`Line: ${line + 1}, Col: ${col + 1}`);
        console.log("==========================")
        console.error(`${errorSnippet}`);
        console.log(" ", msg);
        
        console.log("\n---- end of error msg ----");
        throw new Error(`Error at Line ${line + 1}, Col ${col + 1}: ${msg}`);
    }
    
    _getErrorSnippet(line, col) {
        const lines = this.text.split("\n");
        let snippet = "";

        for (let i = 3; i >= 0; i--){
            if (line - i < 0) continue;
            snippet += (line - i + 1).toString().padEnd(3, ' ') + "| ";
            snippet += lines[line - i] + "\n";
        }

        snippet += "     ";

        // Adding a pointer to the error position
        for (let i = 0; i < col; i++) {
            snippet += " ";
        }
        snippet += "^";
    
        return snippet;
    }
    
}