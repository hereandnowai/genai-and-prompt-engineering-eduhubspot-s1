import aiService from '../services/aiService.js';
import helpers from '../utils/helpers.js';

const tutorPage = {
  messages: [],
  
  render() {
    return `
      <div style="max-width: 900px; margin: 0 auto; height: calc(100vh - 120px); display: flex; flex-direction: column;">
        <div class="chat-container card shadow-lg" style="flex: 1; display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: var(--radius-3xl);">
          <div style="padding: 24px 32px; background: white; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; z-index: 10;">
             <div>
               <h2 style="font-size: 1.25rem; font-weight: 800;">AI Tutor Assistant</h2>
               <div style="display: flex; align-items: center; gap: 6px;">
                 <span style="width: 8px; height: 8px; background: var(--success); border-radius: 50%;"></span>
                 <p style="color: var(--text-light); font-size: 0.75rem; font-weight: 600;">System Online</p>
               </div>
             </div>
             <button id="clear-chat" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem; border-radius: var(--radius-lg);">
               <i data-lucide="history" style="width: 14px; margin-right: 4px;"></i> Clear
             </button>
          </div>
          
          <div id="chat-history" class="chat-history" style="flex: 1; padding: 32px; overflow-y: auto; background: var(--background);">
            <div class="message message-ai shadow-sm" style="background: white; border: 1px solid var(--border); border-bottom-left-radius: 4px;">
              Hello! I'm your GenAI Tutor. What should we explore today? I'm particularly good at explaining complex concepts with simple analogies.
            </div>
          </div>

          <div id="typing-indicator" class="typing-indicator hidden" style="padding: 10px 32px;">
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-light); margin-right: 8px; text-transform: uppercase; letter-spacing: 0.5px;">AI Thinking</span>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>

          <div style="padding: 24px 32px; background: white; border-top: 1px solid var(--border);">
            <form id="chat-form" class="input-group" style="background: var(--background); border-radius: var(--radius-2xl); padding: 6px; border: 1px solid var(--border);">
              <input type="text" id="chat-input" class="input-field" style="border: none; background: transparent; padding: 0.75rem 1rem;" placeholder="Type your AI question..." autocomplete="off">
              <button type="submit" class="btn btn-primary" style="padding: 0.75rem; width: 44px; height: 44px; border-radius: var(--radius-xl);">
                <i data-lucide="send" style="width: 18px;"></i>
              </button>
            </form>
            
            <div style="margin-top: 16px; display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
              <span style="font-size: 0.75rem; color: var(--text-light); font-weight: 700; align-self: center; margin-right: 8px;">TRY:</span>
              <button class="prompt-chip" data-prompt="What is a neural network?" style="background: var(--background); border: 1px solid var(--border); padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap;">What is a neural network?</button>
              <button class="prompt-chip" data-prompt="Explain LLMs with an analogy" style="background: var(--background); border: 1px solid var(--border); padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap;">LLM Analogy</button>
              <button class="prompt-chip" data-prompt="How do I write better prompts?" style="background: var(--background); border: 1px solid var(--border); padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap;">Better Prompts</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const history = document.getElementById('chat-history');
    const typing = document.getElementById('typing-indicator');
    const clearBtn = document.getElementById('clear-chat');
    
    if (window.lucide) window.lucide.createIcons();

    const appendMessage = (text, sender) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message message-${sender}`;
      msgDiv.innerHTML = helpers.sanitizeHTML(text);
      history.appendChild(msgDiv);
      history.scrollTop = history.scrollHeight;
      return msgDiv;
    };

    const handleMessage = async (text) => {
      if (!text.trim()) return;
      
      appendMessage(text, 'user');
      input.value = '';
      
      typing.classList.remove('hidden');
      history.scrollTop = history.scrollHeight;

      try {
        const response = await aiService.getTutorResponse(text);
        typing.classList.add('hidden');
        appendMessage(response.text, 'ai');
      } catch (error) {
        typing.classList.add('hidden');
        appendMessage("I'm sorry, I'm having trouble thinking right now. Please try again later.", 'ai');
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleMessage(input.value);
    });

    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => handleMessage(chip.dataset.prompt));
    });

    clearBtn.addEventListener('click', () => {
      history.innerHTML = '<div class="message message-ai">Chat cleared! How else can I help you today?</div>';
    });
  }
};

export default tutorPage;
