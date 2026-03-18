/**
 * @fileOverview Núcleo Soberano - Integração e Criptografia de Vaults
 * 
 * Este script processa todas as entradas do ZIP, valida chaves privadas,
 * deriva endereços e salva um cofre unificado criptografado com AES-256.
 */

import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ECPair = ECPairFactory(ecc);

// Configurações de Criptografia
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NEXUS_SOVEREIGN_PASSPHRASE = process.env.NEXUS_SOVEREIGN_PASSPHRASE;
const NEXUS_SALT = process.env.NEXUS_SALT;

if (!NEXUS_SOVEREIGN_PASSPHRASE || !NEXUS_SALT) {
    throw new Error('A passphrase e o salt do cofre soberano devem ser definidos nas variáveis de ambiente.');
}

const ENCRYPTION_KEY = crypto.scryptSync(NEXUS_SOVEREIGN_PASSPHRASE, NEXUS_SALT, 32);
const IV_LENGTH = 16;

function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

interface VaultEntry {
    address: string;
    wif: string;
    type: string;
    layer: string;
    label?: string;
}

async function integrateVault() {
    console.log('--- INICIANDO INTEGRAÇÃO DO NÚCLEO SOBERANO ---');
    
    const vault: Record<string, any> = {
        metadata: {
            total_entries: 0,
            integrated_at: new Date().toISOString(),
            version: '2.0.0'
        },
        vaults: {} as Record<string, VaultEntry>
    };

    const importDir = '/home/ubuntu/nexus-hub/imports/vault';
    
    // 1. Processar import_report.txt (Pares conhecidos)
    const reportPath = path.join(importDir, 'import_report.txt');
    if (fs.existsSync(reportPath)) {
        const content = fs.readFileSync(reportPath, 'utf-8');
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Endereço:')) {
                const address = lines[i].split('Endereço:')[1].trim();
                const wifLine = lines[i+1];
                if (wifLine && wifLine.includes('Chave Privada:')) {
                    const wif = wifLine.split('Chave Privada:')[1].trim();
                    if (wif.length > 20) { // Evitar chaves truncadas no relatório
                        vault.vaults[address] = {
                            address,
                            wif: encrypt(wif),
                            type: 'p2pkh',
                            layer: 'IMPORT_REPORT'
                        };
                    }
                }
            }
        }
    }

    // 2. Processar pasted_content_2.txt (WIFs puros)
    const pastedPath = path.join(importDir, 'pasted_content_2.txt');
    if (fs.existsSync(pastedPath)) {
        const content = fs.readFileSync(pastedPath, 'utf-8');
        const wifRegex = /[5KL][1-9A-HJ-NP-Za-km-z]{50,51}/g;
        const matches = content.match(wifRegex) || [];
        
        for (const wif of matches) {
            try {
                const keyPair = ECPair.fromWIF(wif);
                const { address } = bitcoin.payments.p2pkh({ pubkey: Buffer.from(keyPair.publicKey) });
                if (address && !vault.vaults[address]) {
                    vault.vaults[address] = {
                        address,
                        wif: encrypt(wif),
                        type: 'p2pkh',
                        layer: 'PASTED_CONTENT'
                    };
                }
            } catch (e) {
                // Pular chaves inválidas ou truncadas
            }
        }
    }

    // As chaves mestras (masterEntries) foram removidas do código para maior segurança.
    // Elas devem ser importadas de uma fonte segura (ex: HSM, KMS) em um ambiente de produção real.

    vault.metadata.total_entries = Object.keys(vault.vaults).length;

    // Salvar cofre criptografado
    const outputPath = '/home/ubuntu/nexus-hub/src/services/orchestration/sovereign-vault.json';
    fs.writeFileSync(outputPath, JSON.stringify(vault, null, 2));

    console.log(`\n✅ INTEGRAÇÃO CONCLUÍDA:`);
    console.log(`- Total de Entradas: ${vault.metadata.total_entries}`);
    console.log(`- Arquivo Salvo: ${outputPath}`);
    console.log(`- Status: TODAS AS CHAVES CRIPTOGRAFADAS (AES-256)`);
}

integrateVault().catch(console.error);
