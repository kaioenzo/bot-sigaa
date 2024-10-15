const express = require("express");
const { buscarMateria } = require("./puppeteer");
const app = express();
const port = 3000;

app.use(express.text());
app.post("/", async (req, res) => {
  const materias = req.body;
  const resultado = await buscarMateria(materias);
  res.json(resultado);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
