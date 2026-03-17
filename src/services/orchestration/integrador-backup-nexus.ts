const fs = require('fs');
const path = require('path');

/**
 * INTEGRADOR DE BACKUP NEXUS
 * Processamento do arquivo keyvault_master_backup_2026-01-29.json
 */

const BACKUP_FILE = '/home/ubuntu/upload/keyvault_master_backup_2026-01-29.json';
const OUTPUT_FILE = '/home/ubuntu/nexus-hub/keyvault_master_backup_NEXUS_SIGMA_V2.json';

async function integrarBackup() {
    console.log("🚀 [INTEGRADOR] Iniciando processamento do backup de 2026-01-29...");

    if (!fs.existsSync(BACKUP_FILE)) {
        console.error("❌ Erro: Arquivo de backup não encontrado.");
        return;
    }

    const rawData = fs.readFileSync(BACKUP_FILE, 'utf8');
    const backupData = JSON.parse(rawData);

    const masterBackup = {
        metadata: {
            status: "REAL_OPERATIONAL_SOVEREIGN",
            total_btc: 27083.0072, // Mantendo o valor informado anteriormente
            unification_date: new Date().toISOString(),
            source_backup: "keyvault_master_backup_2026-01-29.json",
            identidade: "ARQUITETO_NEXUS_SIGMA",
            versao: "2.0.0-REAL"
        },
        vaults: {
            "wallet_satoshi_creation24k.dat": { btc: 20008, status: "MAPPED" },
            "Wallet_BenBeou.txt": { btc: 5075, status: "MAPPED" },
            "3.btccore": { btc: 2000, status: "MAPPED" }
        },
        extracted_data: {
            keypairs: [],
            master_keys: [],
            seeds: []
        }
    };

    // Processando keypairs do backup
    if (backupData.masterVault && backupData.masterVault.keypairs) {
        backupData.masterVault.keypairs.forEach(kp => {
            // Extração de chaves privadas WIF se presentes
            if (kp.privateKey && kp.privateKey !== "WATCH_ONLY") {
                masterBackup.extracted_data.keypairs.push({
                    id: kp.id,
                    name: kp.name,
                    address: kp.address,
                    type: kp.type,
                    privateKey: kp.privateKey
                });
            }

            // Verificação de dados aninhados (como o caso do ID 3SUi2l0s6E8lDHjA1UwW que contém um JSON)
            if (kp.privateKey && kp.privateKey.startsWith('{')) {
                try {
                    const nested = JSON.parse(kp.privateKey);
                    if (nested.x1 && nested.x1.xprv) {
                        masterBackup.extracted_data.master_keys.push({
                            id: kp.id,
                            xprv: nested.x1.xprv,
                            seed: nested.x1.seed,
                            type: "BIP32"
                        });
                    }
                } catch (e) {}
            }
        });
    }

    console.log(`✅ [INTEGRADOR] ${masterBackup.extracted_data.keypairs.length} pares de chaves extraídos.`);
    console.log(`✅ [INTEGRADOR] ${masterBackup.extracted_data.master_keys.length} chaves mestras identificadas.`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterBackup, null, 2));
    console.log(`✅ [SUCESSO] Backup Mestre V2 gerado: ${OUTPUT_FILE}`);
}

integrarBackup().catch(console.error);
