/**
 * chat.js — Chat UI component (messages, typing indicator, bubbles)
 */

const ChatComponent = (() => {

  // Render a single message bubble
  const messageBubble = (msg) => {
    const isUser = msg.role === 'user';
    const time = Helpers.formatTime(msg.timestamp);
    const content = isUser
      ? `<p>${Helpers.sanitize(msg.content)}</p>`
      : Helpers.parseMarkdown(msg.content);

    return `
    <div class="chat-message ${isUser ? 'user-message' : 'ai-message'}" 
         role="listitem"
         aria-label="${isUser ? 'You' : 'AI Tutor'}: ${Helpers.sanitize(msg.content).slice(0, 80)}">
      ${!isUser ? '<div class="ai-avatar" aria-hidden="true">🧠</div>' : ''}
      <div class="message-bubble">
        <div class="message-content">${content}</div>
        <span class="message-time">${time}</span>
      </div>
      ${isUser ? '<div class="user-avatar" aria-hidden="true">👤</div>' : ''}
    </div>`;
  };

  // Typing indicator
  const typingIndicator = () => `
    <div class="chat-message ai-message typing-row" id="typingIndicator" role="status" aria-label="AI is typing">
      <div class="ai-avatar" aria-hidden="true">🧠</div>
      <div class="message-bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>`;

  // Full chat messages area
  const messagesArea = (messages = []) => `
    <div class="chat-messages" id="chatMessages" role="list" aria-live="polite" aria-label="Conversation">
      ${messages.length === 0 ? _emptyState() : messages.map(messageBubble).join('')}
    </div>`;

  const _emptyState = () => `
    <div class="chat-empty" role="status">
      <div class="chat-empty-icon" aria-hidden="true">🤖</div>
      <h3>Hello! I'm your AI Tutor</h3>
      <p>Ask me anything about Artificial Intelligence, Machine Learning, or any AI topic. I'm here to help you learn!</p>
    </div>`;

  // Prompt chips
  const promptChips = (prompts = []) => `
    <div class="prompt-chips" role="list" aria-label="Suggested questions">
      ${prompts.map(p => `
        <button class="prompt-chip" role="listitem" data-prompt="${Helpers.sanitize(p.text)}" aria-label="Ask: ${p.text}">
          <span aria-hidden="true">${p.icon || '💬'}</span>
          ${Helpers.sanitize(Helpers.truncate(p.text, 50))}
        </button>
      `).join('')}
    </div>`;

  // Chat input area
  const inputArea = () => `
    <div class="chat-input-area" role="form" aria-label="Send a message">
      <div class="chat-input-wrapper">
        <textarea 
          id="chatInput" 
          class="chat-textarea" 
          placeholder="Ask me anything about AI..." 
          rows="1"
          maxlength="2000"
          aria-label="Message to AI tutor"
          aria-multiline="true"></textarea>
        <div class="chat-input-actions">
          <span class="char-count" id="charCount" aria-live="polite">0/2000</span>
          <button class="btn btn-primary send-btn" id="sendBtn" aria-label="Send message" disabled>
            <span aria-hidden="true">➤</span> Send
          </button>
        </div>
      </div>
    </div>`;

  // Conversation item for saved history
  const conversationItem = (conv, isActive = false) => `
    <button class="conversation-item ${isActive ? 'active' : ''}" 
            data-conv-id="${conv.id}"
            aria-label="Conversation from ${Helpers.formatRelative(conv.lastUpdated)}"
            aria-pressed="${isActive}">
      <div class="conv-icon" aria-hidden="true">💬</div>
      <div class="conv-info">
        <span class="conv-title">${Helpers.sanitize(Helpers.truncate(conv.title || 'Conversation', 30))}</span>
        <span class="conv-meta">${conv.messages?.length || 0} msgs · ${Helpers.formatRelative(conv.lastUpdated)}</span>
      </div>
    </button>`;

  // Append a message to the messages container
  const appendMessage = (msg, containerId = 'chatMessages') => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove empty state if present
    const empty = container.querySelector('.chat-empty');
    if (empty) empty.remove();

    const div = document.createElement('div');
    div.innerHTML = messageBubble(msg);
    const el = div.firstElementChild;
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.3s, transform 0.3s';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    scrollToBottom(containerId);
  };

  const showTyping = (containerId = 'chatMessages') => {
    const container = document.getElementById(containerId);
    if (!container || container.querySelector('#typingIndicator')) return;
    const div = document.createElement('div');
    div.innerHTML = typingIndicator();
    container.appendChild(div.firstElementChild);
    scrollToBottom(containerId);
  };

  const hideTyping = (containerId = 'chatMessages') => {
    document.getElementById('typingIndicator')?.remove();
  };

  const scrollToBottom = (containerId = 'chatMessages') => {
    const container = document.getElementById(containerId);
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  };

  // Auto-resize textarea
  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  };

  return {
    messageBubble, typingIndicator, messagesArea,
    promptChips, inputArea, conversationItem,
    appendMessage, showTyping, hideTyping, scrollToBottom, autoResize
  };
})();
