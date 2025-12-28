export const devProjects = [
  //Unity RPG小遊戲
  {
    id: "unity-mini-game",
    name: "Unity RPG遊戲",
    category: "Unity",
    cover: "/images/dev-unity-01.jpg",
    summary: "2D 遊戲原型，展示角色控制、碰撞、關卡與 UI。",
    tabs: [
      {
        key: "concept",
        label: "專案性質與設計理念",
        content:
          "本作品為教學導向實作，參考國外 Unity RPG 教學影片完成。重點在於理解 RPG 遊戲的程式架構、角色控制與系統拆分，而非完整內容產出。",
      },
      {
        key: "tech",
        label: "使用技術",
        content:
          "Unity、C#、2D Physics、Animator、角色狀態機、物件導向程式設計、UI 系統。",
      },
      {
        key: "learning",
        label: "學習重點與收穫",
        content:
          "透過本專案熟悉 Unity RPG 常見架構，能清楚說明角色狀態、動畫切換與腳本分工，為後續獨立開發遊戲奠定基礎。",
      },
    ],

    gallery: [
      "/images/dev-unity-01.jpg",
      "/images/dev-unity-02.jpg",
      "/images/dev-unity-03.jpg",
      "/images/dev-unity-04.jpg",
      "/images/dev-unity-05.jpg",
      "/images/dev-unity-06.jpg",
      "/images/dev-unity-07.jpg",
    ],
  },

  //Canvas 動態街景模擬
  {
    id: "canvas-city-scene",
    name: "網頁視覺互動：Canvas 動態街景模擬",
    category: "Web Interactive",
    cover: "/images/dev-web-interactive-01.jpg",
    summary:
      "以 Canvas 2D API 建構完整的街景場景，結合時間驅動動畫與滑鼠互動，模擬具生命感的動態城市背景。",
    demoComponent: "CitySceneCanvas",
    tabs: [
      {
        key: "concept",
        label: "設計理念",
        content:
          "以「場景模擬」而非單純視覺特效為核心，透過時間軸與物件行為設計，讓畫面中的建築、車輛、雲朵與旗幟產生持續且自然的動態，營造具有呼吸感的互動背景。",
      },
      {
        key: "tech",
        label: "使用技術",
        content:
          "Canvas 2D API、requestAnimationFrame、時間驅動動畫（Time-based Animation）、正弦波運動模型、滑鼠事件監聽、模組化繪圖函式（建築／樹木／車輛／裝飾物）。",
      },
      {
        key: "highlights",
        label: "實作特點",
        content:
          "以模組化函式建構場景元素，支援多物件同時動畫（雲層漂移、車輛行駛、旗幟擺動、花草微晃），並透過滑鼠位置即時影響色相與視覺回饋，可作為網站 Hero Section 或互動式背景元件。",
      },
    ],
    gallery: ["/src/assets/images/dev-web-interactive-01.jpg"],
  },

  //吞噬成長互動世界
  {
    id: "project04-agar",
    name: "Canvas 吞噬成長互動世界",
    category: "Web Interactive",
    cover: "/images/dev-web-game-01.jpg",
    summary: "Canvas + 向量運算 + 即時互動的可玩作品。",
    demoComponent: "Project04Showcase",
    tabs: [
      {
        key: "concept",
        label: "設計理念",
        content: "世界座標搭配玩家置中視角，模擬吞噬成長的即時互動體驗。",
      },
      {
        key: "tech",
        label: "使用技術",
        content: "Canvas、向量運算（Vec2）、requestAnimationFrame。",
      },
    ],
    gallery: ["/src/assets/images/dev-web-game-01.jpg"],
  },

  //怪物射擊
  {
    id: "monster-shooter",
    name: "Monster Shooter｜載入後怪物射擊得分",
    category: "Web Game",
    cover: "/images/dev-monster-shooter.jpg",
    summary:
      "結合 Loading（時間函數）與射擊事件觸發：載入完成後生成怪物，射擊得分並維持怪物數量。",
    demoComponent: "MonsterShooterDemo",
    tabs: [
      {
        key: "concept",
        label: "設計理念",
        content:
          "結合時間函數、事件觸發射擊製作成完整互動作品：先以 Loading 建立節奏與期待，再進入射擊、獲得分數、擊中粒子特效回饋。",
      },
      {
        key: "tech",
        label: "使用技術",
        content:
          "Vue 3 + Vite、SCSS、DOM/CSS 角色造型、滑鼠事件（mousemove/click）、鍵盤事件（keydown）、計時器（setInterval）、狀態管理（reactive/ref）。",
      },
      {
        key: "features",
        label: "功能特色",
        content:
          "載入後切換場景、準星射擊、點擊命中得分、怪物移動模式切換（K）、重置（R）、怪物數量自動補齊、彈孔效果與黑底格線背景。",
      },
    ],
    gallery: [],
  },

  //雷達掃描射擊
  {
    id: "radar-beam-shooter",
    name: "Radar Beam Shooter（雷達掃描射擊）",
    category: "Web Interactive",
    cover: "/images/dev-radar-01.jpg",
    summary:
      "玩家船艦定期放出雷達偵測，滑鼠控制極座標光束照射後自動發射飛彈；敵人為三角函數繪製多邊形並帶頂點小艇防禦/撞擊。",
    demoComponent: "RadarShooterDemo",
    tabs: [
      {
        key: "concept",
        label: "設計理念",
        content:
          "以「雷達偵測」與「扇形光束」建立資訊不對稱：敵人不是一直可見，必須依靠雷達脈衝短暫揭露位置，再用光束精準鎖定射擊，形成策略性操作。",
      },
      {
        key: "tech",
        label: "使用技術",
        content:
          "Canvas 2D、requestAnimationFrame 更新迴圈、極座標（角度/距離/扇形判定）、三角函數繪製多邊形、粒子系統（爆炸）、Vue 元件化嵌入作品集。",
      },
      {
        key: "process",
        label: "開發流程",
        content:
          "先建立輸入系統（滑鼠角度/距離）→ 光束扇形判定 → 雷達脈衝揭露 → 敵人多邊形渲染 → 小艇繞行與碰撞 → 飛彈追擊與爆炸粒子 → 死亡結算存活時間。",
      },
    ],
  },
];
