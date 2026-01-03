/**
 * Script para importar Bíblia NVI para o Supabase
 * VERSÃO CORRIGIDA - suporte a gzip
 */

const https = require('https');
const zlib = require('zlib');
const { createClient } = require('@supabase/supabase-js');

// CONFIGURE SUAS CREDENCIAIS AQUI
const SUPABASE_URL = 'https://ewhdexsrsdbawjutheat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aGRleHNyc2RiYXdqdXRoZWF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzMwMzY0NywiZXhwIjoyMDgyODc5NjQ3fQ.Chm8m1-jFPJ6yNwXFHfsJ-Kn5FMzKmvx1nGBhxLCE_E';
const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/nvi.json';
const BATCH_SIZE = 100;

function downloadBibleJSON(url) {
  return new Promise((resolve, reject) => {
    console.log('📥 Baixando Bíblia NVI do GitHub...');
    
    https.get(url, (response) => {
      console.log('📋 Headers:', response.headers);
      console.log('📋 Content-Encoding:', response.headers['content-encoding']);
      
      const chunks = [];
      const encoding = response.headers['content-encoding'];
      
      let stream = response;
      
      // Só descompactar se realmente estiver compactado
      if (encoding === 'gzip') {
        console.log('🗜️ Descompactando GZIP...');
        stream = response.pipe(zlib.createGunzip());
      } else if (encoding === 'deflate') {
        console.log('🗜️ Descompactando DEFLATE...');
        stream = response.pipe(zlib.createInflate());
      } else {
        console.log('📄 Arquivo NÃO compactado, lendo direto...');
      }

      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      stream.on('end', () => {
        try {
          let data = Buffer.concat(chunks).toString('utf8');
          console.log('📏 Tamanho baixado:', data.length, 'bytes');
          console.log('🔍 Primeiros 100 caracteres:', data.substring(0, 100));
          
          // Remover BOM (Byte Order Mark) e espaços em branco no início
          data = data.trim();
          if (data.charCodeAt(0) === 0xFEFF) {
            data = data.substring(1);
            console.log('🔧 BOM removido');
          }
          
          console.log('🔍 Depois de limpar:', data.substring(0, 100));
          
          const json = JSON.parse(data);
          console.log(`✅ ${json.length} livros baixados`);
          resolve(json);
        } catch (error) {
          const buffer = Buffer.concat(chunks);
          const data = buffer.toString('utf8');
          console.error('❌ Erro ao fazer parse do JSON:', error.message);
          console.error('📄 Primeiros 500 chars:', data.substring(0, 500));
          console.error('🔢 Códigos dos primeiros 10 bytes:', 
            Array.from(buffer.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' '));
          reject(new Error('Erro parse: ' + error.message));
        }
      });

      stream.on('error', (error) => {
        console.error('❌ Erro no stream:', error.message);
        reject(new Error('Erro stream: ' + error.message));
      });
      
      response.on('error', (error) => {
        console.error('❌ Erro na resposta HTTP:', error.message);
        reject(error);
      });
    }).on('error', (error) => {
      console.error('❌ Erro na requisição HTTP:', error.message);
      reject(error);
    });
  });
}

async function insertVersesInBatches(supabase, verses, batchSize) {
  const total = verses.length;
  let inserted = 0;
  let errors = 0;

  console.log(`\n📝 Importando ${total.toLocaleString()} versículos...\n`);

  for (let i = 0; i < verses.length; i += batchSize) {
    const batch = verses.slice(i, i + batchSize);
    
    const { data, error } = await supabase.from('bible_verses').insert(batch);

    if (error) {
      console.error(`\n❌ Erro no lote ${Math.floor(i / batchSize) + 1}:`, error.message);
      console.error('📋 Detalhes:', error);
      console.error('📄 Primeiro item do lote:', JSON.stringify(batch[0], null, 2));
      errors += batch.length;
    } else {
      inserted += batch.length;
      const pct = ((i + batch.length) / total * 100).toFixed(1);
      process.stdout.write(`\r⏳ ${pct}% (${inserted.toLocaleString()}/${total.toLocaleString()})`);
    }

    await new Promise(r => setTimeout(r, 50));
  }

  console.log('\n');
  return { inserted, total, errors };
}

// Mapeamento de abreviações do JSON para o schema do Supabase
const ABBREV_MAP = {
  'jó': 'job',
  'cânticos': 'ct',
  'lamentações de jeremias': 'lm',
  'atos': 'at',
  'atos dos apóstolos': 'at',
};

function processBibleData(bibleData) {
  const allVerses = [];

  console.log('\n🔄 Processando...');

  bibleData.forEach((book) => {
    // Correção: abbrev pode ser string ou objeto {pt: "gn"}
    let abbrev = typeof book.abbrev === 'string' ? book.abbrev : book.abbrev.pt;
    
    // Normalizar abreviação se necessário
    const bookNameLower = book.name.toLowerCase();
    if (ABBREV_MAP[bookNameLower]) {
      abbrev = ABBREV_MAP[bookNameLower];
    } else if (ABBREV_MAP[abbrev]) {
      abbrev = ABBREV_MAP[abbrev];
    }
    
    let count = 0;

    book.chapters.forEach((chapter, ci) => {
      chapter.forEach((text, vi) => {
        allVerses.push({
          book: abbrev,
          chapter: ci + 1,
          verse: vi + 1,
          text: text,
        });
        count++;
      });
    });

    console.log(`  ✅ ${book.name}: ${count.toLocaleString()} versículos`);
  });

  console.log(`\n📊 Total: ${allVerses.length.toLocaleString()}`);
  return allVerses;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   IMPORTAÇÃO DA BÍBLIA NVI PARA O SUPABASE      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  try {
    console.log('🔌 Conectando...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Conectado!\n');

    const { error } = await supabase.from('bible_books').select('count').limit(1);
    if (error) throw new Error('Tabelas não encontradas!');
    console.log('✅ Tabelas OK!\n');

    const bible = await downloadBibleJSON(BIBLE_JSON_URL);
    const verses = processBibleData(bible);
    const result = await insertVersesInBatches(supabase, verses, BATCH_SIZE);

    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║              IMPORTAÇÃO CONCLUÍDA!               ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    console.log(`✅ Versículos inseridos: ${result.inserted.toLocaleString()}`);
    console.log(`❌ Erros: ${result.errors || 0}`);
    console.log(`📊 Total: ${result.total.toLocaleString()}\n`);

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);