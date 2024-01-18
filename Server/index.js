import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'pages')]);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/Resources', express.static(path.join(__dirname, '../Resources')));

app.get('/', (req, res) => {
  res.render('_rendered_index');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
