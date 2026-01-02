const fs = require('fs');
const path = require('path');

// Ler o arquivo NVI completo
const bibleData = require('../src/data/nvi.json');

// Diretório de destino
const outputDir = path.join(__dirname, '../src/data/books');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Dividir cada livro em um arquivo separado
bibleData.forEach((book) => {
  const filename = `${book.abbrev}.json`;
  const filepath = path.join(outputDir, filename);

  // Salvar arquivo do livro
  fs.writeFileSync(filepath, JSON.stringify(book, null, 2));

  console.log(`✅ Criado: ${filename} (${book.chapters.length} capítulos)`);
});

// Criar arquivo index com metadados
const booksIndex = bibleData.map(book => ({
  abbrev: book.abbrev,
  chapters: book.chapters.length
}));

fs.writeFileSync(
  path.join(outputDir, 'index.json'),
  JSON.stringify(booksIndex, null, 2)
);

console.log(`\n✅ Total: ${bibleData.length} livros divididos`);
console.log(`📁 Localização: ${outputDir}`);
