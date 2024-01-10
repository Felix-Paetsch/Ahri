import path from 'path';
import { fileURLToPath } from 'url';
import create_AST_from_string from "./create_AST/index.js";
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fp = path.resolve(__dirname, "./test.md");
const fileContents = readFileSync(fp, 'utf8');
console.log(create_AST_from_string(fileContents, fp));
