/**
 * sidebar.js — Optional sidebar for modules/tutor pages
 */

const Sidebar = (() => {

  // Module list sidebar
  const moduleList = (modules, activeId = null) => {
    return `
    <aside class="sidebar" role="complementary" aria-label="Module navigation">
      <div class="sidebar-header">
        <h3>📚 Modules</h3>
        <span class="sidebar-count">${modules.filter(m => m.completed).length}/${modules.length}</span>
      </div>
      <nav class="sidebar-nav" aria-label="Learning modules">
        <ul role="list">
          ${modules.map(mod => `
            <li>
              <button class="sidebar-item ${activeId === mod.id ? 'active' : ''} ${mod.completed ? 'completed' : ''}"
                      data-module-id="${mod.id}"
                      aria-current="${activeId === mod.id ? 'true' : 'false'}"
                      aria-label="${mod.title}${mod.completed ? ' — Completed' : ''}">
                <span class="sidebar-icon" aria-hidden="true">${mod.icon}</span>
                <span class="sidebar-label">${Helpers.sanitize(mod.title)}</span>
                ${mod.completed ? '<span class="sidebar-check" aria-hidden="true">✓</span>' : ''}
              </button>
            </li>
          `).join('')}
        </ul>
      </nav>
    </aside>`;
  };

  // Conversation history sidebar for tutor page
  const conversationHistory = (conversations, activeId = null) => {
    return `
    <aside class="sidebar sidebar-conversations" role="complementary" aria-label="Conversation history">
      <div class="sidebar-header">
        <h3>💬 History</h3>
        <button class="btn btn-sm btn-ghost new-chat-btn" id="newChatBtn" aria-label="Start new conversation">+ New</button>
      </div>
      <div class="sidebar-body">
        ${conversations.length === 0
          ? '<p class="sidebar-empty">No saved conversations yet.</p>'
          : conversations.map(conv => ChatComponent.conversationItem(conv, conv.id === activeId)).join('')
        }
      </div>
    </aside>`;
  };

  return { moduleList, conversationHistory };
})();
