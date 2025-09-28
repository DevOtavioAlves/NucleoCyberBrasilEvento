import { fileURLToPath } from 'url';
import express from "express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs'); // Configurando o EJS como motor de visualização

app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render('layout', { title: 'home', body: 'home' });
});

app.get("/Forum", (req, res) => {
  res.render('layout', { title: 'forum', body: 'forum' });
});

app.get("/Clubs", (req, res) => {
  res.render('layout', { title: 'clubs', body: 'clubs' });
});

app.get("/Ranking", (req, res) => {
  res.render('layout', { title: 'ranking', body: 'ranking' });
});

app.get("/Profile", (req, res) => {
  res.render('layout', { title: 'profile', body: 'profile' });
});

app.get("/employability", (req, res) => {
  res.render('layout', { title: 'employability', body: 'employability' });
});

app.get("/Chatbot", (req, res) => {
  res.render('layout', { title: 'chatbot', body: 'chatbot', currentPage: 'chatbot'});
});

app.listen(8081, () => console.log("Servidor rodando na porta 8081"));