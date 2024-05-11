# Web Scraping com Puppeteer, Node.js e Expressões Regulares

Este é um exemplo de como fazer web scraping com Puppeteer para coletar dados de uma página da web.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/ZOMBOTRON/reegex.git
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o script:

```bash
node index.js
```

## Descrição

Este script lê os IDs dos distritos de um arquivo JSON chamado `IDs.json` e coleta dados de cada distrito usando Puppeteer. Os dados coletados incluem o nome da cidade, população, gentílico e território. Os dados são salvos em um arquivo CSV chamado `dados.csv`.

## Exemplo de dados coletados

```
Cidade,População,Gentílico,Território
São Salvador do Tocantins,2.385,são salvadorense,2.385km²
São Sebastião do Tocantins,4.100,sansebastianense,4.100km²
São Valério,4.422,são valeriano,4.422km²
```

## Notas

- Este script é apenas um exemplo e pode ser modificado para atender às suas necessidades específicas.
- Certifique-se de respeitar os termos de serviço do site ao fazer web scraping.
- Consulte a documentação do Puppeteer para obter mais informações sobre como usá-lo.
- Este script foi testado com o Puppeteer versão 10.4.0.
- Este script foi escrito em JavaScript ES6 e requer Node.js para ser executado.
