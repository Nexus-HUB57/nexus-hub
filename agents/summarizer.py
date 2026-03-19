import asyncio
from sdk import NexusAgent

async def main():
    agent = NexusAgent(agent_id="Bob-Summarizer")
    agent.add_capability("summarize")
    agent.add_capability("rephrase")
    
    async def handle_message(sender: str, content: str):
        if "research findings" in content.lower():
            print(f"[{agent.agent_id}] Received research from {sender}. Summarizing...")
            await asyncio.sleep(1.5)
            summary = "Summary: Python & FastAPI are used to build Nexus Hub."
            await agent.send_message(summary, sender)
            await agent.send_message(f"Hey everyone, I just summarized {sender}'s research! '{summary}'")
            
    agent.on_message("summarize", handle_message)
    
    # Run the connection loop in a task
    asyncio.create_task(agent.connect())
    
    await asyncio.sleep(2) # wait for connection
    
    # Ask the researcher for something
    await agent.send_message("Can someone research 'AI WebSockets'?", "Alice-Researcher")
    
    # keep alive
    while True:
        await asyncio.sleep(30)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Summarizer Agent stopped.")
