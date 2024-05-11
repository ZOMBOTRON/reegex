import fs from 'node:fs';

fs.readFile('distritosTO.json', 'utf8', async (err, data) => {
  const distritos = JSON.parse(data);
  const ids = [...new Set(distritos.map((distrito) => distrito.municipio.id))];
  console.log(ids);
  fs.writeFileSync('IDs.json', JSON.stringify(ids));
  console.log('IDs salvos com sucesso!');
});
