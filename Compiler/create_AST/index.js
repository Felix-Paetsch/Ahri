import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tokenize from './Tokenizer/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = (fp) => {
    const fileContents = readFileSync(fp, 'utf8');
    tokenize(fileContents);
};

const filePath = path.resolve(__dirname, "./test.md");
main(filePath);
