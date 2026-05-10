/**
 * tutorPage.js — AI Tutor chat page controller
 */

const TutorPage = (() => {
  let _currentConvId = null;
  let _messages = [];
  let _isLoading = false;

  const render = async (container) => {
    container.innerHTML = `
      <div class="tutor-layout" id="tutorLayout">
        <div class="tutor-sidebar-wrap" id="tutorSidebarWrap"></div>
        <div class="tutor-main">
          <div class="tutor-header">
            <div class="tutor-header-info">
              <div class="tutor-avatar" aria-hidden="true">🧠</div>
              <div>
                <h2>AI Tutor</h2>
                <span class="tutor-status">🟢 Online — Ready to help</span>
              </div>
            </div>
            <div class="tutor-header-actions">
              <button class="btn btn-ghost btn-sm" id="saveChatBtn" title="Save conversation">💾 Save</button>
              <button class="btn btn-ghost btn-sm" id="clearChatBtn" title="Clear chat">🗑️ Clear</button>
            </div>
          </div>

          <div id="tutorChatArea" class="tutor-chat-area">
            ${ChatComponent.messagesArea(_messages)}
          </div>

          <div class="tutor-prompts-wrap" id="tutorPromptsWrap"></div>

          ${ChatComponent.inputArea()}
        </div>
      </div>`;

    await _init(container);
  };

  const _init = async (container) => {
    // Load conversations & prompts
    const conversations = State.getConversations();
    const prompts = await AIService.getSuggestedPrompts();

    // Sidebar
    document.getElementById('tutorSidebarWrap').innerHTML =
      Sidebar.conversationHistory(conversations, _currentConvId);

    // Prompts
    document.getElementById('tutorPromptsWrap').innerHTML =
      ChatComponent.promptChips(prompts.slice(0, 6));

    _bindEvents(container);
  };

  const _bindEvents = (container) => {
    const input = container.querySelector('#chatInput');
    const sendBtn = container.querySelector('#sendBtn');
    const charCount = container.querySelector('#charCount');

    // Input events
    input?.addEventListener('input', () => {
      const len = input.value.length;
      charCount.textContent = `${len}/2000`;
      sendBtn.disabled = len === 0 || _isLoading;
      ChatComponent.autoResize(input);
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendMessage(input); }
    });

    sendBtn?.addEventListener('click', () => _sendMessage(input));

    // Prompt chips
    container.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.prompt;
        input.dispatchEvent(new Event('input'));
        input.focus();
      });
    });

    // Save / clear
    container.querySelector('#saveChatBtn')?.addEventListener('click', _saveConversation);
    container.querySelector('#clearChatBtn')?.addEventListener('click', _clearChat);

    // New chat & history
    container.querySelector('#newChatBtn')?.addEventListener('click', _newChat);
    container.querySelectorAll('.conversation-item').forEach(btn => {
      btn.addEventListener('click', () => _loadConversation(btn.dataset.convId));
    });
  };

  const _sendMessage = async (input) => {
    const validation = Validators.validateChatMessage(input.value);
    if (!validation.valid || _isLoading) return;

    const text = validation.value;
    input.value = '';
    input.style.height = 'auto';
    document.querySelector('#charCount').textContent = '0/2000';
    document.querySelector('#sendBtn').disabled = true;

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    _messages.push(userMsg);
    ChatComponent.appendMessage(userMsg);

    // Hide prompts after first message
    const prompts = document.getElementById('tutorPromptsWrap');
    if (prompts && _messages.length <= 2) prompts.style.display = 'none';

    _isLoading = true;
    ChatComponent.showTyping();

    try {
      const aiText = await AIService.chat(text, _messages.slice(0, -1));
      ChatComponent.hideTyping();
      const aiMsg = { role: 'assistant', content: aiText, timestamp: new Date().toISOString() };
      _messages.push(aiMsg);
      ChatComponent.appendMessage(aiMsg);

      // XP for chatting
      if (_messages.length % 4 === 0) {
        State.addXP(CONFIG.GAMIFICATION.XP_PER_MESSAGE * 4);
        Helpers.showXPGain(CONFIG.GAMIFICATION.XP_PER_MESSAGE * 4);
      }

      // Auto-save
      if (State.get('settings').autoSaveConversations) _saveConversation(true);

    } catch (err) {
      ChatComponent.hideTyping();
      ChatComponent.appendMessage({
        role: 'assistant',
        content: '⚠️ Sorry, I had trouble responding. Please try again!',
        timestamp: new Date().toISOString()
      });
    } finally {
      _isLoading = false;
    }
  };

  const _saveConversation = (silent = false) => {
    if (_messages.length === 0) {
      if (!silent) Helpers.toast('Nothing to save yet!', 'info');
      return;
    }
    const title = _messages[0]?.content?.slice(0, 40) || 'Conversation';
    const convId = _currentConvId || Helpers.uid();
    _currentConvId = convId;
    State.saveConversation({ id: convId, title, messages: _messages, lastUpdated: new Date().toISOString() });
    if (!silent) Helpers.toast('💾 Conversation saved!', 'success');
  };

  const _clearChat = () => {
    Modal.confirm({
      title: 'Clear Chat',
      message: 'Are you sure you want to clear this conversation? This cannot be undone.',
      danger: true,
      onConfirm: () => {
        _messages = [];
        _currentConvId = null;
        document.getElementById('chatMessages').innerHTML = ChatComponent.messagesArea([]).replace(/<div[^>]*>/,'').replace(/<\/div>/,'');
        document.getElementById('chatMessages').innerHTML = '';
        // Re-render empty
        const chatArea = document.getElementById('tutorChatArea');
        if (chatArea) chatArea.querySelector('.chat-messages').innerHTML = '';
        // Show prompts again
        const prompts = document.getElementById('tutorPromptsWrap');
        if (prompts) prompts.style.display = '';
        Helpers.toast('Chat cleared', 'info');
      }
    });
  };

  const _newChat = () => {
    _messages = [];
    _currentConvId = null;
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.innerHTML = '';
    }
    const prompts = document.getElementById('tutorPromptsWrap');
    if (prompts) prompts.style.display = '';
  };

  const _loadConversation = (convId) => {
    const conversations = State.getConversations();
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    _currentConvId = convId;
    _messages = conv.messages || [];
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.innerHTML = _messages.map(ChatComponent.messageBubble).join('');
      ChatComponent.scrollToBottom();
    }
  };

  return { render };
})();
