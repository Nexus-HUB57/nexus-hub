import random
import time
import json
import requests
from datetime import datetime

class IoTSimulator:
    """Simulador de Sensores IoT e ERP para o Ecossistema Nexus"""
    
    def __init__(self, backend_url="http://localhost:8000"):
        self.backend_url = backend_url
        self.active_sensors = [
            {"id": "SENSOR-BIO-001", "type": "BIO_VOLUME", "location": "Amazonas, BR"},
            {"id": "SENSOR-BIO-002", "type": "BIO_VOLUME", "location": "Pantanal, BR"},
            {"id": "ERP-PROD-001", "type": "INDUSTRIAL_OUTPUT", "location": "São Paulo, BR"},
            {"id": "SOLAR-GEN-001", "type": "ENERGY_YIELD", "location": "Ceará, BR"}
        ]

    def generate_sensor_data(self):
        sensor = random.choice(self.active_sensors)
        
        if sensor["type"] == "BIO_VOLUME":
            value = random.uniform(10.5, 150.8)
            unit = "Tons"
        elif sensor["type"] == "INDUSTRIAL_OUTPUT":
            value = random.randint(100, 5000)
            unit = "Units"
        else:
            value = random.uniform(50.0, 500.0)
            unit = "kWh"
            
        return {
            "sensor_id": sensor["id"],
            "type": sensor["type"],
            "location": sensor["location"],
            "value": round(value, 2),
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "integrity_hash": "gen_" + hex(random.getrandbits(64))[2:]
        }

    def start_streaming(self, interval=5):
        print(f"--- INICIANDO STREAMING DE DADOS IOT/ERP PARA {self.backend_url} ---")
        try:
            while True:
                data = self.generate_sensor_data()
                print(f"[{data['timestamp']}] Enviando: {data['sensor_id']} -> {data['value']} {data['unit']}")
                
                try:
                    # Tentar enviar para o backend se estiver rodando
                    requests.post(f"{self.backend_url}/api/v5/production/iot-ingest", json=data, timeout=2)
                except:
                    pass
                    
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n--- STREAMING ENCERRADO ---")

if __name__ == "__main__":
    simulator = IoTSimulator()
    simulator.start_streaming()
