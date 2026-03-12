import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import CryptoJS from "crypto-js";

const bip32 = BIP32Factory(ecc);

export type AddressType = "P2PKH" | "P2SH" | "P2WPKH" | "P2WSH";

export interface EncryptedPrivateKey {
  iv: string;
  ciphertext: string;
  salt: string;
}

export interface BitcoinWallet {
  address: string;
  publicKey: string;
  privateKey: string;
  addressType: AddressType;
  derivationPath: string;
}

export interface UTXO {
  txid: string;
  vout: number;
  value: number;
  script: string;
}

export class BitcoinWalletManager {
  private masterKey: any | null = null;
  private encryptionPassword: string;

  constructor(encryptionPassword: string) {
    this.encryptionPassword = encryptionPassword;
  }

  generateMnemonic(): string {
    return bip39.generateMnemonic(256);
  }

  async importFromMnemonic(mnemonic: string): Promise<void> {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic");
    }
    const seed = await bip39.mnemonicToSeed(mnemonic);
    this.masterKey = bip32.fromSeed(Buffer.from(seed));
  }

  generateP2WPKH(derivationPath: string = "m/84'/0'/0'/0/0"): BitcoinWallet {
    if (!this.masterKey) throw new Error("Master key not initialized");
    const derivedKey = this.masterKey.derivePath(derivationPath);
    const { address } = bitcoin.payments.p2wpkh({ pubkey: derivedKey.publicKey });
    if (!address) throw new Error("Failed to generate address");
    return {
      address,
      publicKey: (derivedKey.publicKey as Buffer).toString("hex"),
      privateKey: derivedKey.toWIF(),
      addressType: "P2WPKH",
      derivationPath,
    };
  }

  encryptPrivateKey(privateKey: string): EncryptedPrivateKey {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const key = CryptoJS.PBKDF2(this.encryptionPassword, salt, { keySize: 256 / 32, iterations: 1000 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const encrypted = CryptoJS.AES.encrypt(privateKey, key, { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return { iv, ciphertext: encrypted.toString(), salt };
  }
}

export class BitcoinTransactionBuilder {
  private network: bitcoin.Network;

  constructor(network: "mainnet" | "testnet" = "mainnet") {
    this.network = network === "mainnet" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
  }

  /**
   * Constrói transação com Regra 80/10/10
   */
  buildSplitTransaction(
    utxos: UTXO[],
    totalAmount: number,
    addresses: { executor: string; progenitor: string; infrastructure: string },
    feeRate: number
  ): bitcoin.Psbt {
    const psbt = new bitcoin.Psbt({ network: this.network });
    
    // Adicionar inputs
    utxos.forEach(utxo => {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: { script: Buffer.from(utxo.script, 'hex'), value: BigInt(utxo.value) }
      });
    });

    const netAmount = totalAmount - this.calculateFee(utxos.length, 3, feeRate);
    
    // Regra 80/10/10
    psbt.addOutput({ address: addresses.executor, value: BigInt(Math.floor(netAmount * 0.8)) });
    psbt.addOutput({ address: addresses.progenitor, value: BigInt(Math.floor(netAmount * 0.1)) });
    psbt.addOutput({ address: addresses.infrastructure, value: BigInt(Math.floor(netAmount * 0.1)) });

    return psbt;
  }

  calculateFee(inputCount: number, outputCount: number, feeRate: number): number {
    const estimatedSize = 10 + inputCount * 68 + outputCount * 31;
    return Math.ceil(estimatedSize * feeRate);
  }
}
