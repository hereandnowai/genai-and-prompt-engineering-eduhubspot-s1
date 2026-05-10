import progressService from '../services/progressService.js';
import stateManager from '../state.js';

const dashboardPage = {
  render() {
    const stats = progressService.getStats();
    const s = stateManager.getState();
    const completionPercent = Math.round((stats.completedCount / 3) * 100);

    return `
      <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-xl);">
        
        <!-- Left: Activity Feed -->
        <div style="grid-column: span 8; display: flex; flex-direction: column; gap: var(--space-xl);">
          <div class="hero shadow-md animate-fade-in" style="background: linear-gradient(135deg, var(--sidebar-bg), var(--primary));">
            <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 8px;">Welcome back, ${s.user.name}!</h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 24px; max-width: 450px;">You've mastered ${stats.completedCount} AI modules! Ready to expand your neural network today?</p>
            <div style="display: flex; gap: 16px;">
              <a href="#modules" class="btn" style="background: white; color: var(--primary); font-weight: 800; padding: 0.8rem 1.5rem;">Resume Path</a>
              <div style="display: flex; align-items: center; gap: 8px; color: white; font-size: 0.9rem; font-weight: 600;">
                 <i data-lucide="award" style="width: 18px; color: var(--accent-cyan);"></i>
                 <span>Top 5% this week</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                   <h3 style="font-size: 1.1rem; font-weight: 800;">Quick AI Tutor</h3>
                   <span class="badge" style="background: rgba(34, 211, 238, 0.1); color: var(--accent-cyan); font-size: 0.65rem; border: 1px solid rgba(34, 211, 238, 0.2);">ACTIVE</span>
                </div>
                <div style="background: var(--background); border-radius: var(--radius-xl); padding: 1.25rem; margin-bottom: 20px; border: 1px dashed var(--border);">
                  <p style="font-size: 0.85rem; font-style: italic; color: var(--text-light); line-height: 1.6;">"LLMs are statistical mimics... but very, very good ones. Ask me about temperature settings next!"</p>
                </div>
              </div>
              <a href="#tutor" class="btn btn-outline" style="width: 100%; border-radius: var(--radius-xl); font-weight: 700;">
                <span>Start Session</span>
                <i data-lucide="chevron-right" style="width: 16px; margin-left: 8px;"></i>
              </a>
            </div>

            <div class="card" style="background: white; border: 1px solid var(--border);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                <h3 style="font-size: 1.1rem; font-weight: 800;">Leaderboard</h3>
                <i data-lucide="users" style="width: 18px; color: var(--text-light);"></i>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background: var(--background); border-radius: 12px;">
                   <div style="width: 24px; text-align: center; font-weight: 800; font-size: 0.75rem; color: var(--text-light);">1</div>
                   <div style="width: 32px; height: 32px; background: #ddd; border-radius: 50%;"></div>
                   <span style="font-size: 0.85rem; font-weight: 700; flex: 1;">Sarah J.</span>
                   <span style="font-size: 0.75rem; font-weight: 800; color: var(--primary);">2.4k XP</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 12px;">
                   <div style="width: 24px; text-align: center; font-weight: 800; font-size: 0.75rem; color: var(--primary);">12</div>
                   <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;">ME</div>
                   <span style="font-size: 0.85rem; font-weight: 700; flex: 1;">${s.user.name}</span>
                   <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-light);">${stats.xp} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Stats -->
        <div style="grid-column: span 4; display: flex; flex-direction: column; gap: var(--space-xl);">
          <div class="card">
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 24px;">Your Progress</h3>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 10px;">
                  <span style="font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">Foundation Mastery</span>
                  <span style="font-weight: 800; color: var(--primary);">${completionPercent}%</span>
                </div>
                <div style="height: 8px; background: var(--background); border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; width: ${completionPercent}%; background: linear-gradient(90deg, var(--primary), var(--accent-cyan)); border-radius: 4px; transition: width 0.5s ease;"></div>
                </div>
              </div>
            </div>

            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid var(--border);">
               <p style="font-size: 0.7rem; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;">Top Achievements</p>
               <div style="display: flex; gap: 16px;">
                 <div style="width: 50px; height: 50px; border-radius: 12px; background: #fff7ed; color: #f97316; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">🔥</div>
                 <div style="width: 50px; height: 50px; border-radius: 12px; background: #f0fdf4; color: #22c55e; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">✅</div>
                 <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--background); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; opacity: 0.3; filter: grayscale(1);">🔒</div>
               </div>
               <p style="margin-top: 20px; font-size: 0.75rem; color: var(--text-light); font-weight: 500;">Unlock more by finishing the ML course!</p>
            </div>
          </div>

          <div class="card" style="background: var(--purple-light); border: none; box-shadow: none;">
             <h3 style="font-size: 1rem; font-weight: 800; color: var(--purple); margin-bottom: 20px;">Learning Frequency</h3>
             <div style="height: 60px; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 4px; gap: 8px;">
               <div style="flex: 1; border-radius: 4px; background: var(--purple); height: 80%; opacity: 0.2;"></div>
               <div style="flex: 1; border-radius: 4px; background: var(--purple); height: 50%; opacity: 0.2;"></div>
               <div style="flex: 1; border-radius: 4px; background: var(--purple); height: 90%; opacity: 0.2;"></div>
               <div style="flex: 1; border-radius: 4px; background: var(--purple); height: 40%; opacity: 0.3;"></div>
               <div style="flex: 1; border-radius: 4px; background: var(--purple); height: 100%;"></div>
             </div>
             <p style="text-align: center; margin-top: 16px; font-size: 0.7rem; font-weight: 800; color: var(--purple); text-transform: uppercase; letter-spacing: 1px;">+${stats.xp} Total XP Earned</p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) window.lucide.createIcons();
  }
};

export default dashboardPage;
