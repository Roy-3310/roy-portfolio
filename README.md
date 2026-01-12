# Roy Portfolio｜作品集網站

一個以 **Vue 3 + Vite** 建置的個人作品集網站，整合前端作品、互動遊戲（Canvas）、職訓作品與美術作品展示。  

---

## 專案特色

- **作品列表 / 詳細頁架構**：以資料驅動（data 檔）統一管理作品內容，頁面可快速擴充。
- **互動 Demo（Canvas Game）**：使用 `requestAnimationFrame` 建立遊戲迴圈，整合 HUD、粒子特效、物件生成與碰撞邏輯。
- **元件化 UI**：封裝 `BaseCard / BaseButton / SectionTitle / TagPill` 等元件，維持一致的視覺與可讀性。
- **SCSS 管理樣式**：使用巢狀結構、共用變數/樣式策略提升維護性。
- **圖片展示體驗**：作品截圖支援點擊放大（Lightbox/Modal 類效果），提升作品瀏覽品質。

---

## 使用技術

### Frontend
- **Vue 3**（Composition API）
- **Vite**
- **Vue Router**
- **JavaScript / TypeScript**
- **SCSS**
- Canvas 2D（互動遊戲與特效）
- Git / GitHub

### Deployment
- GitHub Pages / Vercel
- CI/CD（GitHub Actions）

---

## 作品內容

### Web / Frontend
- **FitMeal Life（全端專題展示）**
  - 內容：健康餐/課程/商品/路線分析等整合型平台
  - 功能：多角色、表單驗證、API 串接、介面動效與 RWD

### Canvas / Interactive Games
- **Monster Shooter（射擊怪物 + 任務關卡）**  
- **Radar Beam Shooter（雷達掃描 + 極座標光束）**  

### Training Projects（職訓作品）
- **Training Project 01**  
  - 技術：<Vue / JS / CSS / API 等>

### Art / Design
- **Photoshop / Illustrator 系列**
  - 內容：合成、視覺設計、品牌視覺等作品整理

---

## 專案結構
```txt
src/
  components/
    layout/
    ui/
    canvas/
  pages/
  data/
    projects.dev.js
    projects.training.js
    projects.art.js
  projects/
    radarShooter/
      createRadarShooter.js
  utils/
    Vec2.js
public/
  images/
  favicon.ico
