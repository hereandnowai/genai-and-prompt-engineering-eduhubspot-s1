const SettingsPage = {
    render() {
        const container = document.createElement('div');
        container.className = 'settings-page animate-fade-in';
        container.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h1>Settings</h1>
                <p style="color: var(--text-muted); margin-bottom: 40px;">Customize your learning experience.</p>
                
                <div class="card" style="margin-bottom: 24px;">
                    <h3>Appearance</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                        <div>
                            <p style="font-weight: 500;">Dark Mode</p>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">Switch between light and dark themes</span>
                        </div>
                        <button id="dark-toggle" class="btn btn-outline">${state.settings.darkMode ? 'Enabled' : 'Disabled'}</button>
                    </div>
                </div>

                <div class="card" style="margin-bottom: 24px;">
                    <h3>Accessibility</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                        <div>
                            <p style="font-weight: 500;">Font Size</p>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">Make text easier to read</span>
                        </div>
                        <select id="font-select" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-light);">
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>

                <div class="card" style="border: 1px solid #fee2e2;">
                    <h3 style="color: #ef4444;">Danger Zone</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;">Resetting progress cannot be undone.</p>
                    <button id="reset-btn" class="btn btn-outline" style="margin-top: 15px; border-color: #ef4444; color: #ef4444;">Reset All Progress</button>
                </div>
            </div>
        `;

        this.initEvents(container);
        return container;
    },

    initEvents(container) {
        const darkBtn = container.querySelector('#dark-toggle');
        darkBtn.onclick = () => {
            state.settings.darkMode = !state.settings.darkMode;
            document.body.classList.toggle('dark-mode');
            darkBtn.innerText = state.settings.darkMode ? 'Enabled' : 'Disabled';
            state.update({ settings: state.settings });
        };

        container.querySelector('#reset-btn').onclick = () => {
            if (confirm('Are you sure you want to delete all progress? This action is permanent.')) {
                localStorage.clear();
                window.location.reload();
            }
        };
    }
};
