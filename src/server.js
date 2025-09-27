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
  res.render("pages/home"); // Renderizando a view Home.ejs
});

app.get("/Forum", (req, res) => {
  res.send("Página do fórum");
});

app.get("/Clubes", (req, res) => {
  res.send("Página dos Clubes");
});

app.get("/Ranking", (req, res) => {
  res.send("Página do Ranking");
});

app.get("/Perfil", (req, res) => {
  res.send("Página do Perfil");
});


app.listen(8081, () => console.log("Servidor rodando na porta 8081"));