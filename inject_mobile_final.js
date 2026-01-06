const fs = require('fs');
const path = require('path');

const fileConfigs = [
  {
    name: "CharactersTacticalMap.vue",
    mobileHtml: `
  <div class="mobile-char-view" v-if="isMobile">
    <div class="mobile-header">
      <button @click="goHome" class="back-btn">◀ MENU</button>
      <h2>PERSONNEL DB</h2>
    </div>
    <div class="mobile-char-list">
      <div v-for="char in currentCharacters" :key="char.id" class="m-char-card">
        <div class="m-char-img-container" v-if="char.image">
            <img :src="withBase(char.image)" class="m-char-img" loading="lazy" />
        </div>
        <div class="m-char-info">
          <div class="m-name">{{ char.name }}</div>
          <div class="m-role">{{ char.role }}</div>
          <div class="m-desc">{{ char.desc }}</div>
        </div>
      </div>
    </div>
  </div>`,
    rootClass: "characters-tactical-map"
  },
  {
    name: "WorldTacticalMap.vue",
    mobileHtml: `
  <div class="mobile-world-view" v-if="isMobile">
    <div class="mobile-header">
      <button @click="goHome" class="back-btn">◀ MENU</button>
      <h2>WORLD GEOMAP</h2>
    </div>
    <div class="mobile-zone-list">
      <div v-for="(zone, index) in zones" :key="index" class="m-zone-card">
        <div class="m-zone-header">
          <div class="m-zone-name">{{ zone.name || zone.title }}</div>
          <div class="m-threat-badge" v-if="zone.threatLevel">LV.{{ zone.threatLevel }}</div>
        </div>
        <div class="m-zone-desc">{{ zone.desc || zone.description }}</div>
        <div class="m-zone-stats">
          <span>POP: {{ zone.population || 'UNKNOWN' }}</span>
        </div>
      </div>
    </div>
  </div>`,
    rootClass: "world-tactical-map"
  },
  {
    name: "HistoryTacticalMap.vue",
    mobileHtml: `
  <div class="mobile-history-view" v-if="isMobile">
    <div class="m-history-title">CHRONICLE</div>
    <div class="m-timeline">
      <div v-for="(event, index) in events" :key="index" class="m-event-card">
        <div class="m-year">{{ event.year }}</div>
        <div class="m-event-title">{{ event.title }}</div>
        <div class="m-desc">{{ event.desc || event.description }}</div>
      </div>
    </div>
     <div style="text-align:center; margin-top:30px;">
        <button @click="goHome" class="back-btn">◀ MENU</button>
     </div>
  </div>`,
    rootClass: "history-tactical-map"
  },
  {
    name: "MarketTacticalMap.vue",
    mobileHtml: `
  <div class="mobile-market-view" v-if="isMobile">
    <div class="m-header">
      <button @click="goHome" class="back-btn">◀</button>
      <div class="m-title">BLACK MARKET</div>
      <div class="m-credits">9,999 $</div>
    </div>
    <div class="m-item-list">
       <div class="m-item" v-for="i in 5" :key="i">
          <div class="m-item-details">
            <span class="m-name">UNKNOWN_ITEM_{{i}}</span>
            <span class="m-type">RESOURCE</span>
          </div>
          <span class="m-price">{{ 100 * i }} $</span>
       </div>
    </div>
  </div>`,
    rootClass: "market-tactical-map"
  },
  {
    name: "SystemTacticalMap.vue",
    mobileHtml: `
  <div class="mobile-system-view" v-if="isMobile">
    <div class="m-sys-header">
      <div class="m-sys-title">SYSTEM ROOT</div>
    </div>
    <div class="m-menu-grid">
       <div class="m-menu-item" @click="goHome">
         <div class="m-menu-label">◀ DASHBOARD</div>
         <div class="m-menu-desc">Return to Main Terminal</div>
       </div>
       <div class="m-menu-item">
         <div class="m-menu-label">RNG ENGINE</div>
         <div class="m-menu-desc">Dice Simulation (Desktop Only)</div>
       </div>
    </div>
  </div>`,
    rootClass: "system-tactical-map"
  },
  {
    name: "AppScenario.vue",
    mobileHtml: `
    <!-- Mobile View -->
    <div v-if="isMobile" class="mobile-scenario-view">
      <div class="mobile-header">
        <h2>MISSION LOG</h2>
        <button class="mobile-close-btn" @click="handleClose">EXIT</button>
      </div>
      <div class="mobile-chapter-list">
        <div 
          v-for="(chapter, index) in chapters" 
          :key="index" 
          class="mobile-chapter-card"
          :class="{ 'active': selectedIndex === index, 'locked': !unlockedIndices.includes(index) }"
        >
          <div class="m-chapter-header" @click="selectedIndex = index; playClick()">
            <span class="m-status-icon">{{ unlockedIndices.includes(index) ? '🟢' : '🔒' }}</span>
            <span class="m-title">{{ chapter.title }}</span>
          </div>
          <div class="m-chapter-body" v-if="selectedIndex === index">
            <div class="m-content">
               <div class="m-meta-row"><span>{{ chapter.time }}</span><span>{{ chapter.loc }}</span></div>
               <div class="m-desc">{{ chapter.bg }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    rootClass: "mission-terminal"
  }
];

const baseDir = path.join('e:', 'ai', '완성', 'code zero', 'my-vortex-engine', '.vitepress', 'theme', 'components', 'apps');

fileConfigs.forEach(config => {
    const filePath = path.join(baseDir, config.name);
    try {
        if (!fs.existsSync(filePath)) {
           console.log(`Skipping ${config.name} (Not found)`);
           return;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Check if mobile view class exists
        if (content.includes('class="mobile-')) {
            console.log(`Skipping injection for ${config.name} (Mobile view seems present)`);
            return;
        }

        const templateRegex = /<template>/;
        const match = content.match(templateRegex);
        if (!match) return;

        const injectionIndex = match.index + match[0].length;
        let afterTemplateInfo = content.substring(injectionIndex);
        
        const rootTagRegex = /<(div|main|aside)([^>]*)>/;
        const rootMatch = afterTemplateInfo.match(rootTagRegex);
        if (!rootMatch) return;

        const rootTagStart = injectionIndex + rootMatch.index;
        const rootTagContent = rootMatch[0];
        
        let newContent;
        if (rootTagContent.includes('v-if') || rootTagContent.includes('v-else')) {
             newContent = content.substring(0, injectionIndex) + 
                                config.mobileHtml + 
                                content.substring(injectionIndex);
        } else {
             const newRootTag = rootTagContent.replace(/(\s*>|>$)/, ' v-else$1');
             newContent = content.substring(0, injectionIndex) + 
                                config.mobileHtml + 
                                content.substring(injectionIndex, rootTagStart) +
                                newRootTag + 
                                content.substring(rootTagStart + rootTagContent.length);
        }

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${config.name}`);
    } catch (e) {
        console.error(`Error processing ${config.name}: ${e.message}`);
    }
});
