import stateManager from '../state.js';
import storageService from '../services/storageService.js';
import CONFIG from '../config.js';

const settingsPage = {
  render() {
    const s = stateManager.getState();
    return `
      <div style="max-width: 800px;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 40px;">Settings</h1>
        
        <div class="card" style="margin-bottom: 40px;">
           <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--border);">
              <div>
                <h4 style="font-size: 1.1rem;">Dark Mode</h4>
                <p style="color: var(--text-light); font-size: 0.85rem;">Toggle dark/light theme interface (Coming Soon)</p>
              </div>
              <input type="checkbox" ${s.settings.darkMode ? 'checked' : ''} disabled>
           </div>
           
           <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--border);">
              <div>
                <h4 style="font-size: 1.1rem;">User Profile</h4>
                <p style="color: var(--text-light); font-size: 0.85rem;">Change your display name</p>
              </div>
              <input type="text" id="username-input" class="input-field" value="${s.user.name}" style="width: 150px;">
           </div>

           <div style="padding: 20px 0;">
              <h4 style="font-size: 1.1rem; color: var(--error);">Danger Zone</h4>
              <p style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 15px;">Reset all your learning progress and data.</p>
              <button id="reset-data" class="btn btn-outline" style="border-color: var(--error); color: var(--error);">Reset Progress</button>
           </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
           <button id="save-settings" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    `;
  },
  init() {
    const saveBtn = document.getElementById('save-settings');
    const resetBtn = document.getElementById('reset-data');
    const nameInput = document.getElementById('username-input');

    saveBtn.addEventListener('click', () => {
      const state = stateManager.getState();
      stateManager.setState({
        user: { ...state.user, name: nameInput.value }
      });
      alert('Settings saved!');
    });

    resetBtn.addEventListener('click', () => {
      if (confirm('Are you absolute sure? This will delete all your XP and progress.')) {
        stateManager.resetState();
        storageService.clearAll();
        alert('Data cleared. Page will refresh.');
        window.location.hash = 'home';
        window.location.reload();
      }
    });
  }
};

export default settingsPage;
