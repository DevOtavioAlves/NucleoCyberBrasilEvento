import express from "express";

app.set('view engine', 'ejs'); // Configurando o EJS como motor de visualização

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
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