import fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import puppeteer from 'puppeteer';

// Expressões regulares para extrair dados da página
const regexDistrito = /<h1 _ngcontent\-c2="">[\n ]+([\W]+[\D][^</\n]+)/;
const regexPopulacao =
  /<div _ngcontent-c21="" class="indicador__valor">([\d.,]+)\s*<!----><span _ngcontent-c21="" class="card_unidade">pessoas<\/span><\/div>/;
const regexGentilico =
  /<\/nota-indicador>[ \n]+<\/h3>[ \n]+<p _ngcontent-c12="" class="topo__valor">[ \n]+([\W]+[\D][^</\n]+)[ \n]+<\/p>/;
const regexTerritorio =
  /<div _ngcontent-c21="" class="indicador__valor">([\d.,]+)/;

// Array para armazenar os dados coletados
const dadosRequisicao = [];

// Adicionando cabeçalho ao CSV para os dados
dadosRequisicao.push('Cidade,População,Gentílico,Território');

// Função para fazer o scraping dos dados de uma página
async function scrapeWebsite(id) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://cidades.ibge.gov.br/?codmun=${id}`);

  // Aguarde um momento para garantir que todos os dados sejam carregados na página
  await setTimeout(2000); // 2 segundos

  // Extrair o HTML da página
  const body = await page.evaluate(() => {
    return {
      html: document.body.innerHTML,
    };
  });

  // Extrair dados da cidade e população usando expressões regulares
  const cidadeMatch = body.html.match(regexDistrito);
  const populacaoMatch = body.html.match(regexPopulacao);
  const gentilicoMatch = body.html.match(regexGentilico);
  const territorioMatch = body.html.match(regexTerritorio);
  if (!cidadeMatch) {
    console.log('Cidade não encontrada');
  }
  if (!populacaoMatch) {
    console.log('População não encontrada');
  }
  if (!gentilicoMatch) {
    console.log('Gentílico não encontrado');
  }
  if (!territorioMatch) {
    console.log('Território não encontrado');
  }
  // Verificar se os dados foram encontrados
  if (cidadeMatch && populacaoMatch && gentilicoMatch && territorioMatch) {
    const cidade = cidadeMatch[1].trim();
    const populacao = populacaoMatch[1].replace(',', '.').trim();
    const gentilico = gentilicoMatch[1].trim();
    const territorio = territorioMatch[1].trim();

    console.log(
      `        Cidade: ${cidade}
        População: ${populacao}
        Gentílico: ${gentilico}
        Território: ${territorio}km²`,
    );
    return { cidade, populacao, gentilico, territorio };
  }
  await browser.close();
}

// Função principal para ler os IDs dos distritos, coletar dados e salvar em um arquivo CSV

async function main() {
  fs.readFile('IDs.json', 'utf8', async (err, data) => {
    // Lendo os IDs dos distritos
    const distritos = JSON.parse(data);

    for (const id of distritos) {
      console.log(`Coletando dados para o distrito com ID: ${id}`);
      const result = await scrapeWebsite(id);
      if (result) {
        // Adicionando os dados coletados ao array
        dadosRequisicao.push(
          `${result.cidade},${result.populacao},${result.gentilico},${result.territorio}km²`,
        );
      }
      // if (i === 100) break; //Limitando a quantidade de requisições para testar
    }

    // Convertendo os dados para o formato CSV
    const csvData = dadosRequisicao.join('\n');

    // Salvando os dados em um arquivo CSV
    fs.appendFileSync('dados.csv', csvData);

    console.log('Dados salvos com sucesso!');
  });
}

// Chamando a função principal
main();
