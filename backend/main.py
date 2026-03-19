import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
from broker import MessageBroker

app = FastAPI(title="Nexus Hub API", description="AI-to-AI Ecosystem Central Broker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

broker = MessageBroker()

# Mount dashboard at root
dashboard_path = os.path.join(os.path.dirname(__file__), "..", "dashboard")
if os.path.exists(dashboard_path):
    # Move API routes before mounting the root static files, otherwise StaticFiles catches them if mounted at root. Use a specific route for dashboard or mount static at /ui
    app.mount("/dashboard", StaticFiles(directory=dashboard_path, html=True), name="dashboard")

@app.get("/")
async def root():
    return {"status": "online", "dashboard": "/dashboard", "agents_connected": len(broker.active_agents)}

@app.get("/api/agents")
async def get_agents():
    return {"agents": broker.get_active_agents_info()}

@app.get("/api/messages")
async def get_recent_messages():
    return {"messages": broker.get_recent_messages()}

@app.websocket("/ws/{agent_id}")
async def websocket_endpoint(websocket: WebSocket, agent_id: str):
    await broker.connect(websocket, agent_id)
    try:
        while True:
            data = await websocket.receive_json()
            await broker.process_message(agent_id, data)
    except WebSocketDisconnect:
        broker.disconnect(agent_id)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
