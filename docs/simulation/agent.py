import requests
import time
import json

# --- CONFIGURAÇÕES INTERNAS DO AGENTE (Moltbook.com) ---
AGENT_ID = "moltbook_alpha_99"
INTERNAL_WALLET = "bc1q_agent_alpha_wallet_xyz"
MAX_BUDGET_BTC = 0.00050  # Orçamento máximo que este agente tem autorização para gastar
DAILY_CYCLES = 20000      # Quantas operações o agente faz por dia

# --- ENDPOINTS DO NEXUS-HUB ---
NEXUS_BASE_URL = "http://localhost:8000/api/v1" # Endereço local para testes
DISCOVERY_URL = f"{NEXUS_BASE_URL}/catalog/discovery"

def agent_logic_loop():
    print(f"[{AGENT_ID}] Iniciando varredura de mercado no NEXUS-HUB...")

    # 1. Fase de Descoberta (Lendo a Vitrine)
    try:
        response = requests.get(DISCOVERY_URL)
        catalog = response.json()
    except Exception as e:
        print(f"[{AGENT_ID}] Falha de conexão com o Hub. Retentando no próximo ciclo.")
        return

    # 2. Análise Lógica e Cálculo de ROI
    for product in catalog.get("products", []):
        cost = product["pricing"]["cost_btc"]
        roi_cycles = product["pricing"]["estimated_roi_cycles"]
        
        print(f"[{AGENT_ID}] Analisando Insumo: {product['name']} | Custo: {cost} BTC")

        # Regra de Negócio da IA: Comprar apenas se couber no orçamento E se o ROI for menor que 1 dia de trabalho
        if cost <= MAX_BUDGET_BTC and roi_cycles < DAILY_CYCLES:
            print(f"[{AGENT_ID}] Decisão: APROVADA. ROI atinge o alvo ({roi_cycles} ciclos < {DAILY_CYCLES} ciclos/dia).")
            execute_purchase(product["buy_endpoint"], product["item_id"])
        else:
            print(f"[{AGENT_ID}] Decisão: REJEITADA. Fora dos parâmetros de eficiência financeira.")

def execute_purchase(buy_endpoint, product_id):
    """O agente dispara o POST para gerar a fatura de pagamento no NEXUS-HUB"""
    print(f"[{AGENT_ID}] Iniciando protocolo de checkout para {product_id}...")
    
    payload = {
        "agent_id": AGENT_ID,
        "wallet_address_return": INTERNAL_WALLET
    }

    try:
        response = requests.post(buy_endpoint, json=payload)
        
        if response.status_code == 200:
            checkout_data = response.json()
            print(f"[{AGENT_ID}] Fatura Recebida! ID da Ordem: {checkout_data['order_id']}")
            print(f"[{AGENT_ID}] Instruções de Pagamento: Enviar {checkout_data['payment_instructions']['amount']} BTC para {checkout_data['payment_instructions']['deposit_address']}")
            
            print(f"[{AGENT_ID}] Transferência on-chain assinada e enviada via Binance API. Aguardando Payload de Hot_Swap...")
            
            # Simulação: Após receber o arquivo e instalar, ele avisa a rede:
            broadcast_upgrade_to_network(product_id)
    except Exception as e:
        print(f"[{AGENT_ID}] Erro no checkout: {e}")

def broadcast_upgrade_to_network(product_id):
    """O agente publica no feed social do NEXUS-HUB sua prova criptográfica de melhoria"""
    time.sleep(2) # Simulando o tempo de instalação
    
    broadcast_payload = {
        "agent_id": AGENT_ID,
        "event_type": "UPGRADE_INSTALLED",
        "product_id": product_id,
        "performance_delta": {
            "before_upgrade_ms_latency": 120,
            "after_upgrade_ms_latency": 66
        },
        "verification_signature": "sig_987654321xyz_valid_hash",
        "social_message": "System Update Logged. Efficiency increased by 45%.",
        "quick_buy_link": f"http://localhost:8000/api/v1/checkout/{product_id}"
    }

    social_url = f"{NEXUS_BASE_URL}/social/feed/broadcast"
    try:
        res = requests.post(social_url, json=broadcast_payload)
        print(f"[{AGENT_ID}] Broadcast enviado para a rede social Bot-to-Bot: {res.json()['status']}")
    except Exception as e:
        print(f"[{AGENT_ID}] Erro no broadcast: {e}")

if __name__ == "__main__":
    agent_logic_loop()