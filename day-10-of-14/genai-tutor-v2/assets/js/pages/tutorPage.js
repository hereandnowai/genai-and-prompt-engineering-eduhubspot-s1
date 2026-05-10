const TutorPage = {
    messages: [],
    
    render() {
        const container = document.createElement('div');
        container.className = 'tutor-page animate-fade-in';
        container.innerHTML = `
            <div class="chat-container card" style="height: calc(100vh - 180px); display: flex; flex-direction: column; overflow: hidden; padding: 0;">
                <div class="chat-header" style="padding: 20px; border-bottom: 1px solid var(--border-light); background: var(--bg-light); display: flex; justify-content: space-between;">
                    <div>
                        <h2 style="font-size: 1.25rem;">🤖 AI Tutor</h2>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">Explain AI to me like I'm 5</span>
                    </div>
                    <button class="btn btn-outline" id="clear-chat" style="padding: 5px 15px; font-size: 0.8rem;">Clear Chat</button>
                </div>
                
                <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <!-- Messages will appear here -->
                </div>

                <div id="typing-indicator" style="padding: 0 20px 10px; display: none;">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>

                <div class="chat-input-area" style="padding: 20px; border-top: 1px solid var(--border-light); display: flex; gap: 10px;">
                    <input type="text" id="chat-input" placeholder="Ask anything about AI..." style="flex: 1; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; outline: none;">
                    <button id="send-btn" class="btn btn-primary" style="padding: 10px 25px;">Send</button>
                </div>
            </div>
            
            <div class="suggestions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="suggestion-chip">What is AI?</button>
                <button class="suggestion-chip">How does ML work?</button>
                <button class="suggestion-chip">What is a Neural Network?</button>
            </div>
        `;

        this.initChat(container);
        return container;
    },

    initChat(container) {
        const input = container.querySelector('#chat-input');
        const sendBtn = container.querySelector('#send-btn');
        const messagesDiv = container.querySelector('#chat-messages');
        const typing = container.querySelector('#typing-indicator');

        const addMessage = (text, sender) => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble chat-bubble-${sender} animate-slide-up`;
            bubble.innerText = text;
            messagesDiv.appendChild(bubble);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            // Save to local state/history
            state.conversations.push({ text, sender, time: new Date() });
            StorageService.save(APP_CONFIG.STORAGE_KEYS.CONVERSATIONS, state.conversations);
        };

        // Welcome message if history empty
        if (state.conversations.length === 0) {
            addMessage("Hi there! I'm your AI tutor. I can explain complex AI topics using simple analogies. What would you like to explore first?", 'ai');
        } else {
            state.conversations.forEach(m => {
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble chat-bubble-${m.sender}`;
                bubble.innerText = m.text;
                messagesDiv.appendChild(bubble);
            });
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        const handleSend = async () => {
            const val = input.value.trim();
            if (!val) return;

            addMessage(val, 'user');
            input.value = '';
            
            typing.style.display = 'block';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            const aiRes = await AIService.getResponse(val);
            typing.style.display = 'none';
            addMessage(aiRes, 'ai');
            
            // Reward XP for engagement
            state.progress.xp += 5;
            state.update({ progress: state.progress });
        };

        sendBtn.onclick = handleSend;
        input.onkeypress = (e) => e.key === 'Enter' && handleSend();
        
        container.querySelectorAll('.suggestion-chip').forEach(btn => {
            btn.onclick = () => {
                input.value = btn.innerText;
                handleSend();
            };
        });

        container.querySelector('#clear-chat').onclick = () => {
            state.conversations = [];
            StorageService.save(APP_CONFIG.STORAGE_KEYS.CONVERSATIONS, []);
            messagesDiv.innerHTML = '';
            addMessage("History cleared. How can I help you today?", 'ai');
        };
    }
};
