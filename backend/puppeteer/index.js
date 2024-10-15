const { default: puppeteer } = require("puppeteer");

const loginSigaa = "";
const senhaSigaa = "";

async function buscarMateria(materia) {
  if (!materia) {
    console.log("Materia invalida");
    return "materia invalida";
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://autenticacao.unb.br/sso-server/login?service=https://sig.unb.br/sipac/login/cas"
  );

  await page.locator('input[name="username"]').fill(loginSigaa);
  await page.locator('input[name="password"]').fill(senhaSigaa);

  const [response] = await Promise.all([
    page.waitForNavigation(),
    page
      .locator('button[class="btn-login cursor-pointer opacity-1 col-5"]')
      .click(),
  ]);

  if (!response.ok()) {
    console.log("Erro ao logar");
    return;
  }

  await page.locator("#sigaa-cookie-consent > button").click();

  await page.locator("td.ThemeOfficeMainItem:nth-child(1)").hover();

  await page
    .locator("tr.ThemeOfficeMenuItem:nth-child(13) > td:nth-child(2)")
    .hover();

  await page
    .locator(
      "#cmSubMenuID3 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)"
    )
    .hover();

  const [response2] = await Promise.all([
    page.waitForNavigation(),
    page
      .locator(
        "#cmSubMenuID3 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)"
      )
      .click(),
  ]);

  if (!response2.ok()) {
    console.log("Erro ao navegar para selecionar pagina de matricula");
    return;
  }

  await page.locator("#form\\:checkUnidade").click();

  await page.select("#form\\:comboDepartamento", "673"); // fga
  const [response3] = await Promise.all([
    page.waitForNavigation(),
    page.locator("#form\\:buscar").click(),
  ]);

  if (!response3.ok()) {
    console.log("Erro ao navegar para selecionar pagina de matricula");
    return;
  }

  const materiaEncontrada = await page.evaluate((inputText) => {
    const regexPattern = new RegExp(inputText, "i");

    const elements = [...document.querySelectorAll("a")];

    const element = elements.find((el) => {
      const text = el.textContent.trim();
      return regexPattern.test(text);
    });

    return !!element;
  }, materia);

  await browser.close();

  return materiaEncontrada;
}

module.exports = { buscarMateria };
