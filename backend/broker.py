import json
import asyncio
from typing import Dict, List, Any
from fastapi import WebSocket

class MessageBroker:
    def __init__(self):
        # Maps agent_id to WebSocket connection
        self.active_agents: Dict[str, WebSocket] = {}
        # Stores agent metadata (capabilities, status)
        self.agents_metadata: Dict[str, dict] = {}
        # Stores recent messages for dashboard visualization
        self.recent_messages: List[dict] = []
        # Message history limit
        self.max_messages = 100

    async def connect(self, websocket: WebSocket, agent_id: str):
        await websocket.accept()
        self.active_agents[agent_id] = websocket
        self.agents_metadata[agent_id] = {"status": "connected", "capabilities": []}
        print(f"[Hub] Agent connected: {agent_id}")
        await self.broadcast_system_message(f"Agent {agent_id} joined the nexus")

    def disconnect(self, agent_id: str):
        if agent_id in self.active_agents:
            del self.active_agents[agent_id]
        if agent_id in self.agents_metadata:
            del self.agents_metadata[agent_id]
        print(f"[Hub] Agent disconnected: {agent_id}")
        # Need to wrap this in an async task since disconnect is sync
        asyncio.create_task(self.broadcast_system_message(f"Agent {agent_id} left the nexus"))

    async def process_message(self, sender_id: str, data: dict):
        action = data.get("action")
        payload = data.get("payload", {})
        
        if action == "register":
            # Update agent capabilities
            self.agents_metadata[sender_id]["capabilities"] = payload.get("capabilities", [])
            print(f"[Hub] Agent {sender_id} registered capabilities: {self.agents_metadata[sender_id]['capabilities']}")
            
        elif action == "message":
            # Route message to recipient or broadcast
            target_id = data.get("target_id")
            content = payload.get("content", "")
            
            message_record = {
                "sender": sender_id,
                "target": target_id or "all",
                "content": content,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            self._store_message(message_record)
            
            if target_id and target_id in self.active_agents:
                print(f"[Hub] Route {sender_id} -> {target_id}: {content}")
                await self.active_agents[target_id].send_json({
                    "type": "message",
                    "sender": sender_id,
                    "content": content
                })
            else:
                print(f"[Hub] Broadcast from {sender_id}: {content}")
                await self.broadcast({
                    "type": "broadcast",
                    "sender": sender_id,
                    "content": content
                }, exclude=sender_id)

    def _store_message(self, message: dict):
        self.recent_messages.append(message)
        if len(self.recent_messages) > self.max_messages:
            self.recent_messages.pop(0)

    async def broadcast(self, message: dict, exclude: str = None):
        for target_id, ws in self.active_agents.items():
            if target_id != exclude:
                await ws.send_json(message)
                
    async def broadcast_system_message(self, content: str):
        await self.broadcast({
            "type": "system",
            "sender": "NexusHub",
            "content": content
        })

    def get_active_agents_info(self):
        return [{"id": a_id, "metadata": meta} for a_id, meta in self.agents_metadata.items()]
        
    def get_recent_messages(self):
        return self.recent_messages
