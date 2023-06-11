const { readFileSync } = require('fs');

class ServicoCalculoFatura {
  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);

    if (getPeca(pecas, apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);

    return creditos;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;

    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(pecas, apre);
    }

    return creditos;
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;

    switch (getPeca(pecas, apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;

      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;

      default:
        throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
    }

    return total;
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;

    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(pecas, apre);
    }

    return total;
  }
};
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    {
      style: "currency", currency: "BRL",
      minimumFractionDigits: 2
    }).format(valor / 100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

// function calcularCredito(pecas, apre) {
//   let creditos = 0;
//   creditos += Math.max(apre.audiencia - 30, 0);

//   if (getPeca(pecas, apre).tipo === "comedia")
//     creditos += Math.floor(apre.audiencia / 5);

//   return creditos;
// }

// function calcularTotalCreditos(pecas, apresentacoes) {
//   let creditos = 0;

//   for (let apre of apresentacoes) {
//     creditos += calcularCredito(pecas, apre);
//   }

//   return creditos;
// }

// function calcularTotalApresentacao(pecas, apre) {
//   let total = 0;

//   switch (getPeca(pecas, apre).tipo) {
//     case "tragedia":
//       total = 40000;
//       if (apre.audiencia > 30) {
//         total += 1000 * (apre.audiencia - 30);
//       }
//       break;

//     case "comedia":
//       total = 30000;
//       if (apre.audiencia > 20) {
//         total += 10000 + 500 * (apre.audiencia - 20);
//       }
//       total += 300 * apre.audiencia;
//       break;

//     default:
//       throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
//   }

//   return total;
// }

// function calcularTotalFatura(pecas, apresentacoes) {
//   let total = 0;

//   for (let apre of apresentacoes) {
//     total += calcularTotalApresentacao(pecas, apre);
//   }

//   return total;
// }

function gerarFaturaStr(fatura, pecas, calc) {
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    creditos += calc.calcularCredito(pecas, apre);
    faturaStr += `${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas, calc) {
  let creditos = 0;
  let faturaHtml = `<html>\n`;
  faturaHtml += `<p> Fatura ${fatura.cliente} </p>\n`;
  faturaHtml += `<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    creditos += calc.calcularCredito(pecas, apre);
    faturaHtml += `<li> ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  }

  faturaHtml += `</ul>\n`;
  faturaHtml += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`
  faturaHtml += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`
  faturaHtml += `</html>`;

  return faturaHtml;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();

const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
// const faturaHtml = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHtml);
