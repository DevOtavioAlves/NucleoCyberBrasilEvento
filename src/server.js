import { fileURLToPath } from 'url';
import express from "express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.set('view engine', 'ejs'); // Configurando o EJS como motor de visualização

app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/Forum", (req, res) => {
  res.render("pages/forum");

});

app.get("/Clubs", (req, res) => {
  res.render("pages/clubs");

});

app.get("/Ranking", (req, res) => {
  res.render("pages/ranking");

});

app.get("/Profile", (req, res) => {
  res.render("pages/profile");
});


app.listen(8081, () => console.log("Servidor rodando na porta 8081"));