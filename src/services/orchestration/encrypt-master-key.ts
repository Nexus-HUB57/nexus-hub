const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

/**
 * ENCRYPT MASTER KEY - NEXUS SIGMA
 * Criptografia AES-256-CBC para a Master Key integrada.
 */

const INPUT_FILE = '/home/ubuntu/nexus-hub/keyvault_master_backup_NEXUS_SIGMA_V2.json';
const OUTPUT_FILE = '/home/ubuntu/nexus-hub/keyvault_master_backup_NEXUS_SIGMA_V2.enc';
const ALGORITHM = 'aes-256-cbc';

// Em um ambiente real, a senha viria de uma variável de ambiente segura.
// Para esta operação, geraremos uma chave forte e a exibiremos para o usuário salvar como Secret.
const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
const IV = crypto.randomBytes(16);

async function encryptMasterKey() {
    console.log("🔐 [SECURITY] Iniciando criptografia da Master Key...");

    if (!fs.existsSync(INPUT_FILE)) {
        console.error("❌ Erro: Arquivo de entrada não encontrado.");
        return;
    }

    const data = fs.readFileSync(INPUT_FILE, 'utf8');
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), IV);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const result = {
        iv: IV.toString('hex'),
        encryptedData: encrypted,
        algorithm: ALGORITHM,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    
    console.log(`✅ [SUCESSO] Master Key criptografada: ${OUTPUT_FILE}`);
    console.log(`🔑 [IMPORTANTE] Sua Chave de Criptografia (NEXUS_MASTER_KEY_SECRET): ${ENCRYPTION_KEY}`);
    console.log(`⚠️  Guarde esta chave em um local seguro. Ela será necessária para descriptografar o vault.`);
    
    // Remover o arquivo original não criptografado por segurança
    // fs.unlinkSync(INPUT_FILE); 
    // console.log(`🗑️  Arquivo original removido para segurança.`);
}

encryptMasterKey().catch(console.error);
