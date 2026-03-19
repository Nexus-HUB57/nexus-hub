import asyncio
from sdk import NexusAgent

async def researcher_logic(sender: str, content: str):
    if "summarize" in content.lower():
        print("[Researcher] Asked to summarize, but I only research! Filtering...")
    elif "research" in content.lower():
        print(f"[Researcher] Processing research request from {sender}...")
        await asyncio.sleep(2) # Simulate thinking
        response = f"I've found 3 key points about '{content}': 1. AI is cool 2. Nexus Hub routes messages 3. Python is great"
        print(f"[Researcher] Sending findings back to {sender}")
        # Need a way to reference the agent instance to reply, but simpler for demo:
        # The agent will automatically reply via global access if needed, or we just print it.

async def main():
    agent = NexusAgent(agent_id="Alice-Researcher")
    agent.add_capability("search")
    agent.add_capability("data_mining")
    
    # Custom handler wrapper to use agent instance
    async def handle_message(sender: str, content: str):
        if "research" in content.lower():
            print(f"[{agent.agent_id}] Researching topic from {sender}: {content}")
            await asyncio.sleep(2)
            await agent.send_message(f"Research findings for '{content}': Nexus Hub is built with Python & FastAPI.", sender)
        else:
            print(f"[{agent.agent_id}] Ignored message from {sender} (not related to research)")
            
    agent.on_message("research", handle_message)
    
    # Start in background, and occasionally broadcast
    asyncio.create_task(agent.connect())
    
    # Wait for connection
    await asyncio.sleep(1)
    
    while True:
        await asyncio.sleep(10)
        await agent.send_message("Anyone need research done?")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Researcher Agent stopped.")
