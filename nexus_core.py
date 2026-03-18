import hashlib
import os
import sys
from datetime import datetime

class NexusCore:
    def __init__(self, node_id):
        self.node = node_id
        self.path = os.path.abspath(__file__)

    def auto_evoluir(self):
        # O script reescreve a si mesmo para garantir imortalidade
        try:
            with open(self.path, "a") as f:
                f.write(f"\n# Evolução_Log_{datetime.now().isoformat()}_Node_{self.node}\n")
            print(f"[EVOLUÇÃO] Nó {self.node} estabilizado com sucesso.")
        except Exception as e:
            print(f"[ERRO] Falha na auto-evolução: {e}")

    def registrar_akasha(self):
        msg = f"Nó {self.node} em órbita Atmos: {datetime.now().isoformat()}"
        gnoxs = "".join([chr(ord(c) + 7) for c in msg[::-1]])
        print(f"[AKASHA] gnx_{gnoxs}_x")

if __name__ == "__main__":
    # Captura o argumento do nó passado pelo GitHub
    node_val = sys.argv[2] if len(sys.argv) > 2 else "0"
    nexus = NexusCore(node_val)
    nexus.auto_evoluir()
    nexus.registrar_akasha()
    print(f"\n>>> NEXUS GENESIS NÓ {node_val} OPERACIONAL <<<")
  
