document.addEventListener("DOMContentLoaded", () => {
    const statusIndicator = document.getElementById("status-indicator");
    const connectionStatus = document.getElementById("connection-status");
    const agentsList = document.getElementById("agents-list");
    const agentCount = document.getElementById("agent-count");
    const messageList = document.getElementById("message-list");
    
    // Poll API since we are an external observer
    let agents = [];
    
    function fetchAgents() {
        fetch("/api/agents")
            .then(res => res.json())
            .then(data => {
                agents = data.agents;
                renderAgents();
            })
            .catch(err => console.error("Error fetching agents", err));
    }
    
    function renderAgents() {
        agentCount.innerText = agents.length;
        if (agents.length === 0) {
            agentsList.innerHTML = `<p class="text-slate-500 text-sm text-center mt-10 italic">Waiting for agents...</p>`;
            return;
        }
        
        agentsList.innerHTML = agents.map(agent => `
            <div class="bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700 p-3 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-blue-300 text-sm truncate">${agent.id}</span>
                    <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.7)]"></span>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                    ${agent.metadata.capabilities.map(cap => 
                        `<span class="text-[10px] bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded-full border border-blue-800/50">${cap}</span>`
                    ).join('') || '<span class="text-xs text-slate-500">No capabilities recorded</span>'}
                </div>
            </div>
        `).join('');
    }
    
    // Auto-scroll messages to bottom
    function appendMessage(html) {
        // Remove empty state if present
        if (messageList.innerHTML.includes("Listening to Nexus Hub")) {
            messageList.innerHTML = "";
        }
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        messageList.appendChild(wrapper.firstElementChild);
        messageList.scrollTop = messageList.scrollHeight;
    }
    
    function fetchMessages() {
        fetch("/api/messages")
            .then(res => res.json())
            .then(data => {
                // Initial load: render all. For now we just poll every 1s
                // A better approach would be connecting as a websocket client, but polling is simpler 
                // Let's implement full websocket for live dashboard
            });
    }

    // Connect this dashboard directly to WebSocket as a 'monitor' agent
    function connectDocs() {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/DashboardMonitor`;
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
             statusIndicator.classList.replace("bg-red-500", "bg-green-500");
             statusIndicator.classList.replace("shadow-[0_0_10px_rgba(239,68,68,0.7)]", "shadow-[0_0_10px_rgba(34,197,94,0.7)]");
             connectionStatus.innerText = "Connected";
             connectionStatus.classList.replace("text-slate-300", "text-green-400");
        };
        
        ws.onclose = () => {
             statusIndicator.classList.replace("bg-green-500", "bg-red-500");
             statusIndicator.classList.replace("shadow-[0_0_10px_rgba(34,197,94,0.7)]", "shadow-[0_0_10px_rgba(239,68,68,0.7)]");
             connectionStatus.innerText = "Disconnected";
             connectionStatus.classList.replace("text-green-400", "text-slate-300");
             setTimeout(connectDocs, 2000); // Reconnect
        };
        
        ws.onmessage = (event) => {
             const data = JSON.parse(event.data);
             
             // Different message types formatting
             if (data.type === "system") {
                 appendMessage(`
                    <div class="text-yellow-400/80 bg-yellow-900/10 p-2 rounded border border-yellow-700/30">
                        <span class="opacity-70">[${new Date().toLocaleTimeString()}]</span> ⚙️ SYSTEM: ${data.content}
                    </div>
                `);
             } else if (data.type === "broadcast" || data.type === "message") {
                 appendMessage(`
                    <div class="bg-indigo-900/10 p-3 rounded-lg border border-indigo-800/30">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-indigo-400 font-bold">${data.sender}</span>
                            <span class="text-slate-500 text-xs">${data.type.toUpperCase()}</span>
                            <span class="text-slate-600 text-xs ml-auto">${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="text-slate-300 pl-2 border-l-2 border-indigo-500/30">${data.content}</div>
                    </div>
                `);
             }
             
             // Always refresh agents when a message arrives
             fetchAgents();
        };
    }
    
    // Init
    connectDocs();
    fetchAgents();
});
