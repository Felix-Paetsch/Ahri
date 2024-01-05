import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tokenize from './Tokenizer/main.js';
import parse from "./Parser/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = (fp) => {
    const fileContents = readFileSync(fp, 'utf8');
    const tokens = tokenize(fileContents);
    const { attributes, body } = parse(tokens);
    // console.log(attributes);
    // console.log(tokens);
};

const filePath = path.resolve(__dirname, "./test.md");
main(filePath);
