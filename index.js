import fs from 'node:fs';
import puppeteer from 'puppeteer';

const regexDistrito = /<h1 _ngcontent-c2="">\s*([^<]+)\s*<\/h1>/;
const regexPopulacao = /<div _ngcontent-c21="" class="indicador__valor">([\d.,]+)\s*<!----><span _ngcontent-c21="" class="card_unidade">pessoas<\/span><\/div>/;


// Função para fazer o scraping dos dados
async function scrapeWebsite(id) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://cidades.ibge.gov.br/?codmun=${id}`);

    const body = await page.evaluate(() => {
        return {
            html: document.body.innerHTML,
        };
    });

    const cidadeMatch = body.html.match(regexDistrito);
    const populacaoMatch = body.html.match(regexPopulacao);

    if (cidadeMatch && populacaoMatch) {
        const cidade = cidadeMatch[1];
        const populacao = populacaoMatch[1].replace(",", ".");
        console.log('Cidade:', cidade, 'População:', populacao);
        return { cidade, populacao };
    }

    await browser.close();
}

try {
    fs.readFile('distritosTO.json', 'utf8', async (err, data) => {
            try {
                const distritos = JSON.parse(data);
                const idDistritos = distritos.map(distrito => distrito.id);
                for( const id of idDistritos){
                    console.log(id);
                }
            } catch (error) {
                console.error('Ocorreu um erro:', error);
            }
        }
    );
    

    // Convertendo os dados para o formato CSV
    // const csvData = data.join(', ');

    // Salvando os dados em um arquivo CSV
    // fs.writeFileSync('dados.csv', csvData);

    console.log('Dados salvos com sucesso em dados.csv');
} catch (error) {
    console.error('Ocorreu um erro:', error);
}