var formatarMoeda = require('./utils');

function gerarFaturaStr(fatura, calc) {
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    creditos += calc.calcularCredito(apre);
    faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;

  return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
  let creditos = 0;
  let faturaHtml = `<html>\n`;
  faturaHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
  faturaHtml += `<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    creditos += calc.calcularCredito(apre);
    faturaHtml += `<li> ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
  }

  faturaHtml += `</ul>\n`;
  faturaHtml += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))} </p>\n`
  faturaHtml += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>\n`
  faturaHtml += `</html>`;

  return faturaHtml;
}

module.exports = { gerarFaturaStr, gerarFaturaHTML };