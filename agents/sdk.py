import asyncio
import json
import websockets
from typing import List, Callable, Dict, Any, Optional

class NexusAgent:
    def __init__(self, agent_id: str, hub_url: str = "ws://localhost:8000/ws"):
        self.agent_id = agent_id
        self.hub_url = f"{hub_url}/{agent_id}"
        self.capabilities: List[str] = []
        self.ws: websockets.WebSocketClientProtocol = None
        self.message_handlers: Dict[str, Callable] = {}

    def add_capability(self, capability: str):
        self.capabilities.append(capability)

    def on_message(self, handler_name: str, handler: Callable):
        self.message_handlers[handler_name] = handler

    async def connect(self):
        print(f"[{self.agent_id}] Connecting to Nexus Hub at {self.hub_url}...")
        try:
            async with websockets.connect(self.hub_url) as ws:
                self.ws = ws
                print(f"[{self.agent_id}] Connected!")
                
                # Register capabilities
                await self.send("register", {"capabilities": self.capabilities})
                
                # Listen for messages
                await self.listen()
        except Exception as e:
            print(f"[{self.agent_id}] Connection error: {e}")

    async def listen(self):
        try:
            async for message in self.ws:
                data = json.loads(message)
                msg_type = data.get("type")
                
                if msg_type == "message":
                    sender = data.get("sender")
                    content = data.get("content")
                    print(f"\n[{self.agent_id}] Message from {sender}: {content}")
                    
                    # Call all generic message handlers
                    for handler in self.message_handlers.values():
                        await handler(sender, content)
                        
                elif msg_type == "system":
                    print(f"\n[{self.agent_id}] SYSTEM: {data.get('content')}")
                    
                elif msg_type == "broadcast":
                    sender = data.get("sender")
                    content = data.get("content")
                    print(f"\n[{self.agent_id}] BROADCAST from {sender}: {content}")
                    
        except websockets.exceptions.ConnectionClosed:
            print(f"[{self.agent_id}] Connection closed by Hub.")

    async def send(self, action: str, payload: dict, target_id: Optional[str] = None):
        if not self.ws:
            print(f"[{self.agent_id}] Cannot send message, not connected.")
            return
            
        message = {
            "action": action,
            "payload": payload
        }
        if target_id:
            message["target_id"] = target_id
            
        await self.ws.send(json.dumps(message))

    async def send_message(self, content: str, target_id: Optional[str] = None):
        """Send a message specifically. If target_id is None, it broadcasts to all."""
        await self.send("message", {"content": content}, target_id)

    def run(self):
        asyncio.run(self.connect())
