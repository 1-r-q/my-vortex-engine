<template>
  <div class="mobile-system-view" v-if="isMobile">
    <div class="mobile-header">
      <button @click="goHome" class="back-btn">← MENU</button>
      <h2>SYSTEM RULES</h2>
    </div>
    
    <div class="system-menu-mobile">
      <div 
        v-for="item in menuItems" 
        :key="item.id" 
        class="menu-card-mobile"
        @click="navigateTo(item.link)"
      >
        <div class="menu-title-mobile">{{ item.title }}</div>
        <div class="menu-desc-mobile">{{ item.desc }}</div>
      </div>
    </div>
  </div>

  <div 
    v-else
    class="system-tactical-map" 
    :class="{ 'is-exiting': isExiting, 'is-switching': isSwitching, 'from-home': fromHome, 'is-booting': isBooting, 'boot-completed': bootCompleted, 'boot-phase-1': bootPhase === 1, 'boot-phase-2': bootPhase === 2, 'boot-phase-3': bootPhase === 3, 'boot-phase-4': bootPhase === 4, 'fx-success': screenFxType === 'critical-success', 'fx-fail': screenFxType === 'critical-fail', 'fx-jam': screenFxType === 'fail', 'critical-success': consoleState === 'critical-success', 'critical-failure': consoleState === 'critical-failure', 'failure': consoleState === 'failure' }" 
    ref="mapContainer"
  >

    
    <!-- Boot Overlay (Phase 1: BIOS Terminal) -->
    <div v-if="bootPhase <= 1" class="boot-overlay">
      <div class="boot-terminal">
        <div class="boot-line" v-for="(line, idx) in bootLines" :key="idx" :class="{ 'typing': idx === bootLines.length - 1 && isBootTyping }">
          <span class="boot-prompt">&gt;</span>
          <span class="boot-text">{{ line.text }}</span>
          <span v-if="line.status" class="boot-status" :class="line.status">{{ line.status === 'ok' ? '[OK]' : line.status === 'loading' ? '[...]' : '[DONE]' }}</span>
        </div>
        <div v-if="isBootTyping" class="boot-cursor">_</div>
      </div>
    </div>
    
    <!-- Global Screen FX Overlay -->
    <div 
      v-if="screenFxActive" 
      class="screen-fx-overlay" 
      :class="screenFxType"
    >
      <div class="fx-flash"></div>
      <div class="fx-noise" v-if="screenFxType === 'critical-fail'"></div>
    </div>
    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars (Top) -->
    <div class="cinema-bar cinema-bar-top">
      <div class="ticker-wrap">
        <div class="ticker">
          <span>◆ VORTEX SYSTEM MANUAL v1.0.0 ◆ PROTOCOL: ACTIVE ◆ RULESET: VERIFIED ◆ CLEARANCE: LEVEL-3 ◆ SYNC: COMPLETE ◆ AUTHORIZATION: GRANTED ◆</span>
          <span>◆ VORTEX SYSTEM MANUAL v1.0.0 ◆ PROTOCOL: ACTIVE ◆ RULESET: VERIFIED ◆ CLEARANCE: LEVEL-3 ◆ SYNC: COMPLETE ◆ AUTHORIZATION: GRANTED ◆</span>
        </div>
      </div>
    </div>
    
    <!-- Cinematic Letterbox Bars (Bottom) -->
    <div class="cinema-bar cinema-bar-bottom">
      <div class="ticker-wrap">
        <div class="ticker ticker-reverse">
          <span>▶ CORE RULES ▶ CHARACTER CREATION ▶ COMBAT SYSTEM ▶ SKILL CHECKS ▶ ADVANCEMENT ▶ EQUIPMENT ▶ STATUS: ONLINE ▶</span>
          <span>▶ CORE RULES ▶ CHARACTER CREATION ▶ COMBAT SYSTEM ▶ SKILL CHECKS ▶ ADVANCEMENT ▶ EQUIPMENT ▶ STATUS: ONLINE ▶</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="scan-line"></div>
    
    <!-- Tactical Map Background Layer -->
    <div class="tactical-bg">
      <div class="sector-labels">
        <span class="sector-label" style="top: 12%; left: 8%;">CORE-RULES</span>
        <span class="sector-label" style="top: 15%; right: 12%;">PROTOCOL-A</span>
        <span class="sector-label" style="bottom: 18%; left: 6%;">VERIFIED</span>
        <span class="sector-label" style="bottom: 12%; right: 8%;">SYS-DATA</span>
      </div>
    </div>
    
    <!-- HUD Scope Frame -->
    <div class="scope-frame">
      <div class="scope-corner scope-tl">⌜</div>
      <div class="scope-corner scope-tr">⌝</div>
      <div class="scope-corner scope-bl">⌞</div>
      <div class="scope-corner scope-br">⌟</div>
    </div>
    
    <!-- CRT Overlay Effects -->
    <div class="crt-overlay"></div>
    <div class="vignette-overlay"></div>

    <!-- Main Content Area (Bento Grid) -->
    <div class="main-content">
      <div class="bento-grid">
        
        <!-- 1. Top-Left: Core Protocols (Code Editor) -->
        <div class="grid-panel panel-protocols">
          <div class="panel-header">
            <span class="panel-icon">⚡</span>
            <span class="panel-title">α_Navi_프로토콜.sys</span>
          </div>
          <div class="code-editor">
            <!-- System Activity Bar -->
            <div class="activity-bar">
              <div class="activity-meter" :style="{ height: activityLevel + '%', opacity: 0.3 + (activityLevel / 150) }"></div>
              <div class="activity-pulse" :class="{ 'active': isTyping }"></div>
              <span class="activity-label">LOAD</span>
            </div>
            <div class="line-numbers">
              <span>01</span><span>02</span><span>03</span>
            </div>
            <div class="code-content">
              <div class="code-line"><span class="kwd">const</span> <span class="var">시스템_규칙</span> = { ... };</div>
              
              <!-- Live Terminal Effect - Newest on top -->
              <div class="terminal-scroll">
                <div class="code-line terminal-line">
                  <span class="terminal-prompt">&gt;</span>
                  <span class="terminal-text">{{ terminalDisplayText }}</span>
                  <span class="terminal-cursor">_</span>
                </div>
                <div class="code-line terminal-line" v-for="(log, idx) in [...combatLogs].reverse().slice(0, 6)" :key="idx">
                  <span class="terminal-prompt">&gt;</span>
                  <span class="terminal-text" :class="log.type">{{ log.text }}</span>
                </div>
              </div>
            </div>
            
            <!-- Navi Comm Link -->
            <div class="navi-comm-link">
              <div class="comm-header">
                <span class="comm-icon">📡</span>
                <span class="comm-title">COMM_LINK</span>
              </div>
              <div class="comm-message">
                <span class="comm-speaker">α-Navi:</span>
                <div class="comm-text-container">
                  <span class="comm-text">{{ naviDialogue }}</span>
                  <span class="comm-cursor" v-if="isNaviTyping">_</span>
                </div>
              </div>
              <!-- 판정 결과 효과 표시 -->
              <div class="comm-outcome" v-if="diceOutcome" :class="diceOutcome.toLowerCase()">
                <span class="outcome-label">▶ 효과:</span>
                <span class="outcome-desc">{{ outcomeDescription }}</span>
              </div>
              <div class="comm-status">
                <span class="status-indicator" :class="naviMood"></span>
                <span class="status-label">{{ naviMoodLabel }}</span>
              </div>
            </div>
          </div>
          <div class="panel-corners">
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
          </div>
          <!-- Industrial Decals -->
          <div class="panel-decals">
            <span class="decal decal-tl">SYS_OP_MODE</span>
            <span class="decal decal-tr">V.19.0.4</span>
            <span class="decal decal-bl">[CORE_ACTIVE]</span>
            <span class="decal decal-br">MEM_0x4F2A</span>
          </div>
          <!-- Tactical Grid Overlay -->
          <div class="tactical-grid-overlay"></div>
        </div>

        <!-- 2. Top-Right: RNG Engine (Dice Simulator) -->
        <div class="grid-panel panel-rng">
          <div class="panel-header">
            <span class="panel-icon">🎲</span>
            <span class="panel-title">판정_엔진</span>
          </div>
          <div class="rng-display rng-split">
            
            <!-- LEFT: Display Zone (1.2 ratio) - Dark viewing area -->
            <div class="rng-display-zone">
              <!-- Decorative Corner Elements -->
              <div class="rng-corner corner-tl">
                <span class="corner-crosshair">┼</span>
                <span class="corner-label">TARGET_LOCK</span>
              </div>
              <div class="rng-corner corner-tr">
                <div class="signal-gauge">
                  <span class="gauge-bar"></span>
                  <span class="gauge-bar"></span>
                  <span class="gauge-bar"></span>
                </div>
              </div>
              <div class="rng-corner corner-bl">
                <span class="coord-data">X: 402, Y: 89</span>
              </div>
              <div class="rng-corner corner-br">
                <div class="hazard-stripe"></div>
              </div>
              
              <!-- Status Label (Above number) -->
              <div class="result-status-top">
                <span v-if="!diceOutcome" class="status-label waiting">STANDBY</span>
                <span v-else-if="diceOutcome === 'JACKPOT' || diceOutcome === 'FUMBLE'" class="status-label" :class="diceOutcome.toLowerCase()">{{ diceOutcome === 'JACKPOT' ? '대성공' : '대실패' }}</span>
                <span v-else class="status-label" :class="diceOutcome.toLowerCase()">{{ diceOutcome === 'PERFECT' ? '성공' : diceOutcome === 'STRAIN' ? '부분성공' : '실패' }}</span>
              </div>
              
              <!-- Core Number Display -->
              <div class="core-display" :class="{ 'rolling': isRolling, 'overclock-active': overclockEnabled }">
                <!-- Dual Rotating Rings -->
                <svg class="dual-ring outer-ring" :class="{ 'fast': isRolling }" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="75" class="ring-track" />
                  <circle cx="80" cy="80" r="75" class="ring-arc" />
                </svg>
                <svg class="dual-ring inner-ring" :class="{ 'fast': isRolling }" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="62" class="ring-track" />
                  <circle cx="80" cy="80" r="62" class="ring-arc-alt" />
                </svg>
                <div class="display-value" :class="outcomeClass">
                  {{ displayValue }}
                </div>
              </div>
              
              <!-- Special Status (Below number) -->
              <div class="result-status-bottom">
                <span v-if="diceOutcome === 'JACKPOT'" class="special-status jackpot">★ JACKPOT ★</span>
                <span v-else-if="diceOutcome === 'FUMBLE'" class="special-status fumble">⚠ FUMBLE ⚠</span>
                <span v-else-if="lastCalcString" class="calc-formula">{{ lastCalcString }}</span>
                <span v-else class="desc-text">점화 버튼을 눌러 판정</span>
              </div>
            </div>
            
            <!-- RIGHT: Control Deck (1 ratio) - Gray control panel -->
            <div class="rng-control-deck">
              <div class="control-deck-header">CONTROL</div>
              
              <!-- Stat Gap Slider (Horizontal) -->
              <div class="control-block">
                <div class="control-block-label">
                  <span>스탯 격차</span>
                  <span class="control-block-value" :class="{ 'positive': statGap > 0, 'negative': statGap < 0 }">
                    {{ statGap > 0 ? '+' : '' }}{{ statGap }}
                  </span>
                </div>
                <input type="range" class="stat-slider-h" v-model.number="statGap" min="-50" max="50" />
              </div>
              
              <!-- Toggle Buttons Row -->
              <div class="toggle-buttons-row">
                <button 
                  class="toggle-btn" 
                  :class="{ 'active': tacticsEnabled }" 
                  @click="tacticsEnabled = !tacticsEnabled"
                >
                  <span class="toggle-icon">🎯</span>
                  <span class="toggle-text">전술</span>
                  <span class="toggle-bonus">+20</span>
                </button>
                <button 
                  class="toggle-btn overclock-btn" 
                  :class="{ 'active': overclockEnabled }" 
                  @click="overclockEnabled = !overclockEnabled"
                >
                  <span class="toggle-icon">⚡</span>
                  <span class="toggle-text">오버클럭</span>
                  <span class="toggle-bonus">+30</span>
                </button>
              </div>
              
              <!-- Ignition Button (Full Width) -->
              <button class="ignition-btn-full" @click="rollAdvancedDice" :disabled="isRolling">
                <div class="ignition-bg"></div>
                <span class="ignition-label">{{ isRolling ? '연산중...' : '▶ 점 화' }}</span>
              </button>
              
              <!-- Ready Indicator -->
              <div class="ready-indicator" :class="{ 'processing': isRolling }">
                <span class="ready-dot"></span>
                <span>{{ isRolling ? 'PROCESSING' : 'READY' }}</span>
              </div>
            </div>
          </div>
          <div class="panel-corners">
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
          </div>
          <div class="panel-decals">
            <span class="decal decal-tl">JUDGE_ENGINE</span>
            <span class="decal decal-tr">[CALC]</span>
            <span class="decal decal-bl">FORMULA_V2</span>
            <span class="decal decal-br">SYNC_OK</span>
          </div>
          <div class="tactical-grid-overlay"></div>
        </div>

        <!-- 3. Bottom-Left: Combat Flow (Live Diagram) -->
        <div class="grid-panel panel-combat">
          <div class="panel-header">
            <span class="panel-icon">⚔️</span>
            <span class="panel-title">전투_시뮬레이터</span>
          </div>
          <div class="flow-chart">
            <!-- Floating Status Top -->
            <div class="combat-floating-status top-status">
              <span class="blink-status">SCANNING...</span>
            </div>
            <!-- Floating Status Bottom -->
            <div class="combat-floating-status bottom-status">
              <span>LATENCY: 4ms</span>
            </div>
            <!-- Vertical Guide Lines -->
            <div class="vertical-guides">
              <div class="guide-line"></div>
              <div class="guide-line"></div>
              <div class="guide-line"></div>
              <div class="guide-line"></div>
            </div>
            <!-- Signal Oscilloscope -->
            <div class="oscilloscope">
              <div class="scope-screen">
                <svg class="waveform-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#00ff00;stop-opacity:0.2" />
                      <stop offset="50%" style="stop-color:#00ff00;stop-opacity:0.8" />
                      <stop offset="100%" :style="`stop-color:${selectedStatColor};stop-opacity:1`" />
                    </linearGradient>
                  </defs>
                  <path class="wave-line" :d="oscilloscopePath" />
                  <circle class="wave-dot" :cx="waveDotX" cy="30" r="2" :style="{ fill: selectedStatColor }" />
                </svg>
                <div class="scope-grid"></div>
                <div class="scope-label">SIG</div>
              </div>
              <div class="data-cable" :style="{ '--cable-color': selectedStatColor }">
                <div class="cable-outer"><div class="cable-inner"></div><div class="cable-pulse"></div></div>
                <div class="cable-connector-end"></div>
              </div>
            </div>
            
            <div class="data-pipe" :style="{ '--pipe-color': selectedStatColor }">
              <div class="pipe-flow"></div>
            </div>
            
            <!-- Step 1: 조우 -->
            <div class="flow-step step-1" :class="{ 'active': combatStep === 1 }" @click="setCombatStep(1)">
              <div class="chip-node clickable">
                <div class="chip-pins pins-left"><span></span><span></span><span></span></div>
                <div class="chip-body">
                  <div class="chip-circuit"></div>
                  <span class="chip-label">조우</span>
                  <span class="chip-sub">ENCOUNTER</span>
                </div>
                <div class="chip-pins pins-right"><span></span><span></span><span></span></div>
              </div>
              <span class="step-number">STEP_01</span>
            </div>
            
            <div class="flow-connector" :style="{ '--conn-color': combatStep >= 2 ? selectedStatColor : '' }">
              <div class="connector-line"></div>
              <div class="connector-pulse"></div>
            </div>
            
            <!-- Step 2: 선언 (행동 선택) -->
            <div class="flow-step step-2" :class="{ 'active': combatStep === 2, 'expanded': combatStep === 2 }" @click="setCombatStep(2)">
              <!-- Action Selection Buttons (Above Chip) -->
              <div class="action-buttons-fixed" v-if="combatStep === 2">
                <button 
                  v-for="stat in actionStats" 
                  :key="stat.id"
                  class="action-btn"
                  :class="{ 'selected': selectedStat?.id === stat.id }"
                  :style="{ '--stat-color': stat.color }"
                  @click.stop="selectStat(stat)"
                >
                  <span class="action-icon">{{ stat.icon }}</span>
                  <span class="action-name">{{ stat.name }}</span>
                </button>
              </div>
              <div class="chip-node clickable">
                <div class="chip-pins pins-left"><span></span><span></span><span></span></div>
                <div class="chip-body" :style="{ borderColor: selectedStatColor }">
                  <div class="chip-circuit"></div>
                  <span class="chip-label">선언</span>
                  <span class="chip-sub">{{ selectedStat ? selectedStat.name : 'SELECT' }}</span>
                </div>
                <div class="chip-pins pins-right"><span></span><span></span><span></span></div>
              </div>
              <span class="step-number">STEP_02</span>
            </div>
            
            <div class="flow-connector" :style="{ '--conn-color': combatStep >= 3 ? selectedStatColor : '' }">
              <div class="connector-line"></div>
              <div class="connector-pulse"></div>
            </div>
            
            <!-- Step 3: 판정 -->
            <div class="flow-step step-3" :class="{ 'active': combatStep === 3 }" @click="setCombatStep(3)">
              <div class="chip-node clickable">
                <div class="chip-pins pins-left"><span></span><span></span><span></span></div>
                <div class="chip-body">
                  <div class="chip-circuit"></div>
                  <span class="chip-label">판정</span>
                  <span class="chip-sub">JUDGE</span>
                </div>
                <div class="chip-pins pins-right"><span></span><span></span><span></span></div>
              </div>
              <span class="step-number">STEP_03</span>
            </div>
            
            <div class="flow-connector" :style="{ '--conn-color': combatStep >= 4 ? selectedStatColor : '' }">
              <div class="connector-line"></div>
              <div class="connector-pulse"></div>
            </div>
            
            <!-- Step 4: 결과 -->
            <div class="flow-step step-4" :class="{ 'active': combatStep === 4, 'result-shown': diceOutcome }" @click="setCombatStep(4)">
              <div class="chip-node clickable">
                <div class="chip-pins pins-left"><span></span><span></span><span></span></div>
                <div class="chip-body" :class="diceOutcome ? diceOutcome.toLowerCase() : ''">
                  <div class="chip-circuit"></div>
                  <span class="chip-label">{{ diceOutcome || '결과' }}</span>
                  <span class="chip-sub">RESULT</span>
                </div>
                <div class="chip-pins pins-right"><span></span><span></span><span></span></div>
              </div>
              <span class="step-number">STEP_04</span>
            </div>
          </div>
          
          <!-- Combat Info Description Line (Fixed Position) -->
          <div class="combat-info-fixed">
            <span class="info-text">{{ combatInfoText }}</span>
          </div>
          
          <div class="panel-corners">
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
          </div>
          <div class="panel-decals">
            <span class="decal decal-tl">COMBAT_SIM</span>
            <span class="decal decal-tr">INTERACTIVE</span>
            <span class="decal decal-bl">STEP: {{ combatStep }}/4</span>
            <span class="decal decal-br">{{ selectedStat ? selectedStat.id.toUpperCase() : 'NONE' }}</span>
          </div>
          <div class="tactical-grid-overlay"></div>
        </div>

        <!-- 4. Bottom-Right: Spec Monitor (Live Gauges) -->
        <div class="grid-panel panel-specs">
          <div class="panel-header">
            <span class="panel-icon">📊</span>
            <span class="panel-title">능력치</span>
          </div>
          <!-- Grid Background -->
          <div class="specs-grid-bg"></div>
          <div class="specs-container">
            <div class="spec-row" v-for="(spec, key) in specs" :key="key">
              <div class="spec-label">
                <div class="spec-title">
                  <span class="spec-icon">{{ spec.icon }}</span>
                  <span class="spec-name">{{ spec.name }}</span>
                </div>
                <span class="spec-desc">{{ spec.desc }}</span>
              </div>
              <div class="spec-bar-segmented">
                <div 
                  v-for="seg in 20" 
                  :key="seg" 
                  class="segment"
                  :class="{ 
                    'active': (seg / 20 * 100) <= spec.value,
                    'critical': spec.value > 80 && (seg / 20 * 100) <= spec.value 
                  }"
                  :style="{ '--seg-color': spec.color }"
                ></div>
              </div>
              <div class="spec-digital-value" :style="{ color: spec.color }">
                {{ Math.round(spec.value).toString().padStart(3, '0') }}
              </div>
            </div>
          </div>
          <div class="panel-corners">
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
          </div>
          <!-- Industrial Decals -->
          <div class="panel-decals">
            <span class="decal decal-tl">SPEC_MON</span>
            <span class="decal decal-tr">LIVE</span>
            <span class="decal decal-bl">GAUGE_4CH</span>
            <span class="decal decal-br">REFRESH_100ms</span>
          </div>
          <div class="tactical-grid-overlay"></div>
        </div>

      </div>
    </div>

    <!-- Right Vertical Info Rail -->
    <div class="info-rail">
      <button class="rail-exit-btn" @click="handleClose" :disabled="isExiting">
        <span class="exit-slot">
          <span class="exit-icon">⏏</span>
          <span class="exit-glow"></span>
        </span>
        <span class="exit-label">복귀</span>
        <span class="exit-sublabel">EJECT</span>
      </button>
      
      <div class="rail-monitor">
        <div class="monitor-header">
          <span class="monitor-logo">◈</span>
          <span class="monitor-title">MON</span>
        </div>
        <div class="rail-gauge">
          <div class="gauge-track">
            <div class="gauge-fill-vertical gauge-animated"></div>
          </div>
          <span class="gauge-percent gauge-glow">{{ Math.round(animatedPercent) }}%</span>
        </div>
        <div class="rail-status-blocks">
          <div class="status-block">
            <span class="block-icon">▣</span>
            <span class="block-value">ACTIVE</span>
            <span class="block-label">상태</span>
          </div>
          <div class="block-divider"></div>
          <div class="status-block">
            <span class="block-icon">⏱</span>
            <span class="block-value">{{ currentTime.split(':').slice(0,2).join(':') }}</span>
            <span class="block-label">시각</span>
          </div>
          <div class="block-divider"></div>
          <div class="status-block">
            <span class="block-icon">⚡</span>
            <span class="block-value glow-green">98.7%</span>
            <span class="block-label">전력</span>
          </div>
        </div>
      </div>
      
      <div class="rail-footer">
        <div class="rail-led led-green"></div>
        <span class="rail-id">v1.0</span>
      </div>
    </div>

    <!-- Left Vertical Command Rail -->
    <nav class="command-rail">
      <div class="rail-header">
        <span class="rail-logo">⚙</span>
        <span class="rail-title">CMD</span>
      </div>
      <div class="rail-buttons">
        <button class="rail-btn" @click="switchModule(withBase('/guide/history.html'))">
          <div class="btn-slot"><span class="btn-icon">📜</span><span class="btn-glow"></span></div>
          <span class="btn-label">역사</span><span class="btn-sublabel">HISTORY</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/world/map.html'))">
          <div class="btn-slot"><span class="btn-icon">🌍</span><span class="btn-glow"></span></div>
          <span class="btn-label">세계</span><span class="btn-sublabel">WORLD</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/characters/index.html'))">
          <div class="btn-slot"><span class="btn-icon">👤</span><span class="btn-glow"></span></div>
          <span class="btn-label">인물</span><span class="btn-sublabel">CHARS</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/assets/list.html'))">
          <div class="btn-slot"><span class="btn-icon">📦</span><span class="btn-glow"></span></div>
          <span class="btn-label">상점</span><span class="btn-sublabel">ASSETS</span>
        </button>
        <button class="rail-btn active">
          <div class="btn-slot"><span class="btn-icon">⚖️</span><span class="btn-glow"></span></div>
          <span class="btn-label">규칙</span><span class="btn-sublabel">RULES</span>
        </button>

        <!-- Volume Control -->
        <div class="rail-volume-control">
          <span class="volume-label">BGM VOL</span>
          <div class="volume-slider-container">
            <div class="rail-slider-fill" :style="{ width: (ambientVolume * 100) + '%' }"></div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              v-model="ambientVolume"
              class="rail-slider"
            />
          </div>
        </div>
      </div>
      <div class="rail-footer">
        <div class="rail-indicator"></div>
        <span class="rail-version">v1.0</span>
      </div>
    </nav>

    <!-- Connection Info -->
    <div class="connection-info">
      <span class="conn-status">● CONNECTED</span>
      <span class="conn-node">ARCHIVE NODE: CENTRAL-07</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, withBase } from 'vitepress';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';

const emit = defineEmits(['close', 'openHistory', 'openWorld', 'openMarket', 'openCharacters']);
const router = useRouter();
const { startTransition } = usePageTransition();
const { 
  playHover, playClick, playClickHeavy, playToggleOn, playToggleOff,
  playGearEngage, playLeverPull, playTransition, playBack, playBeep, playBeepConfirm, playBeepAlert,
  playBootStart, playBootLine, playBootComplete, playTyping,
  playDiceRoll, playDiceStop, playCriticalSuccess, playCriticalFail,
  playDataTransmit, playCardSelect, playSelect, playScan,
  categoryVolumes, setCategoryVolume
} = useSteamSound();

// Mobile Detection
const isMobile = ref(false);
const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768;
  }
};

const goHome = () => {
  playBack();
  router.go(withBase('/'));
};

const menuItems = [
  { id: 'core', title: '핵심 규칙 (CORE)', desc: '다이스 시스템 및 기본 판정', link: '/threats/database.html#core' },
  { id: 'combat', title: '전투 (COMBAT)', desc: '공격, 방어, 데미지 산출', link: '/threats/database.html#combat' },
  { id: 'chars', title: '캐릭터 (CHARS)', desc: '능력치, 스킬, 특성', link: '/threats/database.html#chars' },
  { id: 'equip', title: '장비 (EQUIP)', desc: '무기, 방어구, 아이템', link: '/threats/database.html#equip' }
];

const navigateTo = (path) => {
  router.go(withBase(path));
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  checkNavigationSource();
  playTransition();
});

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

const mapContainer = ref(null);
const currentTime = ref('00:00:00');
const animatedPercent = ref(75);
const isExiting = ref(false);
const isSwitching = ref(false);
const fromHome = ref(false);
const hoveredRule = ref(null);

// Check if navigation is from home or another TacticalMap
const checkNavigationSource = () => {
  if (typeof window !== 'undefined') {
    const lastPage = sessionStorage.getItem('vortex-last-page');
    fromHome.value = !lastPage || lastPage === 'home' || lastPage === 'index';
    sessionStorage.setItem('vortex-last-page', 'tacticalmap');
  }
};

// ═══ Boot Sequence State ═══
const isBooting = ref(true);
const bootCompleted = ref(false);
const bootPhase = ref(0);
const bootLines = ref([]);
const isBootTyping = ref(false);
const isQuickBoot = ref(false); // For revisit - panels only

const bootMessages = [
  { text: 'INITIALIZING VORTEX KERNEL...', status: 'ok', delay: 150 },
  { text: 'LOADING SYSTEM MODULES...', status: 'ok', delay: 120 },
  { text: 'CHECKING MEMORY... 64MB DETECTED', status: 'ok', delay: 100 },
  { text: 'VERIFYING PROTOCOL INTEGRITY...', status: 'ok', delay: 80 },
  { text: 'ESTABLISHING NEURAL LINK...', status: 'ok', delay: 100 },
  { text: 'BOOT SEQUENCE COMPLETE', status: 'done', delay: 50 }
];

// Check if this is the first visit (full boot) or revisit (quick boot)
const checkBootStatus = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('vortex-system-booted') === 'true';
  }
  return false;
};

const markAsBooted = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-system-booted', 'true');
  }
};

const runBootSequence = async () => {
  // Check if already booted this session
  const alreadyBooted = checkBootStatus();
  
  if (alreadyBooted) {
    // Quick boot: Just show panels sequentially
    isQuickBoot.value = true;
    isBooting.value = true;
    bootPhase.value = 3; // Skip to Phase 3
    
    await new Promise(r => setTimeout(r, 500)); // Panel animation time
    
    bootPhase.value = 4;
    await new Promise(r => setTimeout(r, 300));
    
    bootCompleted.value = true;
    isBooting.value = false;
    return;
  }
  
  // Full boot sequence (first visit only)
  isBooting.value = true;
  bootPhase.value = 1;
  bootLines.value = [];
  playBootStart();
  
  // Phase 1: BIOS Terminal (0.0s ~ 1.0s)
  for (const msg of bootMessages) {
    isBootTyping.value = true;
    playBootLine();
    let currentText = '';
    for (const char of msg.text) {
      currentText += char;
      bootLines.value = [...bootLines.value.slice(0, -1), { text: currentText, status: null }];
      if (bootLines.value.length === 0 || bootLines.value[bootLines.value.length - 1]?.text !== currentText) {
        bootLines.value.push({ text: currentText, status: null });
      } else {
        bootLines.value[bootLines.value.length - 1] = { text: currentText, status: null };
      }
      await new Promise(r => setTimeout(r, msg.delay / msg.text.length * 3));
    }
    bootLines.value[bootLines.value.length - 1] = { text: msg.text, status: msg.status };
    isBootTyping.value = false;
    await new Promise(r => setTimeout(r, 100));
  }
  
  await new Promise(r => setTimeout(r, 200));
  
  // Phase 2: Frame Construction (1.0s ~ 1.5s)
  bootPhase.value = 2;
  playGearEngage();
  await new Promise(r => setTimeout(r, 500));
  
  // Phase 3: Modules Online (1.5s ~ 2.0s)
  bootPhase.value = 3;
  playBeepConfirm();
  await new Promise(r => setTimeout(r, 600));
  
  // Phase 4: Data Stream (2.0s ~)
  bootPhase.value = 4;
  await new Promise(r => setTimeout(r, 300));
  
  // Mark as booted for this session
  markAsBooted();
  bootCompleted.value = true;
  playBootComplete();
  isBooting.value = false;
};

// ═══ Combat Simulation State ═══
const combatStep = ref(1);
const selectedStat = ref(null);
const hoverStat = ref(null);
const statGap = ref(0);
const tacticsEnabled = ref(false);
const overclockEnabled = ref(false);
const lastCalcString = ref('');
const combatLogs = ref([]);

// ═══ Combat Info Text (Description Line) ═══
const combatInfoText = ref('>> AWAITING INPUT...');
const combatInfoTexts = {
  1: '⚠️ [SCAN] 적대 개체 식별. 등급 분석 및 승률 시뮬레이션.',
  2: '⚡ [TACTIC] 행동 선언. 적의 약점에 맞춰 [압력/정밀/증기] 선택.',
  3: '🎲 [CALC] 판정 수행. 1d100 + 보정치(Gap/Tactics) 연산.',
  4: '💥 [IMPACT] 결과 도출. 피해량 적용 및 전리품 획득.'
};

// ═══ Global Console State (for critical FX) ═══
const consoleState = ref(null);

// ═══ Global Screen FX ═══
const screenFxActive = ref(false);
const screenFxType = ref('');

// ═══ α-Navi Comm Link ═══
const naviDialogue = ref('대기 중... 시스템 정상.');
const isNaviTyping = ref(false);
const naviMood = ref('neutral');
const naviMoodLabel = computed(() => {
  const moods = {
    'pleased': '만족',
    'neutral': '중립',
    'annoyed': '불쾌',
    'critical': '경고'
  };
  return moods[naviMood.value] || '분석중';
});

const naviResponses = {
  'JACKPOT': [
    '확률 0.03% 돌파. 훌륭하군, 오퍼레이터.',
    '이게 너의 \'변수\'인가? 기록해두지.',
    '예외적 결과. 내 연산을 초월했군.'
  ],
  'PERFECT': [
    '깔끔한 연산이다.',
    '예상 범위 내의 승리.',
    '효율적인 결과야. 이대로 유지해.'
  ],
  'STRAIN': [
    '이겨도 손해가 크군.',
    '효율이 떨어지는 전투다.',
    '승리했지만... 최적은 아니야.'
  ],
  'JAM': [
    '실패. 변수를 재조정해.',
    '예상된 결과야. 반성해.',
    '계산 착오. 다음엔 신중해져.'
  ],
  'FUMBLE': [
    '한심하군. 폐기 처분이 답인가?',
    '연산 오류. 치명적 손상.',
    '...이건 내 책임이 아니야.'
  ]
};

// Action Stats for Combat
const actionStats = [
  { id: 'pressure', name: '압력', icon: '🔴', color: '#ff4444', target: '힘/장갑' },
  { id: 'precision', name: '정밀', icon: '🔵', color: '#4488ff', target: '회피/방어' },
  { id: 'steam', name: '증기', icon: '⚪', color: '#dddddd', target: '명중' }
];

// Computed for UI
const selectedStatColor = computed(() => selectedStat.value?.color || '#00ffcc');

// Combat Flow Functions
const setCombatStep = (step) => {
  combatStep.value = step;
  // Update description text
  combatInfoText.value = '>> ' + (combatInfoTexts[step] || 'AWAITING INPUT...');
};

const selectStat = (stat) => {
  selectedStat.value = stat;
  playCardSelect();
  addCombatLog(`${stat.icon} ${stat.name} 선택 → Target: 적의 ${stat.target}`, 'action');
  // Auto-advance to step 3
  setTimeout(() => setCombatStep(3), 500);
};

const addCombatLog = (text, type = 'info') => {
  combatLogs.value.push({ text, type, time: new Date().toLocaleTimeString() });
  if (combatLogs.value.length > 20) combatLogs.value.shift();
};

// ═══ Screen FX Functions ═══
const triggerScreenFx = (outcome) => {
  if (outcome === 'JACKPOT' || outcome === 'PERFECT') {
    screenFxType.value = 'critical-success';
    consoleState.value = 'critical-success';
  } else if (outcome === 'FUMBLE') {
    screenFxType.value = 'critical-fail';
    consoleState.value = 'critical-failure';
  } else if (outcome === 'JAM') {
    screenFxType.value = 'fail';
    consoleState.value = 'failure';
  } else {
    return; // No FX for STRAIN (partial success)
  }
  screenFxActive.value = true;
  setTimeout(() => {
    screenFxActive.value = false;
    screenFxType.value = '';
    consoleState.value = null;
  }, 1000);
};

// ═══ Navi Dialogue Functions ═══
let naviTypeTimer = null;
const triggerNaviDialogue = (outcome) => {
  const responses = naviResponses[outcome] || naviResponses['STRAIN'];
  const message = responses[Math.floor(Math.random() * responses.length)];
  
  // Set mood based on outcome
  if (outcome === 'JACKPOT' || outcome === 'PERFECT') {
    naviMood.value = 'pleased';
  } else if (outcome === 'STRAIN') {
    naviMood.value = 'neutral';
  } else if (outcome === 'JAM') {
    naviMood.value = 'annoyed';
  } else {
    naviMood.value = 'critical';
  }
  
  // Typewriter effect
  isNaviTyping.value = true;
  naviDialogue.value = '';
  let charIdx = 0;
  
  if (naviTypeTimer) clearInterval(naviTypeTimer);
  naviTypeTimer = setInterval(() => {
    if (charIdx < message.length) {
      naviDialogue.value += message[charIdx];
      charIdx++;
    } else {
      clearInterval(naviTypeTimer);
      isNaviTyping.value = false;
    }
  }, 40);
};

// ═══ System Activity Bar ═══
const activityLevel = ref(30);
const isTyping = ref(false);
let activityInterval = null;

const updateActivity = () => {
  // Simulate system load fluctuation
  const target = 20 + Math.random() * 60;
  activityLevel.value += (target - activityLevel.value) * 0.1;
  isTyping.value = terminalPhase === 'typing';
};

// ═══ Live Terminal Effect ═══
const terminalMessages = [
  'const SYSTEM_STATUS = "STABLE";',
  'WARNING: Unauthorized Access Detected...',
  'Analyzing Combat Data... [||||||]',
  '// VORTEX_ENGINE v19.0.4 Booting...'
];
const terminalDisplayText = ref('');
let terminalMsgIndex = 0;
let terminalCharIndex = 0;
let terminalPhase = 'typing'; // 'typing', 'waiting', 'erasing'
let terminalInterval = null;

const updateTerminal = () => {
  const currentMsg = terminalMessages[terminalMsgIndex];
  
  if (terminalPhase === 'typing') {
    if (terminalCharIndex < currentMsg.length) {
      terminalDisplayText.value = currentMsg.substring(0, terminalCharIndex + 1);
      terminalCharIndex++;
      playTyping();
    } else {
      terminalPhase = 'waiting';
      setTimeout(() => { terminalPhase = 'erasing'; }, 1500);
    }
  } else if (terminalPhase === 'erasing') {
    if (terminalCharIndex > 0) {
      terminalCharIndex--;
      terminalDisplayText.value = currentMsg.substring(0, terminalCharIndex);
    } else {
      terminalMsgIndex = (terminalMsgIndex + 1) % terminalMessages.length;
      terminalPhase = 'typing';
    }
  }
};

// ═══ Memory Hex Dump ═══
const hexDumpData = ref([]);
const generateHexDump = () => {
  const hexChars = '0123456789ABCDEF';
  const data = [];
  for (let i = 0; i < 60; i++) {
    const byte = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
    data.push(Math.random() > 0.7 ? `0x${byte}` : byte);
  }
  hexDumpData.value = data;
};

// ═══ Signal Oscilloscope ═══
const oscilloscopePhase = ref(0);
const oscilloscopePath = ref('M0,30 L100,30');
const waveDotX = ref(100);
let oscilloscopeInterval = null;

const updateOscilloscope = () => {
  oscilloscopePhase.value += 0.15;
  const phase = oscilloscopePhase.value;
  
  let path = 'M0,30';
  for (let x = 0; x <= 100; x += 2) {
    // Irregular waveform with multiple frequencies
    const y = 30 + 
      Math.sin((x * 0.1) + phase) * 8 +
      Math.sin((x * 0.25) + phase * 1.5) * 5 +
      Math.sin((x * 0.05) + phase * 0.5) * 10 +
      (Math.random() - 0.5) * 3; // noise
    path += ` L${x},${Math.max(5, Math.min(55, y))}`;
  }
  oscilloscopePath.value = path;
  
  // Pulsing dot at the end
  waveDotX.value = 95 + Math.sin(phase * 2) * 3;
};

// RNG Engine Logic
const diceValue = ref(0);
const isRolling = ref(false);
const diceOutcome = ref(null);
const displayValue = computed(() => {
  if (isRolling.value) return '??';
  return diceValue.value.toString().padStart(2, '0');
});

const outcomeClass = computed(() => {
  if (isRolling.value) return 'rolling';
  if (!diceOutcome.value) return '';
  return diceOutcome.value.toLowerCase();
});

const outcomeLabel = computed(() => {
  const labels = {
    'JACKPOT': '★ 잭팟',
    'PERFECT': '쾌속',
    'STRAIN': '부하',
    'JAM': '불발',
    'FUMBLE': '⚠ 재앙'
  };
  return labels[diceOutcome.value] || '';
});

const outcomeDescription = computed(() => {
  const descs = {
    'JACKPOT': '피해없음 / 보상 2배',
    'PERFECT': '적 내구도 감소 / 피해없음',
    'STRAIN': '적/유저 내구도 감소',
    'JAM': '실패 / 내구도 감소',
    'FUMBLE': '치명타 / 내구도 대폭 감소'
  };
  return descs[diceOutcome.value] || '';
});

// Advanced Dice Roll with Formula
const rollAdvancedDice = () => {
  if (isRolling.value) return;
  isRolling.value = true;
  diceOutcome.value = null;
  lastCalcString.value = '';
  combatStep.value = 3;
  
  playDiceRoll();
  addCombatLog('DICE ROLLING...', 'system');
  
  let rolls = 0;
  const maxRolls = 20;
  const interval = setInterval(() => {
    diceValue.value = Math.floor(Math.random() * 100) + 1;
    rolls++;
    if (rolls >= maxRolls) {
      clearInterval(interval);
      playDiceStop();
      finalizeAdvancedRoll();
    }
  }, 50);
};

const finalizeAdvancedRoll = () => {
  const baseRoll = Math.floor(Math.random() * 100) + 1;
  const gap = statGap.value;
  const tac = tacticsEnabled.value ? 20 : 0;
  const oc = overclockEnabled.value ? 30 : 0;
  
  const finalValue = Math.min(150, Math.max(1, baseRoll + gap + tac + oc));
  diceValue.value = finalValue;
  isRolling.value = false;
  
  // Build calculation string
  let calcParts = [`${baseRoll}`];
  if (gap !== 0) calcParts.push(`${gap > 0 ? '+' : ''}${gap}(격차)`);
  if (tac) calcParts.push(`+20(전술)`);
  if (oc) calcParts.push(`+30(OC)`);
  lastCalcString.value = calcParts.join(' ') + ` = ${finalValue}`;
  
  // Outcome determination with modified thresholds
  if (finalValue <= 5) diceOutcome.value = 'FUMBLE';
  else if (finalValue <= 49) diceOutcome.value = 'JAM';
  else if (finalValue <= 94) diceOutcome.value = 'STRAIN';
  else if (finalValue <= 120) diceOutcome.value = 'PERFECT';
  else diceOutcome.value = 'JACKPOT'; // 121+
  
  // Combat step to result
  combatStep.value = 4;
  
  // Play result sound
  if (diceOutcome.value === 'JACKPOT' || diceOutcome.value === 'PERFECT') {
    playCriticalSuccess();
  } else if (diceOutcome.value === 'FUMBLE') {
    playCriticalFail();
  } else if (diceOutcome.value === 'JAM') {
    playBeepAlert();
  } else {
    playBeep();
  }
  
  // Korean result label for logs
  const koreanLabels = {
    'JACKPOT': '★잭팟',
    'PERFECT': '성공',
    'STRAIN': '부분성공',
    'JAM': '실패',
    'FUMBLE': '대실패'
  };
  const resultLabel = koreanLabels[diceOutcome.value] || diceOutcome.value;
  
  // Log the result
  const statName = selectedStat.value ? `[${selectedStat.value.name}]` : '';
  addCombatLog(`판정: ${lastCalcString.value} → ${resultLabel} ${statName}`, diceOutcome.value.toLowerCase());
  
  // Trigger Navi Dialogue first (always runs)
  triggerNaviDialogue(diceOutcome.value);
  
  // Trigger Screen FX (independent, errors won't block dialogue)
  try {
    triggerScreenFx(diceOutcome.value);
  } catch (e) {
    console.error('triggerScreenFx error:', e);
  }
  
  // If overclock was used, add warning
  if (overclockEnabled.value) {
    addCombatLog('⚠ 오버클럭 과부하: 시스템 손상', 'warning');
  }
};

// Legacy function (keep for compatibility)
const rollDice = () => rollAdvancedDice();

// Spec Monitor Logic - 스탯별 대결 구도
const specs = reactive({
  pressure: { name: '압력', value: 85, color: '#ff4444', icon: '🔴', desc: '힘 vs 힘/장갑' },
  precision: { name: '정밀', value: 62, color: '#4488ff', icon: '🔵', desc: '기술 vs 회피/방어' },
  steam: { name: '증기', value: 91, color: '#dddddd', icon: '⚪', desc: '속도 vs 명중' },
  logic: { name: '연산', value: 45, color: '#00ff88', icon: '🟢', desc: '해킹 vs 보안' }
});

let timeInterval = null;
let percentInterval = null;
let specInterval = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false });
};

const updateSpecs = () => {
  for (const key in specs) {
    // Jitter effect: small random change
    const change = (Math.random() - 0.5) * 4;
    let newValue = specs[key].value + change;
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    specs[key].value = newValue;
  }
};

const handleClose = () => {
  if (isExiting.value || isSwitching.value) return;
  isExiting.value = true;
  playTransition();
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'home');
  }
  setTimeout(() => {
    router.go(withBase('/index.html'));
  }, 400);
};

const switchModule = (path) => {
  if (isExiting.value || isSwitching.value) return;
  isSwitching.value = true;
  playTransition();
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'tacticalmap');
  }
  setTimeout(() => {
    router.go(path);
  }, 400);
};

onMounted(() => {
  checkNavigationSource();
  
  // Run boot sequence first
  runBootSequence();
  
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  percentInterval = setInterval(() => {
    animatedPercent.value = 70 + Math.sin(Date.now() / 1000) * 25;
  }, 50);

  specInterval = setInterval(updateSpecs, 100);
  
  // Live Terminal
  terminalInterval = setInterval(updateTerminal, 60);
  
  // Activity Bar
  activityInterval = setInterval(updateActivity, 100);
  
  // Hex Dump
  generateHexDump();
  setInterval(generateHexDump, 2000);
  
  // Oscilloscope
  oscilloscopeInterval = setInterval(updateOscilloscope, 50);
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
  if (percentInterval) clearInterval(percentInterval);
  if (specInterval) clearInterval(specInterval);
  if (terminalInterval) clearInterval(terminalInterval);
  if (activityInterval) clearInterval(activityInterval);
  if (oscilloscopeInterval) clearInterval(oscilloscopeInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;500;700&family=DungGeunMo&display=swap');

/* ━━━━━━ CSS Variables ━━━━━━ */
.system-tactical-map {
  --c-primary: #ffb000;
  --c-secondary: #ff8800;
  --c-accent: #00ffff; /* Deep Cyan */
  --c-bg: #0a0502;
  --c-glow: rgba(255, 176, 0, 0.5);
  --c-cyan-glow: rgba(0, 255, 255, 0.5);
  
  position: fixed;
  inset: 0;
  background: var(--c-bg);
  font-family: 'Share Tech Mono', monospace;
  color: var(--c-primary);
  overflow: hidden;
  z-index: 9999;
}

/* ━━━━━━ Background Effects ━━━━━━ */
.grid-floor {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  bottom: 0;
  left: -50%;
  width: 200%;
  height: 60%;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: rotateX(75deg);
  transform-origin: center bottom;
  opacity: 0.3;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--c-glow), transparent);
  animation: scan 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 100;
}

@keyframes scan {
  0%, 100% { top: 0; opacity: 0; }
  50% { opacity: 0.6; }
  100% { top: 100%; }
}

/* ━━━━━━ Cinema Bars ━━━━━━ */
.cinema-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 55px;
  background: linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(10,5,0,0.95) 100%);
  z-index: 500;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.cinema-bar-top {
  top: 0;
  border-bottom: 2px solid var(--c-primary);
  box-shadow: 0 2px 20px var(--c-glow);
}

.cinema-bar-bottom {
  bottom: 0;
  border-top: 2px solid var(--c-primary);
  box-shadow: 0 -2px 20px var(--c-glow);
}

.ticker-wrap {
  width: 100%;
  overflow: hidden;
}

.ticker {
  display: inline-block;
  white-space: nowrap;
  animation: ticker-scroll 30s linear infinite;
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--c-primary);
  opacity: 0.7;
}

.ticker-reverse {
  animation-direction: reverse;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ━━━━━━ Tactical Background ━━━━━━ */
.tactical-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.sector-labels {
  position: absolute;
  inset: 0;
}

.sector-label {
  position: absolute;
  font-size: 0.65rem;
  color: rgba(255, 176, 0, 0.2);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* ━━━━━━ Scope Frame ━━━━━━ */
.scope-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}

.scope-corner {
  position: absolute;
  font-size: 2.5rem;
  color: rgba(255, 176, 0, 0.15);
}

.scope-tl { top: 30px; left: 30px; }
.scope-tr { top: 30px; right: 30px; }
.scope-bl { bottom: 30px; left: 30px; }
.scope-br { bottom: 30px; right: 30px; }

/* ━━━━━━ CRT & Vignette Overlays ━━━━━━ */
.crt-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  opacity: 0.5;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

/* ━━━━━━ Main Content (Bento Grid) ━━━━━━ */
.main-content {
  position: absolute;
  top: 70px;
  left: 120px;
  right: 120px;
  bottom: 70px;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.bento-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  width: 100%;
  height: calc(100% - 5px);
  margin-top: 0;
}

.grid-panel {
  position: relative;
  background: rgba(10, 5, 2, 0.7);
  border: 1px solid rgba(255, 176, 0, 0.3);
  box-shadow: 
    inset 0 0 30px rgba(0, 0, 0, 0.9),
    inset 0 0 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

/* Tactical Grid Overlay for all panels */
.tactical-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

.tactical-grid-overlay::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: 
    linear-gradient(rgba(255, 176, 0, 0.08) 1px, transparent 1px) center / 100% 1px no-repeat,
    linear-gradient(90deg, rgba(255, 176, 0, 0.08) 1px, transparent 1px) center / 1px 100% no-repeat;
  pointer-events: none;
}

/* Industrial Decals */
.panel-decals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.decal {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.15);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.decal-tl { top: 25px; left: 8px; }
.decal-tr { top: 25px; right: 8px; }
.decal-bl { bottom: 8px; left: 8px; }
.decal-br { bottom: 8px; right: 8px; }

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(255, 176, 0, 0.1);
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
}

.panel-icon {
  font-size: 1.2rem;
}

.panel-title {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 1rem;
  color: var(--c-primary);
  letter-spacing: 1px;
}

.panel-corners .corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--c-primary);
  opacity: 0.5;
}

.panel-corners .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.panel-corners .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.panel-corners .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.panel-corners .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

/* --- Panel 1: Code Editor --- */
.panel-protocols .code-editor {
  flex: 1;
  display: flex;
  padding: 15px;
  padding-left: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  background: #0a0a0a;
  color: #d4d4d4;
  overflow-y: auto;
  position: relative;
}

/* System Activity Bar */
.activity-bar {
  width: 12px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 0;
  position: relative;
  margin-right: 8px;
}

.activity-meter {
  width: 6px;
  background: linear-gradient(180deg, #00ff88 0%, #00ffcc 50%, #00aa66 100%);
  border-radius: 2px;
  transition: height 0.1s ease-out, opacity 0.1s;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
  min-height: 5%;
  max-height: 95%;
}

.activity-pulse {
  position: absolute;
  top: 5px;
  width: 4px;
  height: 4px;
  background: #00ff88;
  border-radius: 50%;
  opacity: 0.3;
}

.activity-pulse.active {
  animation: activity-pulse-anim 0.3s ease-in-out infinite;
}

@keyframes activity-pulse-anim {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 8px #00ff88; }
}

.activity-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.4rem;
  color: #444;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
  margin-top: 4px;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  border-right: 1px solid #222;
  color: #444;
  user-select: none;
}

.code-content {
  padding-left: 15px;
  flex: 1;
  position: relative;
}

.code-line {
  line-height: 2;
  position: relative;
}

/* Live Terminal Effect */
.terminal-scroll {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 250px;
  overflow: hidden;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 255, 0, 0.03);
  padding: 2px 5px;
  border-left: 2px solid #00ff00;
}

.terminal-prompt {
  color: #00ff00;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.terminal-text {
  color: #00ff88;
  text-shadow: 0 0 3px rgba(0, 255, 136, 0.3);
  min-width: 200px;
}

.terminal-cursor {
  color: #00ff00;
  font-weight: bold;
  animation: terminal-blink 0.6s step-end infinite;
}

@keyframes terminal-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Memory Hex Dump */
.hex-dump-container {
  position: absolute;
  right: 10px;
  top: 5px;
  bottom: 5px;
  width: 80px;
  display: flex;
  gap: 8px;
  overflow: hidden;
  pointer-events: none;
}

.hex-column {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.hex-flow {
  display: flex;
  flex-direction: column;
  gap: 3px;
  animation: hex-scroll 8s linear infinite;
}

@keyframes hex-scroll {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0%); }
}

.hex-byte {
  font-size: 0.65rem;
  font-family: 'Share Tech Mono', monospace;
  color: #ffb000;
  opacity: 0.35;
  text-align: center;
  text-shadow: 0 0 3px rgba(255, 176, 0, 0.3);
}

.code-line.interactive {
  cursor: help;
  transition: background 0.2s;
}

.code-line.interactive:hover {
  background: rgba(255, 176, 0, 0.08);
  border-left: 2px solid var(--c-primary);
}

/* Enhanced Syntax Highlighting - Amber/Cyan Theme */
.kwd { color: #ff9933; text-shadow: 0 0 3px rgba(255, 153, 51, 0.3); }
.var { color: #00ffff; text-shadow: 0 0 3px rgba(0, 255, 255, 0.3); }
.prop { color: #ffcc66; }
.str { color: #99ff99; text-shadow: 0 0 2px rgba(153, 255, 153, 0.2); }
.bool { color: #ff6699; }
.func { color: #ffdd44; text-shadow: 0 0 3px rgba(255, 221, 68, 0.3); }
.comment { color: #666666; font-style: italic; }
.num { color: #ff8866; }
.op { color: #ffffff; opacity: 0.8; }

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink { 50% { opacity: 0; } }

.code-tooltip {
  position: absolute;
  left: 100%;
  top: 0;
  background: #252526;
  border: 1px solid #454545;
  padding: 5px 10px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  margin-left: 10px;
  color: #6a9955;
  font-family: 'DungGeunMo', sans-serif;
}

/* --- Panel 2: RNG Engine (Clean Split Layout) --- */
.panel-rng .rng-display.rng-split {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 0;
  padding: 0;
  overflow: hidden;
}

/* LEFT: Display Zone - Dark viewing area */
.rng-display-zone {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #050505;
  padding: 20px;
  position: relative;
}

.rng-display-zone::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 255, 255, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

/* RNG Corner Decorations */
.rng-corner {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: rgba(0, 255, 204, 0.5);
  opacity: 0.6;
  z-index: 5;
}

.corner-tl {
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.corner-crosshair {
  font-size: 0.8rem;
  color: rgba(0, 255, 204, 0.6);
}

.corner-label {
  letter-spacing: 1px;
}

.corner-tr {
  top: 8px;
  right: 8px;
}

.signal-gauge {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 16px;
}

.signal-gauge .gauge-bar {
  width: 4px;
  background: #00ffcc;
  border-radius: 1px;
  animation: gauge-wave 1.5s ease-in-out infinite;
}

.signal-gauge .gauge-bar:nth-child(1) {
  height: 6px;
  animation-delay: 0s;
}

.signal-gauge .gauge-bar:nth-child(2) {
  height: 10px;
  animation-delay: 0.2s;
}

.signal-gauge .gauge-bar:nth-child(3) {
  height: 14px;
  animation-delay: 0.4s;
}

@keyframes gauge-wave {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.corner-bl {
  bottom: 8px;
  left: 8px;
}

.coord-data {
  letter-spacing: 0.5px;
}

.corner-br {
  bottom: 8px;
  right: 8px;
}

.hazard-stripe {
  width: 20px;
  height: 12px;
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 100, 0, 0.4) 0px,
    rgba(255, 100, 0, 0.4) 2px,
    transparent 2px,
    transparent 4px
  );
  border-radius: 2px;
}

/* Result Status Top (Above Number) */
.result-status-top {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 1.2rem;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.result-status-top .status-label {
  padding: 6px 16px;
  border: 2px solid currentColor;
  border-radius: 3px;
}

.status-label.waiting { color: #444; border-color: #333; }
.status-label.jackpot { color: #ffd700; background: rgba(255, 215, 0, 0.15); animation: glow-pulse 0.5s ease-in-out infinite alternate; font-size: 1.3rem; }
.status-label.perfect { color: #00ffcc; background: rgba(0, 255, 204, 0.1); }
.status-label.strain { color: #88cc00; }
.status-label.jam { color: #ff6600; }
.status-label.fumble { color: #ff0044; background: rgba(255, 0, 68, 0.15); animation: shake-anim 0.1s infinite; font-size: 1.3rem; }

@keyframes glow-pulse {
  from { box-shadow: 0 0 5px currentColor; }
  to { box-shadow: 0 0 20px currentColor; }
}

@keyframes shake-anim {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

/* Core Display */
.core-display {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dual Rotating Rings */
.dual-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.dual-ring .ring-track {
  fill: none;
  stroke: #1a1a1a;
  stroke-width: 2;
}

.dual-ring .ring-arc {
  fill: none;
  stroke: #00ffcc;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 80 400;
  opacity: 0.6;
}

.dual-ring .ring-arc-alt {
  fill: none;
  stroke: #00aaff;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 50 350;
  opacity: 0.5;
}

.outer-ring {
  animation: ring-spin-slow 12s linear infinite;
}

.inner-ring {
  animation: ring-spin-slow 8s linear infinite reverse;
}

.outer-ring.fast {
  animation: ring-spin-fast 0.6s linear infinite;
}

.inner-ring.fast {
  animation: ring-spin-fast 0.4s linear infinite reverse;
}

.outer-ring.fast .ring-arc,
.inner-ring.fast .ring-arc-alt {
  stroke: #00ffcc;
  opacity: 1;
  filter: drop-shadow(0 0 4px #00ffcc);
}

.core-display.overclock-active .ring-arc,
.core-display.overclock-active .ring-arc-alt {
  stroke: #ff6600;
}

@keyframes ring-spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ring-spin-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.display-ring {
  display: none; /* Replaced by dual-ring */
}

.display-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  color: #333;
  transition: all 0.1s;
}

.display-value.rolling {
  color: #fff;
  animation: number-flicker 0.1s infinite;
}

.display-value.jackpot { color: #ffd700; text-shadow: 0 0 30px #ffd700; }
.display-value.perfect { color: #00ffcc; text-shadow: 0 0 25px #00ffcc; }
.display-value.strain { color: #88cc00; text-shadow: 0 0 15px rgba(136, 204, 0, 0.5); }
.display-value.jam { color: #ff6600; text-shadow: 0 0 15px rgba(255, 102, 0, 0.5); }
.display-value.fumble { color: #ff0044; text-shadow: 0 0 30px #ff0044; animation: shake-anim 0.1s infinite; }

@keyframes number-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Result Status Bottom (Below Number) */
.result-status-bottom {
  min-height: 28px;
  text-align: center;
}

.special-status {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 4px;
  padding: 8px 20px;
  border-radius: 3px;
}

.special-status.jackpot {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  animation: glow-pulse 0.5s ease-in-out infinite alternate;
}

.special-status.fumble {
  color: #ff0044;
  background: rgba(255, 0, 68, 0.2);
  border: 2px solid #ff0044;
  animation: shake-anim 0.1s infinite;
}

.result-status-bottom .calc-formula {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: #00ff88;
  letter-spacing: 1px;
}

.result-status-bottom .desc-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #555;
}

/* RIGHT: Control Deck - Gray control panel */
.rng-control-deck {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
  border-left: 2px solid #2a2a2a;
}

.control-deck-header {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #555;
  letter-spacing: 3px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed #333;
  margin-bottom: 5px;
}

/* Control Block */
.control-block {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #2a2a2a;
}

.control-block-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  color: #b37e1d;
  margin-bottom: 8px;
}

.control-block-value {
  font-weight: bold;
  font-size: 1.1rem;
  color: #cccccc;
  text-shadow: 0 0 8px rgba(200, 200, 200, 0.5);
}

.control-block-value.positive { 
  color: #44ff88; 
  text-shadow: 0 0 10px rgba(68, 255, 136, 0.8);
}
.control-block-value.negative { 
  color: #ff6666; 
  text-shadow: 0 0 10px rgba(255, 102, 102, 0.8);
}

/* Horizontal Slider */
.stat-slider-h {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #ff4444 0%, #333 50%, #00ff88 100%);
  border-radius: 3px;
  cursor: pointer;
}

.stat-slider-h::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #00ffcc;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
  border: 2px solid #fff;
}

/* Toggle Buttons Row */
.toggle-buttons-row {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #555;
  background: rgba(30, 30, 30, 0.8);
}

.toggle-btn.active {
  border-color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
}

.toggle-btn.active .toggle-icon,
.toggle-btn.active .toggle-text {
  color: #00ffcc;
}

.toggle-btn.active .toggle-bonus {
  color: #00ff88;
}

.toggle-btn.overclock-btn.active {
  border-color: #ff6600;
  background: rgba(255, 102, 0, 0.15);
  animation: oc-border-pulse 1s ease-in-out infinite;
}

.toggle-btn.overclock-btn.active .toggle-icon,
.toggle-btn.overclock-btn.active .toggle-text {
  color: #ff6600;
}

.toggle-btn.overclock-btn.active .toggle-bonus {
  color: #ffaa00;
}

@keyframes oc-border-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 102, 0, 0.3); }
  50% { box-shadow: 0 0 15px rgba(255, 102, 0, 0.6); }
}

.toggle-icon {
  font-size: 1.2rem;
}

.toggle-text {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 1rem;
  color: #666;
}

.toggle-bonus {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: #555;
}

/* Ignition Button Full Width */
.ignition-btn-full {
  position: relative;
  width: 100%;
  padding: 14px;
  background: linear-gradient(180deg, #2a1a00 0%, #1a0a00 100%);
  border: 3px solid #aa4400;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
  animation: ignition-pulse 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes ignition-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 136, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 136, 0, 0.6), 0 0 40px rgba(255, 136, 0, 0.3); }
}

.ignition-btn-full:hover:not(:disabled) {
  border-color: #ff6600;
  transform: scale(1.02);
}

.ignition-btn-full:active:not(:disabled) {
  transform: scale(0.98);
}

.ignition-btn-full:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  animation: none;
}

.ignition-bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(100, 50, 0, 0.3) 0px,
    rgba(100, 50, 0, 0.3) 4px,
    transparent 4px,
    transparent 8px
  );
}

.ignition-label {
  position: relative;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.15rem;
  font-weight: bold;
  color: #ffcc00;
  text-shadow: 0 0 15px rgba(255, 200, 0, 1), 0 0 30px rgba(255, 136, 0, 0.8);
  letter-spacing: 3px;
}

/* Ready Indicator */
.ready-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #00ff88;
  letter-spacing: 1px;
}

.ready-indicator.processing {
  color: #ffaa00;
}

.ready-indicator .ready-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: ready-blink 1s ease-in-out infinite;
}

@keyframes ready-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ═══ RNG Advanced Controls (Legacy - kept for compatibility) ═══ */

.status-text.waiting { color: #666; }
.status-text.jackpot { color: #ffff00; text-shadow: 0 0 15px #ffff00; animation: pulse-crit 0.5s infinite alternate; }
.status-text.perfect { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
.status-text.strain { color: #ffaa00; }
.status-text.jam { color: #ff4444; }
.status-text.fumble { color: #ff0000; text-shadow: 0 0 15px #ff0000; animation: shake-crit 0.5s infinite; }

/* Outcome Description */
.outcome-desc {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.outcome-desc.waiting-desc {
  color: rgba(255, 255, 255, 0.3);
}

/* Ignition Switch Button */
.ignition-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.ignition-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ignition-frame {
  position: relative;
  width: 100px;
  height: 45px;
  border: 3px solid #aa3300;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 
    0 4px 0 #551100,
    inset 0 2px 4px rgba(0,0,0,0.5);
}

.ignition-stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    #331100 0px,
    #331100 4px,
    #552200 4px,
    #552200 8px
  );
  opacity: 0.8;
}

.ignition-inner {
  position: absolute;
  inset: 6px;
  background: linear-gradient(180deg, #ff6600 0%, #cc3300 50%, #aa2200 100%);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 0 2px 4px rgba(255,255,255,0.3),
    inset 0 -2px 4px rgba(0,0,0,0.3);
  transition: all 0.2s;
}

.ignition-btn:hover:not(:disabled) .ignition-inner {
  background: linear-gradient(180deg, #ff8833 0%, #ff5500 50%, #cc3300 100%);
  box-shadow: 
    inset 0 2px 4px rgba(255,255,255,0.4),
    inset 0 -2px 4px rgba(0,0,0,0.3),
    0 0 15px rgba(255, 100, 0, 0.5);
}

.ignition-btn:active:not(:disabled) .ignition-inner {
  transform: translateY(2px);
}

.ignition-text {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 1rem;
  color: #fff;
  text-shadow: 1px 1px 2px #000;
  letter-spacing: 2px;
}

.ignition-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255,150,0,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.ignition-btn:hover:not(:disabled) .ignition-glow {
  opacity: 1;
}

.ignition-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: #ffc400;
  letter-spacing: 2px;
}

/* Ignition Ready Status */
.ignition-ready-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #00ff00;
  letter-spacing: 1px;
  animation: ready-blink 1.5s ease-in-out infinite;
}

.ignition-ready-status.processing {
  color: #ffaa00;
  animation: processing-pulse 0.5s ease-in-out infinite;
}

.ready-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}

@keyframes ready-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes processing-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

/* ═══ RNG Advanced Controls ═══ */
.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 6px;
}

.control-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #888;
  min-width: 45px;
}

.stat-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #ff4444 0%, #444 50%, #00ff00 100%);
  border-radius: 2px;
  cursor: pointer;
}

.stat-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #00ffcc;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 255, 204, 0.6);
}

.control-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  min-width: 30px;
  text-align: right;
  color: #888;
}

.control-value.positive { color: #00ff00; }
.control-value.negative { color: #ff4444; }

.toggle-row {
  width: 100%;
  margin-bottom: 5px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 6px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #333;
  border-radius: 3px;
  transition: all 0.2s;
}

.toggle-switch:hover {
  border-color: #00ffcc;
}

.toggle-switch.active {
  border-color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
}

.toggle-switch input {
  display: none;
}

.toggle-slider {
  width: 24px;
  height: 12px;
  background: #333;
  border-radius: 6px;
  position: relative;
  transition: background 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #666;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: all 0.2s;
}

.toggle-switch.active .toggle-slider {
  background: #00aa88;
}

.toggle-switch.active .toggle-slider::after {
  left: 13px;
  background: #00ffcc;
  box-shadow: 0 0 6px #00ffcc;
}

.toggle-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #888;
}

.toggle-switch.active .toggle-label {
  color: #00ffcc;
}

/* Overclock Special */
.toggle-switch.overclock.active {
  border-color: #ff6600;
  background: rgba(255, 102, 0, 0.15);
}

.toggle-switch.overclock.active .toggle-slider {
  background: #aa4400;
}

.toggle-switch.overclock.active .toggle-slider::after {
  background: #ff6600;
  box-shadow: 0 0 8px #ff6600;
}

.toggle-switch.overclock.active .toggle-label {
  color: #ff6600;
}

.overclock-warning {
  color: #ff6600;
  font-size: 0.8rem;
  animation: oc-blink 0.5s ease-in-out infinite;
}

@keyframes oc-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.calc-display {
  width: 100%;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px dashed #444;
  border-radius: 2px;
  margin-bottom: 6px;
}

.calc-formula {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #88ffaa;
  letter-spacing: 0.5px;
}

/* Reactor Overclock Glow */
.reactor-hud.overclock-active {
  animation: oc-reactor-glow 1s ease-in-out infinite;
}

@keyframes oc-reactor-glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 102, 0, 0.3)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 102, 0, 0.6)); }
}

.reactor-hud.overclock-active .ring-outer svg,
.reactor-hud.overclock-active .ring-middle svg {
  filter: drop-shadow(0 0 4px rgba(255, 102, 0, 0.6));
}

/* Dynamic Data Cable Color */
.data-cable {
  --cable-color: #00ffcc;
}

.data-cable .cable-inner {
  background: linear-gradient(90deg, #003333, var(--cable-color), #003333);
}

.data-cable .cable-pulse {
  background: linear-gradient(90deg, transparent, var(--cable-color), transparent);
}

/* Dynamic Data Pipe Color */
.data-pipe {
  --pipe-color: #00ffcc;
}

.data-pipe .pipe-flow {
  background: linear-gradient(90deg, transparent, var(--pipe-color), transparent);
}

/* Flow Connector Dynamic Color */
.flow-connector {
  --conn-color: var(--c-accent);
}

.flow-connector .connector-line {
  background: linear-gradient(90deg, var(--conn-color), rgba(0, 255, 255, 0.3), var(--conn-color));
}

.flow-connector .connector-pulse {
  background: var(--conn-color);
  box-shadow: 0 0 8px var(--conn-color);
}

/* Combat Log Styles in Terminal */
.terminal-line .terminal-text.info { color: #00ffcc; }
.terminal-line .terminal-text.action { color: #ffaa00; }
.terminal-line .terminal-text.warning { color: #ff6600; }
.terminal-line .terminal-text.system { color: #888; }
.terminal-line .terminal-text.jackpot { color: #ffd700; font-weight: bold; }
.terminal-line .terminal-text.perfect { color: #00ff00; }
.terminal-line .terminal-text.strain { color: #88cc00; }
.terminal-line .terminal-text.jam { color: #ff8800 !important; font-weight: bold; }
.terminal-line .terminal-text.fumble { color: #ff0044 !important; font-weight: bold; }

/* --- Panel 3: Combat Flow (Microchip Style) --- */
.panel-combat .flow-chart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px 10px;
  padding-left: 5px;
  position: relative;
  background: 
    radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.03) 0%, transparent 50%);
}

/* Combat Floating Status */
.combat-floating-status {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: rgba(0, 255, 204, 0.5);
  letter-spacing: 1px;
  z-index: 10;
}

.combat-floating-status.top-status {
  top: 5px;
}

.combat-floating-status.bottom-status {
  bottom: 5px;
}

.combat-floating-status .blink-status {
  animation: status-blink 1.5s ease-in-out infinite;
}

@keyframes status-blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Vertical Guide Lines */
.vertical-guides {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 80px;
  pointer-events: none;
  z-index: 0;
}

.vertical-guides .guide-line {
  width: 1px;
  height: 100%;
  background: repeating-linear-gradient(
    180deg,
    rgba(0, 255, 204, 0.15) 0px,
    rgba(0, 255, 204, 0.15) 4px,
    transparent 4px,
    transparent 12px
  );
}

/* Signal Oscilloscope */
.oscilloscope {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 3;
  margin-right: -5px;
}

.scope-screen {
  width: 70px;
  height: 50px;
  background: rgba(0, 20, 0, 0.9);
  border: 2px solid #00ff00;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 10px rgba(0, 255, 0, 0.3),
    inset 0 0 20px rgba(0, 255, 0, 0.1);
}

.scope-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 10px 10px;
  pointer-events: none;
}

.waveform-svg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.wave-line {
  fill: none;
  stroke: url(#waveGrad);
  stroke-width: 1.5;
  filter: drop-shadow(0 0 3px #00ff00);
}

.wave-dot {
  fill: #00ffff;
  filter: drop-shadow(0 0 5px #00ffff);
}

.scope-label {
  position: absolute;
  bottom: 2px;
  left: 3px;
  font-size: 0.5rem;
  color: #00ff00;
  opacity: 0.6;
  font-family: 'Share Tech Mono', monospace;
}

.scope-connector {
  display: none; /* Replaced by data-cable */
}

/* Thick Data Cable */
.data-cable {
  display: flex;
  align-items: center;
  position: relative;
}

.cable-outer {
  width: 30px;
  height: 6px;
  background: linear-gradient(180deg, #004444 0%, #002828 50%, #001818 100%);
  border: 1px solid #006666;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.cable-inner {
  position: absolute;
  inset: 1px;
  background: linear-gradient(90deg, #003333, #00ffff, #003333);
  opacity: 0.3;
}

.cable-pulse {
  position: absolute;
  width: 10px;
  height: 100%;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: cable-flow 1s linear infinite;
}

@keyframes cable-flow {
  0% { left: -10px; }
  100% { left: 100%; }
}

.cable-connector-end {
  width: 4px;
  height: 10px;
  background: linear-gradient(180deg, #006666, #003333);
  border: 1px solid #00aaaa;
  border-left: none;
  border-radius: 0 2px 2px 0;
}

.step-number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1px;
}

/* Microchip Node */
.chip-node {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
}

.chip-pins {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chip-pins span {
  width: 8px;
  height: 2px;
  background: linear-gradient(90deg, #333 0%, var(--c-accent) 100%);
  opacity: 0.6;
}

.pins-left .chip-pins span {
  background: linear-gradient(90deg, var(--c-accent) 0%, #333 100%);
}

.chip-body {
  position: relative;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid var(--c-accent);
  padding: 12px 16px;
  clip-path: polygon(
    0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px,
    100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px)
  );
  min-width: 70px;
  text-align: center;
  box-shadow: 
    0 0 15px rgba(0, 255, 255, 0.2),
    inset 0 0 10px rgba(0, 0, 0, 0.8);
}

.chip-circuit {
  position: absolute;
  inset: 4px;
  border: 1px dashed rgba(0, 255, 255, 0.2);
  clip-path: inherit;
  pointer-events: none;
}

.chip-label {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 0.9rem;
  color: var(--c-accent);
  text-shadow: 0 0 5px var(--c-cyan-glow);
}

.chip-sub {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #888;
  margin-top: 4px;
  letter-spacing: 1px;
}

/* Interactive Flow Steps */
.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s;
}

.flow-step.active {
  transform: scale(1.05);
}

.flow-step.active .chip-body {
  border-color: #00ffcc;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8);
}

.flow-step.active .step-number {
  color: #00ffcc;
}

.chip-node.clickable {
  cursor: pointer;
}

.chip-node.clickable:hover .chip-body {
  border-color: #00ffff;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
}

/* Action Selection Buttons */
.action-buttons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--c-accent);
  border-radius: 4px;
  animation: action-fade-in 0.3s ease-out;
}

/* Fixed Position Action Buttons (Above Chip) */
.action-buttons-fixed {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid var(--c-accent);
  border-radius: 6px;
  animation: action-fade-in 0.2s ease-out;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.action-buttons-fixed::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--c-accent);
}

@keyframes action-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  background: rgba(30, 30, 30, 0.9);
  border: 2px solid var(--stat-color, #666);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(60, 60, 60, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px var(--stat-color);
}

.action-btn.selected {
  background: rgba(var(--stat-color), 0.3);
  border-width: 3px;
  box-shadow: 0 0 15px var(--stat-color);
}

.action-icon {
  font-size: 1.2rem;
}

.action-name {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 0.7rem;
  color: #fff;
}

.action-tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid var(--stat-color);
  border-radius: 3px;
  font-size: 0.55rem;
  color: #aaa;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

/* Flow Step Result State */
.flow-step.result-shown .chip-body.jackpot { border-color: #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
.flow-step.result-shown .chip-body.perfect { border-color: #00ff00; box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
.flow-step.result-shown .chip-body.strain { border-color: #88cc00; box-shadow: 0 0 15px rgba(136, 204, 0, 0.4); }
.flow-step.result-shown .chip-body.jam { border-color: #ff8800; box-shadow: 0 0 15px rgba(255, 136, 0, 0.4); }
.flow-step.result-shown .chip-body.fumble { border-color: #ff0044; box-shadow: 0 0 20px rgba(255, 0, 68, 0.6); animation: fumble-shake 0.3s ease-in-out 3; }

@keyframes fumble-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

/* Data Pipe Connector */
.flow-connector {
  position: relative;
  width: 40px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-pipe {
  position: relative;
  width: 100%;
  height: 4px;
  background: #222;
  border: 1px solid #444;
  overflow: hidden;
}

.pipe-flow {
  position: absolute;
  width: 15px;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--c-accent), transparent);
  animation: pipe-anim 1.5s linear infinite;
}

@keyframes pipe-anim {
  0% { left: -15px; }
  100% { left: 100%; }
}

.connector-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--c-accent), rgba(0, 255, 255, 0.3), var(--c-accent));
}

.connector-pulse {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--c-accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--c-accent);
  animation: connector-pulse-anim 2s ease-in-out infinite;
}

@keyframes connector-pulse-anim {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

/* --- Panel 4: Spec Monitor (Segmented LED) --- */
.panel-specs .specs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  gap: 12px;
  position: relative;
}

.specs-grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

.spec-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.spec-label {
  width: 130px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  font-family: 'DungGeunMo', sans-serif;
  font-size: 0.85rem;
  color: #aaa;
}

.spec-label .spec-title {
  display: flex;
  align-items: center;
  gap: 5px;
}

.spec-label .spec-icon {
  font-size: 0.9rem;
}

.spec-label .spec-name {
  display: inline;
}

.spec-label .spec-desc {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  margin-left: 18px;
}

/* Segmented LED Bar */
.spec-bar-segmented {
  flex: 1;
  height: 14px;
  display: flex;
  gap: 1px;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.segment {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  transition: all 0.1s;
}

.segment.active {
  background: var(--seg-color);
  box-shadow: 0 0 4px var(--seg-color);
}

.segment.critical {
  animation: segment-blink 0.5s infinite alternate;
}

@keyframes segment-blink {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.spec-digital-value {
  width: 50px;
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: right;
  letter-spacing: 1px;
  text-shadow: 0 0 8px currentColor;
}

/* ━━━━━━ Right Info Rail ━━━━━━ */
.info-rail {
  position: fixed;
  right: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-left: 2px solid rgba(255, 176, 0, 0.5);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
  transition: opacity 0.3s ease;
  view-transition-name: info-rail;
}

.info-rail:hover {
  opacity: 1;
}

.rail-exit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem;
  background: rgba(255, 50, 50, 0.1);
  border: none;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  color: #ff6666;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
}

.rail-exit-btn:hover {
  background: rgba(255, 50, 50, 0.3);
  color: #ffffff;
}

.exit-slot {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(50,20,20,0.9) 0%, rgba(30,10,10,0.95) 100%);
  border: 2px solid rgba(255, 100, 100, 0.3);
  border-radius: 4px;
}

.exit-icon {
  font-size: 1.3rem;
}

.exit-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,100,100,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.rail-exit-btn:hover .exit-glow {
  opacity: 0.8;
}

.exit-label {
  font-size: 0.75rem;
  font-family: 'Noto Sans KR', sans-serif;
}

.exit-sublabel {
  font-size: 0.5rem;
  color: #aa5555;
  letter-spacing: 1px;
}

.rail-monitor {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

.monitor-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem;
  border-bottom: 1px solid rgba(255, 176, 0, 0.2);
}

.monitor-logo {
  font-size: 1.2rem;
  color: #ffcc00;
}

.monitor-title {
  font-size: 0.7rem;
  color: #aa8800;
  letter-spacing: 2px;
}

.rail-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem;
}

.gauge-track {
  width: 20px;
  height: 80px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 176, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.gauge-fill-vertical {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75%;
  background: linear-gradient(180deg, #ffcc00 0%, #ff8800 100%);
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.gauge-animated {
  animation: gauge-pulse 2s ease-in-out infinite;
}

@keyframes gauge-pulse {
  0%, 100% { height: 70%; }
  50% { height: 85%; }
}

.gauge-percent {
  font-size: 0.7rem;
  color: var(--c-primary);
}

.gauge-glow {
  text-shadow: 0 0 8px var(--c-glow);
}

.rail-status-blocks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.3rem;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 176, 0, 0.1);
}

.block-icon {
  font-size: 0.9rem;
  color: #ffcc00;
  margin-bottom: 2px;
}

.block-value {
  font-size: 0.9rem;
  color: var(--c-primary);
  font-weight: 700;
}

.block-value.glow-green {
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

.block-label {
  font-size: 0.5rem;
  color: #665500;
  letter-spacing: 1px;
}

.block-divider {
  height: 1px;
  background: rgba(255, 176, 0, 0.15);
  margin: 0.2rem 0;
}

.info-rail .rail-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
}

.rail-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
}

.rail-led.led-green {
  background: #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

.rail-id {
  font-size: 0.55rem;
  color: #554400;
}

/* ━━━━━━ Left Command Rail ━━━━━━ */
.command-rail {
  position: fixed;
  left: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-right: 2px solid rgba(255, 176, 0, 0.5);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 30px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
  transition: opacity 0.3s ease;
  /* view-transition-name: command-rail; */
}

.command-rail:hover {
  opacity: 1;
}

.rail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  background: rgba(255, 176, 0, 0.08);
}

.rail-logo {
  font-size: 1.6rem;
  color: #ffcc00;
  animation: gear-spin 10s linear infinite;
  text-shadow: 0 0 15px rgba(255, 176, 0, 0.5);
}

@keyframes gear-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rail-title {
  font-size: 0.8rem;
  color: #aa8800;
  letter-spacing: 3px;
  font-weight: bold;
}

.rail-buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.3rem;
  overflow-y: auto;
}

.rail-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.3rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 176, 0, 0.15);
  color: #776600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
  position: relative;
}

.btn-slot {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(20,15,5,0.9) 0%, rgba(10,8,2,0.95) 100%);
  border: 2px solid rgba(255, 176, 0, 0.25);
  border-radius: 4px;
  transition: all 0.25s ease;
}

.btn-icon {
  font-size: 1.3rem;
  z-index: 1;
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,176,0,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-label {
  font-size: 0.75rem;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  color: inherit;
}

.btn-sublabel {
  font-size: 0.5rem;
  color: #665500;
  letter-spacing: 1px;
}

.rail-btn:hover {
  background: rgba(255, 176, 0, 0.15);
  border-color: rgba(255, 176, 0, 0.6);
  color: #ffcc00;
  transform: scale(1.08);
  z-index: 10;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3);
}

.rail-btn:hover .btn-slot {
  border-color: #ffb000;
  transform: scale(1.1);
}

.rail-btn:hover .btn-glow {
  opacity: 0.8;
}

.rail-btn:hover .btn-label {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 200, 0, 0.6);
}

.rail-btn.active {
  background: rgba(255, 176, 0, 0.15);
  border-color: #ffcc00;
  color: #ffffff;
}

.rail-btn.active .btn-slot {
  border-color: #ffcc00;
  box-shadow: 0 0 25px rgba(255, 200, 0, 0.5);
}

.rail-btn.active .btn-label {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 200, 0, 0.6);
}

.rail-btn.active .btn-glow {
  opacity: 1;
  animation: glow-pulse-btn 2s ease-in-out infinite;
}

@keyframes glow-pulse-btn {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.command-rail .rail-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
}

.rail-indicator {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #ff6600, #ffb000);
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  animation: indicator-scan 3s ease-in-out infinite;
}

@keyframes indicator-scan {
  0%, 100% { width: 20px; opacity: 0.5; }
  50% { width: 50px; opacity: 1; }
}

.rail-version {
  font-size: 0.6rem;
  color: #554400;
  letter-spacing: 1px;
}

/* ━━━━━━ Connection Info ━━━━━━ */
.connection-info {
  position: fixed;
  bottom: 25px;
  left: 115px;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #505050;
  z-index: 200;
  padding: 0.3rem 0;
}

.conn-status {
  color: #00ff88;
}

/* ━━━━━━ Exit Animation ━━━━━━ */
/* Full exit (to Home) */
.system-tactical-map.is-exiting {
  animation: fade-out 0.8s ease-out forwards;
}

.system-tactical-map.is-exiting .command-rail {
  animation: slide-left 0.6s ease-out forwards;
}

.system-tactical-map.is-exiting .info-rail {
  animation: slide-right 0.6s ease-out forwards;
}

/* Module switching (Content only) */
.system-tactical-map.is-switching .main-content,
.system-tactical-map.is-switching .grid-floor,
.system-tactical-map.is-switching .tactical-bg,
.system-tactical-map.is-switching .cinema-bar {
  animation: fade-out 0.5s ease-out forwards;
}

.system-tactical-map.is-switching .command-rail,
.system-tactical-map.is-switching .info-rail {
  opacity: 1 !important;
  transform: translateX(0) !important;
  animation: none !important;
  z-index: 500;
}

/* Boot Overlay */
.boot-overlay {
  position: fixed;
  inset: 0;
  background: #000000;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: boot-fade-out 0.5s ease-out forwards;
  animation-delay: 1.2s;
}

.boot-terminal {
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00;
  max-width: 600px;
  padding: 20px;
}

.boot-line {
  margin: 4px 0;
  display: flex;
  gap: 8px;
  opacity: 0;
  animation: boot-line-appear 0.1s ease-out forwards;
}

.boot-prompt {
  color: #ffb000;
}

.boot-text {
  color: #00ff88;
}

.boot-status {
  margin-left: auto;
  font-weight: bold;
}

.boot-status.ok {
  color: #00ff00;
}

.boot-status.done {
  color: #ffb000;
}

.boot-cursor {
  display: inline-block;
  color: #00ff00;
  animation: cursor-blink 0.5s step-end infinite;
}

@keyframes boot-line-appear {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes boot-fade-out {
  to { opacity: 0; pointer-events: none; }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Phase 2: Frame Construction - clip from center */
.is-booting.boot-phase-2 .main-content {
  animation: frame-construct 0.5s ease-out forwards;
}

.is-booting.boot-phase-2 .scope-frame,
.is-booting.boot-phase-2 .grid-floor,
.is-booting.boot-phase-2 .tactical-bg {
  animation: bg-construct 0.5s ease-out forwards;
}

@keyframes frame-construct {
  from {
    clip-path: inset(50% 50% 50% 50%);
    opacity: 0;
  }
  to {
    clip-path: inset(0% 0% 0% 0%);
    opacity: 1;
  }
}

@keyframes bg-construct {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Phase 3: Panels boot staggered - smooth fade in */
.is-booting .grid-panel {
  opacity: 0;
  transform: scale(0.95);
}

/* When boot completed, panels should stay visible without transition */
.system-tactical-map.boot-completed .grid-panel {
  opacity: 1 !important;
  transform: scale(1) !important;
  animation: none !important;
}

/* When not booting and not completed (initial state), hide panels */
.system-tactical-map:not(.is-booting):not(.boot-completed) .grid-panel {
  opacity: 0;
  transform: scale(0.95);
}

.is-booting.boot-phase-3 .panel-protocols {
  animation: panel-boot 0.3s ease-out forwards;
  animation-delay: 0s;
}

.is-booting.boot-phase-3 .panel-rng {
  animation: panel-boot 0.3s ease-out forwards;
  animation-delay: 0.1s;
}

.is-booting.boot-phase-3 .panel-combat {
  animation: panel-boot 0.3s ease-out forwards;
  animation-delay: 0.2s;
}

.is-booting.boot-phase-3 .panel-specs {
  animation: panel-boot 0.3s ease-out forwards;
  animation-delay: 0.3s;
}

/* Ensure panels stay visible in Phase 4 */
.is-booting.boot-phase-4 .grid-panel {
  opacity: 1;
  transform: scale(1);
}

@keyframes panel-boot {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Phase 4: Data loads - gauges animate */
.is-booting.boot-phase-4 .spec-fill {
  animation: gauge-load 0.8s ease-out forwards;
}

@keyframes gauge-load {
  from { width: 0%; }
}

/* Sidebars boot */
.is-booting .command-rail,
.is-booting .info-rail {
  opacity: 0;
}

.is-booting.boot-phase-3 .command-rail {
  animation: sidebar-boot-left 0.4s ease-out forwards;
  animation-delay: 0.4s;
}

.is-booting.boot-phase-3 .info-rail {
  animation: sidebar-boot-right 0.4s ease-out forwards;
  animation-delay: 0.5s;
}

@keyframes sidebar-boot-left {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes sidebar-boot-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Cinema bars boot */
.is-booting .cinema-bar {
  opacity: 0;
}

.is-booting.boot-phase-2 .cinema-bar-top {
  animation: cinema-boot-top 0.3s ease-out forwards;
}

.is-booting.boot-phase-2 .cinema-bar-bottom {
  animation: cinema-boot-bottom 0.3s ease-out forwards;
}

/* Phase 3, 4에서도 계속 보이게 유지 */
.is-booting.boot-phase-3 .cinema-bar-top,
.is-booting.boot-phase-4 .cinema-bar-top,
.is-booting.boot-phase-3 .cinema-bar-bottom,
.is-booting.boot-phase-4 .cinema-bar-bottom {
  opacity: 1;
  transform: translateY(0);
}

@keyframes cinema-boot-top {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes cinema-boot-bottom {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.system-tactical-map.is-exiting .command-rail {
  animation: slide-left 0.6s ease-out forwards;
}

.system-tactical-map.is-exiting .info-rail {
  animation: slide-right 0.6s ease-out forwards;
}

@keyframes slide-left {
  to { transform: translateX(-100%); opacity: 0; }
}

@keyframes slide-right {
  to { transform: translateX(100%); opacity: 0; }
}

/* ━━━━━━ Global Screen FX Overlay ━━━━━━ */
.screen-fx-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
}

.screen-fx-overlay.critical-success .fx-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(0, 255, 200, 0.4) 0%, rgba(255, 215, 0, 0.2) 50%, transparent 100%);
  animation: success-flash 0.8s ease-out forwards;
}

@keyframes success-flash {
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
}

.screen-fx-overlay.critical-fail .fx-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
  animation: fail-flash 0.8s ease-out forwards;
}

.screen-fx-overlay.critical-fail .fx-noise {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255, 0, 0, 0.1) 2px,
    rgba(255, 0, 0, 0.1) 4px
  );
  animation: fail-shake 0.1s linear infinite, fail-flash 0.8s ease-out forwards;
}

@keyframes fail-flash {
  0% { opacity: 0; }
  10% { opacity: 1; }
  20% { opacity: 0.3; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes fail-shake {
  0% { transform: translateX(-2px); }
  25% { transform: translateX(2px); }
  50% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
  100% { transform: translateX(0); }
}

/* JAM (실패) Screen FX */
.screen-fx-overlay.fail .fx-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255, 136, 0, 0.35) 0%, rgba(0, 0, 0, 0.2) 70%, transparent 100%);
  animation: jam-flash 0.6s ease-out forwards;
}

@keyframes jam-flash {
  0% { opacity: 0; }
  15% { opacity: 1; }
  100% { opacity: 0; }
}

/* JAM (실패) Console State */
.system-tactical-map.failure .bento-panel,
.system-tactical-map.failure .grid-panel {
  border-color: rgba(255, 136, 0, 0.5) !important;
  box-shadow: 0 0 20px rgba(255, 136, 0, 0.2), inset 0 0 30px rgba(255, 136, 0, 0.05) !important;
}

.system-tactical-map.failure .panel-label,
.system-tactical-map.failure .panel-title {
  color: #ff8800 !important;
  text-shadow: 0 0 10px rgba(255, 136, 0, 0.5) !important;
}

.system-tactical-map.fx-jam .bento-panel,
.system-tactical-map.fx-jam .grid-panel {
  border-color: rgba(255, 136, 0, 0.6) !important;
}

.system-tactical-map.fx-jam .panel-label,
.system-tactical-map.fx-jam .panel-title {
  color: #ff8800 !important;
}

/* ━━━━━━ Combat Info Description Line ━━━━━━ */
.combat-info-line {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.combat-info-line .info-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #00ffff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* Combat Info Line - Inline (Below STEP_01) - deprecated */
.combat-info-line-inline {
  display: none;
}

/* Combat Info Line - Fixed Position at Panel Bottom */
.combat-info-fixed {
  position: absolute;
  bottom: 50px;
  left: 75%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 4px;
  z-index: 50;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.combat-info-fixed .info-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #00ffff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* ━━━━━━ Panel Color Change on Critical FX ━━━━━━ */
.system-tactical-map.fx-success .bento-panel,
.system-tactical-map.critical-success .bento-panel,
.system-tactical-map.critical-success .grid-panel {
  border-color: rgba(0, 255, 200, 0.6) !important;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1) !important;
  transition: all 0.15s ease-out;
}

.system-tactical-map.fx-success .panel-label,
.system-tactical-map.critical-success .panel-label,
.system-tactical-map.critical-success .panel-title {
  color: #00ffcc !important;
  text-shadow: 0 0 10px rgba(0, 255, 200, 0.8) !important;
}

.system-tactical-map.fx-success .command-rail,
.system-tactical-map.fx-success .info-rail,
.system-tactical-map.critical-success .command-rail,
.system-tactical-map.critical-success .info-rail {
  border-color: rgba(0, 255, 200, 0.5) !important;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.2) !important;
}

/* Critical Success - All text and borders glow cyan/gold */
.system-tactical-map.critical-success {
  animation: success-glow 1s ease-out;
}

.system-tactical-map.critical-success .chip-body,
.system-tactical-map.critical-success .console-box {
  border-color: #00ffcc !important;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.15) !important;
}

.system-tactical-map.critical-success .spec-name,
.system-tactical-map.critical-success .code-line,
.system-tactical-map.critical-success .terminal-text {
  color: #ffd700 !important;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.8) !important;
}

@keyframes success-glow {
  0% { filter: brightness(1); }
  30% { filter: brightness(1.5); }
  100% { filter: brightness(1); }
}

.system-tactical-map.fx-fail .bento-panel,
.system-tactical-map.critical-failure .bento-panel,
.system-tactical-map.critical-failure .grid-panel {
  border-color: rgba(255, 0, 68, 0.7) !important;
  box-shadow: 0 0 25px rgba(255, 0, 68, 0.4), inset 0 0 40px rgba(255, 0, 0, 0.15) !important;
  transition: all 0.1s ease-out;
}

.system-tactical-map.fx-fail .panel-label,
.system-tactical-map.critical-failure .panel-label,
.system-tactical-map.critical-failure .panel-title {
  color: #ff0044 !important;
  text-shadow: 0 0 10px rgba(255, 0, 68, 0.8) !important;
}

.system-tactical-map.fx-fail .command-rail,
.system-tactical-map.fx-fail .info-rail,
.system-tactical-map.critical-failure .command-rail,
.system-tactical-map.critical-failure .info-rail {
  border-color: rgba(255, 0, 68, 0.6) !important;
  box-shadow: 0 0 20px rgba(255, 0, 68, 0.3) !important;
}

/* Critical Failure - All panels shake and glow red */
.system-tactical-map.critical-failure {
  animation: critical-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.system-tactical-map.critical-failure .chip-body,
.system-tactical-map.critical-failure .console-box {
  border-color: #ff003c !important;
  box-shadow: 0 0 20px #ff003c, inset 0 0 50px rgba(255, 0, 60, 0.2) !important;
}

.system-tactical-map.critical-failure .spec-name,
.system-tactical-map.critical-failure .code-line,
.system-tactical-map.critical-failure .terminal-text {
  color: #ff4466 !important;
  text-shadow: 0 0 8px rgba(255, 0, 68, 0.8) !important;
}

/* Red noise overlay for critical failure */
.system-tactical-map.critical-failure::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255, 0, 60, 0.05) 2px,
    rgba(255, 0, 60, 0.05) 4px
  );
  pointer-events: none;
  z-index: 9998;
  animation: noise-flicker 0.15s infinite;
}

@keyframes critical-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

@keyframes noise-flicker {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes panel-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

/* ━━━━━━ Navi Comm Link ━━━━━━ */
.navi-comm-link {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 300px;
  height: 313px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, rgba(0, 100, 150, 0.3) 0%, rgba(0, 50, 100, 0.4) 100%);
  border: 1px solid rgba(0, 200, 255, 0.4);
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  z-index: 10;
  overflow: hidden;
}

.comm-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid rgba(0, 200, 255, 0.2);
  flex-shrink: 0;
}

.comm-icon {
  font-size: 1rem;
  animation: comm-pulse 2s ease-in-out infinite;
}

@keyframes comm-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.comm-title {
  font-size: 0.75rem;
  font-weight: bold;
  color: #00ccff;
  letter-spacing: 2px;
}

.comm-message {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  overflow: hidden;
  max-height: 250px;
}

.comm-speaker {
  font-size: 1rem;
  color: #ff88cc;
  font-weight: bold;
  flex-shrink: 0;
}

.comm-text-container {
  display: flex;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
  max-height: 220px;
}

.comm-text {
  font-size: 0.9rem;
  color: #e0e0e0;
  line-height: 1.3;
  word-break: keep-all;
  max-height: 200px;
  overflow: hidden;
}

.comm-cursor {
  color: #00ffcc;
  animation: cursor-blink 0.5s steps(1) infinite;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.comm-status {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding-top: 0.3rem;
  border-top: 1px solid rgba(0, 200, 255, 0.2);
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #888;
}

.status-indicator.pleased {
  background: #00ff88;
  box-shadow: 0 0 4px #00ff88;
}

.status-indicator.neutral {
  background: #00ccff;
  box-shadow: 0 0 4px #00ccff;
}

.status-indicator.annoyed {
  background: #ffaa00;
  box-shadow: 0 0 4px #ffaa00;
}

.status-indicator.critical {
  background: #ff4444;
  box-shadow: 0 0 4px #ff4444;
  animation: status-blink 0.3s steps(1) infinite;
}

.status-label {
  font-size: 0.75rem;
  color: #888;
  letter-spacing: 1px;
}

/* Outcome Description in Navi Comm Link */
.comm-outcome {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  margin-top: 0.3rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 176, 0, 0.3);
  border-radius: 3px;
  font-family: 'Consolas', monospace;
}

.comm-outcome .outcome-label {
  font-size: 0.7rem;
  color: #888;
  flex-shrink: 0;
}

.comm-outcome .outcome-desc {
  font-size: 0.8rem;
  color: #ffb000;
  font-weight: bold;
}

.comm-outcome.jackpot .outcome-desc {
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
}

.comm-outcome.perfect .outcome-desc {
  color: #00ff88;
}

.comm-outcome.strain .outcome-desc {
  color: #ffaa00;
}

.comm-outcome.jam .outcome-desc {
  color: #ff6666;
}

.comm-outcome.fumble .outcome-desc {
  color: #ff4444;
  text-shadow: 0 0 6px #ff4444;
  animation: fumble-pulse 0.5s ease-in-out infinite;
}

@keyframes fumble-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Sidebar entrance animation (only from home, not when booting, not after boot completed) */
.system-tactical-map.from-home:not(.is-booting):not(.boot-completed) .command-rail {
  animation: sidebar-enter-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.6s;
  /* opacity: 0; */
  /* transform: translateX(-100%); */
  transition: none;
}

/* Volume Control */
.rail-volume-control {
  padding: 0.8rem 0.5rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
}

.volume-label {
  font-size: 0.6rem;
  color: #ffb000;
  letter-spacing: 1px;
  font-weight: bold;
}

.volume-slider-container {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 176, 0, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
}

.rail-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  z-index: 2;
  cursor: pointer;
  margin: 0;
}

.rail-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: #ffb000;
  border: 1px solid #000;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 176, 0, 0.8);
}

.rail-slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #ffb000;
  border-radius: 2px;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .cinema-bar, .command-rail, .info-rail {
    display: none !important;
  }

  .main-content {
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas: 
      "panel-protocols"
      "panel-console"
      "panel-chip"
      "panel-terminal"; /* Protocol -> Console -> Chip -> Terminal order */
    gap: 10px;
    padding-bottom: 250px; /* Space for navi-comm-link */
    overflow-y: auto;
    height: 100%;
    display: block; /* Fallback for complex grids */
  }

  /* Force panels to stack roughly */
  .grid-panel {
    grid-area: auto !important;
    height: auto;
    min-height: 200px;
    margin-bottom: 15px;
  }

  .panel-protocols { height: 300px; }
  .panel-console { height: auto; }
  .console-actions { flex-wrap: wrap; }
  
  .navi-comm-link {
    width: 95%;
    height: 200px;
    bottom: 10px;
    right: 2.5%;
    left: 2.5%;
  }
}

/* Mobile View Specific Styles */
.mobile-system-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  color: #ffb000;
  overflow-y: auto;
  padding: 20px;
  z-index: 2000;
  font-family: 'Share Tech Mono', monospace;
}

.mobile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  padding-bottom: 10px;
}

.back-btn {
  background: transparent;
  border: 1px solid #ffb000;
  color: #ffb000;
  padding: 5px 10px;
  margin-right: 15px;
  font-family: inherit;
  cursor: pointer;
}

.system-menu-mobile {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-card-mobile {
  border: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(255, 176, 0, 0.05);
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
}

.menu-title-mobile {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 5px;
}

.menu-desc-mobile {
  font-size: 0.9rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
}
</style>
