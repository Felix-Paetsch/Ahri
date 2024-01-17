import path from 'path';
import { fileURLToPath } from 'url';
import create_AST_from_string from "./create_AST/index.js";
import { readFileSync } from 'fs';

import load_resources from "./load_resources/index.js"
import compile_file from "./compile_file/main.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fp = path.resolve(__dirname, "./test.md");
const fileContents = readFileSync(fp, 'utf8');

const fileAST   = create_AST_from_string(fileContents, fp);
const resources = load_resources("./Resources");
compile_file(fileAST, resources);