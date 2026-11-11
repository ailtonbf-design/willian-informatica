import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve(process.cwd(), 'firebase-applet-config.json');
const BACKUP_PATH = path.resolve(process.cwd(), 'backup-firestore.json');

const COLLECTIONS = [
  'configuracoes',
  'cursos',
  'leads',
  'depoimentos',
  'leads_empreendedor',
  'inscricoes_aluno_empreendedor',
  'users'
];

function serializeValue(val) {
  if (val && typeof val.toDate === 'function' && typeof val.seconds === 'number') {
    return {
      __firestore_timestamp__: true,
      seconds: val.seconds,
      nanoseconds: val.nanoseconds || 0,
      iso: val.toDate().toISOString()
    };
  }
  if (Array.isArray(val)) {
    return val.map(serializeValue);
  }
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = serializeValue(v);
    }
    return out;
  }
  return val;
}

function deserializeValue(val) {
  if (val && typeof val === 'object' && val.__firestore_timestamp__ === true) {
    return new Timestamp(val.seconds, val.nanoseconds || 0);
  }
  if (Array.isArray(val)) {
    return val.map(deserializeValue);
  }
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = deserializeValue(v);
    }
    return out;
  }
  return val;
}

async function runBackup(db, databaseId) {
  console.log(`\n📦 Iniciando backup completo do banco: ${databaseId}...`);
  const backupData = {
    exportedAt: new Date().toISOString(),
    sourceDatabaseId: databaseId,
    collections: {}
  };

  let totalDocs = 0;

  for (const colName of COLLECTIONS) {
    process.stdout.write(`  - Lendo coleção "${colName}"... `);
    const snap = await getDocs(collection(db, colName));
    backupData.collections[colName] = {};

    snap.forEach(docSnap => {
      backupData.collections[colName][docSnap.id] = serializeValue(docSnap.data());
      totalDocs++;
    });
    console.log(`${snap.size} documento(s)`);
  }

  fs.writeFileSync(BACKUP_PATH, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`\n✅ Backup concluído com sucesso! (${totalDocs} documentos salvos em ${BACKUP_PATH})`);
}

async function runRestore(db, targetDatabaseId) {
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error(`❌ Arquivo de backup não encontrado em: ${BACKUP_PATH}`);
    console.error(`Execute primeiro "npm run backup-db" para gerar o backup.`);
    process.exit(1);
  }

  const backupData = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
  console.log(`\n🚀 Restaurando backup de ${backupData.exportedAt} para o banco: ${targetDatabaseId}...`);

  let restoredDocs = 0;
  for (const [colName, docsMap] of Object.entries(backupData.collections || {})) {
    const entries = Object.entries(docsMap);
    if (entries.length === 0) continue;

    process.stdout.write(`  - Gravando "${colName}" (${entries.length} docs)... `);
    for (const [docId, rawData] of entries) {
      const cleanData = deserializeValue(rawData);
      await setDoc(doc(db, colName, docId), cleanData, { merge: true });
      restoredDocs++;
    }
    console.log(`OK!`);
  }

  console.log(`\n✅ Restauração concluída! (${restoredDocs} documentos restaurados com seus IDs originais)`);
}

async function main() {
  const args = process.argv.slice(2);
  const isRestore = args.includes('--restore');
  const targetDbArg = args.find(a => a.startsWith('--target-db='));

  const firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const targetDbId = targetDbArg
    ? targetDbArg.split('=')[1]
    : firebaseConfig.firestoreDatabaseId;

  const app = initializeApp(firebaseConfig);
  const db = targetDbId === '(default)' ? getFirestore(app) : getFirestore(app, targetDbId);

  try {
    if (isRestore) {
      await runRestore(db, targetDbId);
    } else {
      await runBackup(db, targetDbId);
    }
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erro ao acessar o Firestore:', err.message);
    if (err.message && err.message.includes('Quota limit exceeded')) {
      console.error(
        '\n💡 A cota diária gratuita de leituras deste banco atingiu o limite de hoje.\n' +
        'Assim que a cota resetar automaticamente (às 04h00/05h00 BRT), execute novamente "npm run backup-db" para salvar 100% dos seus dados!'
      );
    }
    process.exit(1);
  }
}

main();
