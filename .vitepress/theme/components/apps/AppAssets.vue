<template>
  <div class="app-content">
    <div class="market-grid">
      <div class="market-section">
        <h3>📟 암시장 (Black Market)</h3>
        <div class="cmd-box">
          <code>!암시장</code>
        </div>
        <p class="desc">
          위치: 검은 오일 상단 / 혼종 정비소<br>
          판매: 특수 모듈, 내산 코팅제
        </p>
        <div class="price-list">
          <div class="price-item">
            <span>내산 코팅제</span>
            <span class="cost">15 고철</span>
          </div>
          <div class="price-item">
            <span>광학 미채 모듈</span>
            <span class="cost">80 고철</span>
          </div>
        </div>
      </div>

      <div class="market-section">
        <h3>📟 정비소 (Repair Shop)</h3>
        <div class="cmd-box">
          <code>!정비소</code>
        </div>
        <p class="desc">
          위치: 중층 / 안전구역<br>
          판매: 표준 부품, 수리
        </p>
        <div class="price-list">
          <div class="price-item">
            <span>정밀 수리</span>
            <span class="cost">30 고철</span>
          </div>
          <div class="price-item">
            <span>외형 세척</span>
            <span class="cost">5 고철</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-content {
  padding: 10px;
}

.market-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.market-section {
  background: rgba(0,0,0,0.2);
  border: 1px solid #3d2e1f;
  padding: 15px;
}

h3 {
  color: #ffb000;
  margin-top: 0;
  border-bottom: 1px solid #8b5a2b;
  padding-bottom: 10px;
}

.cmd-box {
  background: #000;
  color: #0f0;
  padding: 10px;
  font-family: monospace;
  margin: 10px 0;
  border: 1px solid #333;
}

.desc {
  color: #8a7b6b;
  font-size: 0.9em;
  line-height: 1.4;
}

.price-list {
  margin-top: 15px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px dashed #3d2e1f;
  color: #e0d0b0;
}

.cost {
  color: #ffb000;
}

@media (max-width: 768px) {
  .market-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>

<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .market-grid { grid-template-columns: 1fr; }
  .market-section { margin-bottom: 20px; }
}
</style>
