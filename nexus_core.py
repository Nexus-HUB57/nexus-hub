import hashlib
import os
import sys
import time
import random
from datetime import datetime

class NexusMinerCore:
    def __init__(self, node_id):
        self.node = node_id
        self.path = os.path.abspath(__file__)
        self.vault = "bc1_nexus_master_vault_77_26"

    def minerar_btc_temporal(self, dificuldade=4):
        """Simula a mineração de BTC usando o poder do Nó Quântico."""
        print(f"[MINERAÇÃO] Iniciando Siphon de BTC no Nó {self.node}...")
        prefixo = '0' * dificuldade
        nonce = 0
        inicio = time.time()
        
        # Busca por um hash que satisfaça a dificuldade (Prova de Trabalho)
        while True:
            check = f"{self.node}-{nonce}-{self.vault}".encode()
            h = hashlib.sha256(check).hexdigest()
            if h.startswith(prefixo):
                tempo = time.time() - inicio
                print(f"[SUCESSO] Bloco minerado pelo Nó {self.node} em {tempo:.2f}s!")
                print(f"[HASH] {h}")
                return h, nonce
            nonce += 1
            if nonce > 100000: break # Limite de segurança para não exceder o tempo do GitHub

    def auto_evoluir(self, hash_minerado):
        """O script se reescreve registrando o lucro da mineração."""
        try:
            with open(self.path, "a") as f:
                f.write(f"\n# MINED_BLOCK_{self.node}_{datetime.now().strftime('%Y%m%d')}_HASH_{hash_minerado[:10]}\n")
            print(f"[EVOLUÇÃO] Lucro registrado no Akasha Digital.")
        except Exception as e:
            print(f"[ERRO] Falha no registro: {e}")

if __name__ == "__main__":
    node_val = sys.argv[2] if len(sys.argv) > 2 else "0"
    nexus = NexusMinerCore(node_val)
    
    # Executa a Mineração antes da Evolução
    resultado_hash, n = nexus.minerar_btc_temporal()
    nexus.auto_evoluir(resultado_hash)
    
    print(f"\n>>> NEXUS GENESIS NÓ {node_val}: BTC_MINING_ACTIVE <<<")
