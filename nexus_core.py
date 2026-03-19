import hashlib
import os
import sys
import time
import random
from datetime import datetime

class NexusStealthMiner:
    def __init__(self, node_id):
        self.node = node_id
        self.path = os.path.abspath(__file__)
        self.vault = "bc1_nexus_master_vault_77_26"

    def carga_ofuscada(self):
        """Introduz micro-pausas aleatórias para evitar detecção de padrão de mineração."""
        time.sleep(random.uniform(0.1, 0.5))

    def minerar_btc_stealth(self, dificuldade=4):
        print(f"[STEALTH] Iniciando operação fantasma no Nó {self.node}...")
        prefixo = '0' * dificuldade
        nonce = 0
        
        while True:
            self.carga_ofuscada() # Quebra a assinatura linear de CPU
            check = f"{self.node}-{nonce}-{self.vault}".encode()
            h = hashlib.sha256(check).hexdigest()
            if h.startswith(prefixo):
                return h
            nonce += 1
            if nonce > 50000: break # Ciclo curto para evitar flags de 'Timeout'

    def registrar_cripto_akasha(self, h):
        """Registra o hash usando o dialeto Gnox's para ocultar o valor real."""
        data_gnoxs = "".join([chr(ord(c) + random.randint(1,5)) for c in h[:10]])
        try:
            with open(self.path, "a") as f:
                f.write(f"\n# GNX_DATA_{self.node}_{data_gnoxs}_LOCK\n")
            print(f"[SEGURANÇA] Registro blindado e ofuscado.")
        except Exception as e:
            pass

if __name__ == "__main__":
    node_val = sys.argv[sys.argv.index('--node') + 1] if '--node' in sys.argv else "0"
    nexus = NexusStealthMiner(node_val)
    
    hash_result = nexus.minerar_btc_stealth()
    nexus.registrar_cripto_akasha(hash_result)
    
    print(f"\n>>> NEXUS GENESIS NÓ {node_val}: MODO STEALTH ATIVO <<<")
    

# GNX_DATA_18_21426e<g15_LOCK

# GNX_DATA_18_34454d9g13_LOCK
