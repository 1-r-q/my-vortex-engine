const fs = require('fs');
const path = require('path');

const styles = {
    "CharactersTacticalMap.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-char-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #050505; color: #ffb000; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: sans-serif; }
  .mobile-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ffb000; padding-bottom: 15px; margin-bottom: 20px; }
  .back-btn { background: #333; color: #fff; border: 1px solid #ffb000; padding: 8px 16px; font-weight: bold; }
  .mobile-layer-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
  .m-tab-btn { flex: 1; padding: 10px; background: #111; border: 1px solid #444; color: #888; }
  .m-tab-btn.active { background: #ffb000; color: #000; font-weight: bold; }
  .mobile-char-list { display: flex; flex-direction: column; gap: 15px; }
  .m-char-card { display: flex; gap: 15px; background: #1a1a1a; padding: 15px; border: 1px solid #333; border-radius: 4px; }
  .m-char-img { width: 80px; height: 80px; object-fit: cover; border: 1px solid #555; background: #000; }
  .m-char-info { flex: 1; }
  .m-name { font-size: 1.1rem; font-weight: bold; color: #fff; margin-bottom: 5px; }
  .m-role { font-size: 0.9rem; color: #ffb000; margin-bottom: 5px; }
  .m-desc { font-size: 0.8rem; color: #ccc; line-height: 1.4; }
}
</style>
`,
    "WorldTacticalMap.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-world-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #080808; color: #00d2ff; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: monospace; }
  .mobile-title { font-size: 1.5rem; border-bottom: 2px solid #00d2ff; padding-bottom: 10px; margin-bottom: 20px; color: #fff; }
  .mobile-zone-list { display: flex; flex-direction: column; gap: 20px; }
  .m-zone-card { background: #111; border: 1px solid #333; padding: 15px; border-left: 4px solid #00d2ff; }
  .m-zone-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .m-zone-name { font-size: 1.2rem; font-weight: bold; color: #fff; }
  .m-threat-badge { background: #300; color: #f55; padding: 2px 6px; font-size: 0.8rem; border: 1px solid #500; }
  .m-zone-desc { color: #aaa; font-size: 0.9rem; margin-bottom: 10px; line-height: 1.5; }
  .m-zone-stats { display: flex; gap: 10px; font-size: 0.8rem; color: #555; }
}
</style>
`,
    "HistoryTacticalMap.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-history-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #1a1510; color: #e5c09b; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: serif; }
  .m-history-title { font-size: 1.8rem; text-align: center; margin-bottom: 30px; border-bottom: 1px solid #555; padding-bottom: 15px; color: #fff; }
  .m-timeline { border-left: 2px solid #554030; padding-left: 20px; margin-left: 10px; }
  .m-event-card { margin-bottom: 30px; position: relative; }
  .m-event-card::before { content: ""; position: absolute; left: -26px; top: 5px; width: 10px; height: 10px; background: #e5c09b; border-radius: 50%; box-shadow: 0 0 5px #e5c09b; }
  .m-year { font-size: 1.3rem; font-weight: bold; color: #fff; margin-bottom: 5px; }
  .m-event-title, .m-title { font-size: 1.1rem; color: #ffa050; margin-bottom: 8px; }
  .m-desc { color: #ccc; font-size: 0.95rem; line-height: 1.6; }
}
</style>
`,
    "MarketTacticalMap.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-market-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #0a0f0a; color: #50ff50; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: monospace; }
  .m-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px dashed #353; }
  .m-title { font-size: 1.4rem; color: #afffaf; }
  .m-credits { font-size: 1.1rem; color: #ffd700; }
  .m-category-tabs { display: flex; gap: 5px; overflow-x: auto; padding: 15px 0; }
  .m-tab { padding: 5px 10px; border: 1px solid #353; color: #595; white-space: nowrap; margin-right: 5px; }
  .m-tab.active { background: #131; color: #fff; border-color: #5f5; }
  .m-item-list { display: flex; flex-direction: column; gap: 15px; }
  .m-item { display: flex; justify-content: space-between; align-items: center; background: #0f150f; padding: 10px; border: 1px solid #242; }
  .m-item-details { flex: 1; margin-right: 10px; }
  .m-name { font-weight: bold; color: #fff; display: block; }
  .m-type { font-size: 0.8rem; color: #7a7; }
  .m-price { color: #ffd700; font-weight: bold; }
}
</style>
`,
    "SystemTacticalMap.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-system-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #000; color: #fff; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: sans-serif; }
  .m-sys-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px; }
  .m-sys-title { font-size: 1.6rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
  .m-menu-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
  .m-menu-item { background: #111; padding: 20px; border-left: 5px solid #666; transition: 0.2s; }
  .m-menu-item:active { background: #222; border-left-color: #fff; }
  .m-menu-label { font-size: 1.2rem; font-weight: bold; }
  .m-menu-desc { font-size: 0.9rem; color: #888; margin-top: 5px; }
}
</style>
`,
    "AppScenario.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
.mobile-scenario-view { padding: 80px 20px 20px; color: #ffb000; height: 100vh; overflow-y: auto; background: #000; }
.mobile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ffb000; padding-bottom: 10px; }
.mobile-close-btn { background: #333; color: white; border: 1px solid #ffb000; padding: 5px 15px; }
.mobile-chapter-list {  }
.mobile-chapter-card { border: 1px solid #444; margin-bottom: 10px; background: #111; }
.m-chapter-header { padding: 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.m-status-icon {  }
.m-title { flex: 1; font-weight: bold; }
.m-arrow {  }
.m-chapter-body { padding: 15px; border-top: 1px dashed #444; background: #0a0a0a; }
.m-content {  }
.m-meta-row { display: flex; gap: 15px; font-size: 0.8em; color: #888; margin-bottom: 10px; }
.m-desc { margin-bottom: 10px; line-height: 1.4; }
.m-alert, .m-obj { padding: 8px; background: #220; border-left: 3px solid #ffb000; margin-top: 5px; font-size: 0.9em; }
.m-access-denied { color: red; font-weight: bold; text-align: center; }
.m-hint { text-align: center; font-size: 0.8em; color: #666; margin-top: 5px; }
</style>
`,
    "AppAssets.vue": `
<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .market-grid { grid-template-columns: 1fr; }
  .market-section { margin-bottom: 20px; }
}
</style>
`
};

const baseDir = path.join('e:', 'ai', '완성', 'code zero', 'my-vortex-engine', '.vitepress', 'theme', 'components', 'apps');

Object.entries(styles).forEach(([file, css]) => {
    const filePath = path.join(baseDir, file);
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Skipping ${file} - File not found.`);
            return;
        }
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('Mobile Only Styles')) {
            content += '\n' + css;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`Skipped ${file} (Already updated)`);
        }
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});
