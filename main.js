// 当前课程（用于区分第 1 课 / 第 2 课的画布行为）
let currentLessonId = "lesson1";

// 画布与坐标相关
const canvas = document.getElementById("vectorCanvas");
const ctx = canvas.getContext("2d");

// 显示向量和长度的 DOM
const vecDisplay = document.getElementById("vecDisplay");
const lenDisplay = document.getElementById("lenDisplay");

// 第 1 课：单向量的内部表示（逻辑坐标）
let vx = 3;
let vy = 2;

// 第 2 课：两个向量 u、v 以及线性组合 a·u + b·v
let ux = 2;
let uy = 1;
let vx2 = -1;
let vy2 = 2;
let aCoeff = 1;
let bCoeff = 1;

// 坐标系设置
const width = canvas.width;
const height = canvas.height;
const origin = { x: width / 2, y: height / 2 };
const gridSize = 30; // 每格 30 像素
const maxAbs = 6; // 限制显示范围大概在 [-6, 6]

// 拖拽相关
let dragging = false;

function logicToScreen(x, y) {
  return {
    x: origin.x + x * gridSize,
    y: origin.y - y * gridSize,
  };
}

function screenToLogic(px, py) {
  const x = (px - origin.x) / gridSize;
  const y = (origin.y - py) / gridSize;
  return { x, y };
}

function clampVector(x, y) {
  const ax = Math.max(-maxAbs, Math.min(maxAbs, x));
  const ay = Math.max(-maxAbs, Math.min(maxAbs, y));
  return { x: ax, y: ay };
}

function drawGrid() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, width, height);

  // 网格线
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = origin.x; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let x = origin.x; x > 0; x -= gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = origin.y; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  for (let y = origin.y; y > 0; y -= gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // 坐标轴（带箭头）
  ctx.strokeStyle = "#4b5563";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // x 轴线
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width - 12, origin.y); // 留出箭头空间
  // y 轴线
  ctx.moveTo(origin.x, height - 12);
  ctx.lineTo(origin.x, 0);
  ctx.stroke();

  // x 轴箭头
  ctx.beginPath();
  ctx.moveTo(width - 12, origin.y);
  ctx.lineTo(width - 18, origin.y - 4);
  ctx.lineTo(width - 18, origin.y + 4);
  ctx.closePath();
  ctx.fillStyle = "#4b5563";
  ctx.fill();

  // y 轴箭头
  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x - 4, 8);
  ctx.lineTo(origin.x + 4, 8);
  ctx.closePath();
  ctx.fill();

  // 轴标签 x, y
  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px system-ui";
  ctx.fillText("x", width - 18, origin.y - 8);
  ctx.fillText("y", origin.x + 8, 14);
}

function drawLesson1Vector() {
  drawGrid();

  // 计算终点
  const end = logicToScreen(vx, vy);

  // 画虚线分量
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(end.x, origin.y);
  ctx.moveTo(end.x, origin.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // 画箭头
  ctx.strokeStyle = "#38bdf8";
  ctx.fillStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  // 箭头尖
  const angle = Math.atan2(origin.y - end.y, end.x - origin.x);
  const headLen = 10;
  const hx1 = end.x - headLen * Math.cos(angle - Math.PI / 7);
  const hy1 = end.y + headLen * Math.sin(angle - Math.PI / 7);
  const hx2 = end.x - headLen * Math.cos(angle + Math.PI / 7);
  const hy2 = end.y + headLen * Math.sin(angle + Math.PI / 7);

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(hx1, hy1);
  ctx.lineTo(hx2, hy2);
  ctx.closePath();
  ctx.fill();

  // 在附近标注 v
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "12px system-ui";
  ctx.fillText("v", end.x + 6, end.y - 4);

  updateVectorText();
}

function updateVectorText() {
  const dx = vx;
  const dy = vy;
  const roundedX = Math.round(dx * 10) / 10;
  const roundedY = Math.round(dy * 10) / 10;
  const len = Math.sqrt(dx * dx + dy * dy);
  const roundedLen = Math.round(len * 100) / 100;

  vecDisplay.innerHTML = `
    <span class="column-vector">
      <span>${roundedX}</span>
      <span>${roundedY}</span>
    </span>
  `;
  lenDisplay.textContent = roundedLen;
}

function isNearArrowHead(px, py) {
  const end = logicToScreen(vx, vy);
  const dx = px - end.x;
  const dy = py - end.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < 12;
}

// 根据当前课程绘制对应场景
function drawScene() {
  if (currentLessonId === "lesson1") {
    drawLesson1Vector();
  } else if (currentLessonId === "lesson2") {
    drawLesson2Scene();
  }
}

// 第 2 课：绘制 u、v 以及 w = a·u + b·v
function drawLesson2Scene() {
  drawGrid();

  const uEnd = logicToScreen(ux, uy);
  const vEnd = logicToScreen(vx2, vy2);
  const wx = aCoeff * ux + bCoeff * vx2;
  const wy = aCoeff * uy + bCoeff * vy2;
  const wEnd = logicToScreen(wx, wy);

  // 组合路径：先走 a·u 再走 b·v（显示“组合”的过程）
  const auX = aCoeff * ux;
  const auY = aCoeff * uy;
  const bvX = bCoeff * vx2;
  const bvY = bCoeff * vy2;
  const auEnd = logicToScreen(auX, auY);
  const comboEnd = logicToScreen(auX + bvX, auY + bvY); // 理论上等于 wEnd

  // 用半透明虚线画出“先 a·u 再 b·v”的路径，并带有箭头
  function drawDashedArrow(start, end, color) {
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    const angle = Math.atan2(start.y - end.y, end.x - start.x);
    const headLen = 8;
    const hx1 = end.x - headLen * Math.cos(angle - Math.PI / 7);
    const hy1 = end.y + headLen * Math.sin(angle - Math.PI / 7);
    const hx2 = end.x - headLen * Math.cos(angle + Math.PI / 7);
    const hy2 = end.y + headLen * Math.sin(angle + Math.PI / 7);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(hx1, hy1);
    ctx.lineTo(hx2, hy2);
    ctx.closePath();
    ctx.fill();
  }

  // a·u 段（蓝色淡色）
  drawDashedArrow(origin, auEnd, "rgba(56, 189, 248, 0.6)");
  ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
  ctx.font = "11px system-ui";
  ctx.fillText(`a·u`, auEnd.x + 4, auEnd.y - 4);

  // 从 a·u 终点走 b·v 段（橙色淡色）
  drawDashedArrow(auEnd, comboEnd, "rgba(251, 146, 60, 0.6)");
  ctx.fillStyle = "rgba(251, 146, 60, 0.9)";
  ctx.font = "11px system-ui";
  ctx.fillText(`b·v`, comboEnd.x + 4, comboEnd.y - 4);

  // 绘制 u（蓝色）
  ctx.strokeStyle = "#38bdf8";
  ctx.fillStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(uEnd.x, uEnd.y);
  ctx.stroke();
  // 箭头
  let angle = Math.atan2(origin.y - uEnd.y, uEnd.x - origin.x);
  let headLen = 9;
  let hx1 = uEnd.x - headLen * Math.cos(angle - Math.PI / 7);
  let hy1 = uEnd.y + headLen * Math.sin(angle - Math.PI / 7);
  let hx2 = uEnd.x - headLen * Math.cos(angle + Math.PI / 7);
  let hy2 = uEnd.y + headLen * Math.sin(angle + Math.PI / 7);
  ctx.beginPath();
  ctx.moveTo(uEnd.x, uEnd.y);
  ctx.lineTo(hx1, hy1);
  ctx.lineTo(hx2, hy2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "12px system-ui";
  ctx.fillText("u", uEnd.x + 6, uEnd.y - 4);

  // 绘制 v（橙色）
  ctx.strokeStyle = "#fb923c";
  ctx.fillStyle = "#fb923c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(vEnd.x, vEnd.y);
  ctx.stroke();
  angle = Math.atan2(origin.y - vEnd.y, vEnd.x - origin.x);
  hx1 = vEnd.x - headLen * Math.cos(angle - Math.PI / 7);
  hy1 = vEnd.y + headLen * Math.sin(angle - Math.PI / 7);
  hx2 = vEnd.x - headLen * Math.cos(angle + Math.PI / 7);
  hy2 = vEnd.y + headLen * Math.sin(angle + Math.PI / 7);
  ctx.beginPath();
  ctx.moveTo(vEnd.x, vEnd.y);
  ctx.lineTo(hx1, hy1);
  ctx.lineTo(hx2, hy2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText("v", vEnd.x + 6, vEnd.y - 4);

  // 绘制 w（绿色）
  ctx.strokeStyle = "#22c55e";
  ctx.fillStyle = "#22c55e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(wEnd.x, wEnd.y);
  ctx.stroke();
  angle = Math.atan2(origin.y - wEnd.y, wEnd.x - origin.x);
  hx1 = wEnd.x - headLen * Math.cos(angle - Math.PI / 7);
  hy1 = wEnd.y + headLen * Math.sin(angle - Math.PI / 7);
  hx2 = wEnd.x - headLen * Math.cos(angle + Math.PI / 7);
  hy2 = wEnd.y + headLen * Math.sin(angle + Math.PI / 7);
  ctx.beginPath();
  ctx.moveTo(wEnd.x, wEnd.y);
  ctx.lineTo(hx1, hy1);
  ctx.lineTo(hx2, hy2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText("w = a·u + b·v", wEnd.x + 6, wEnd.y - 4);

  // 更新右侧显示
  const uDisplay = document.getElementById("uDisplay");
  const vDisplay = document.getElementById("vDisplay");
  const wDisplay = document.getElementById("wDisplay");

  if (uDisplay && vDisplay && wDisplay) {
    const r = (x) => Math.round(x * 10) / 10;
    uDisplay.innerHTML = `
      <span class="column-vector">
        <span>${r(ux)}</span>
        <span>${r(uy)}</span>
      </span>
    `;
    vDisplay.innerHTML = `
      <span class="column-vector">
        <span>${r(vx2)}</span>
        <span>${r(vy2)}</span>
      </span>
    `;
    wDisplay.innerHTML = `
      <span class="column-vector">
        <span>${r(wx)}</span>
        <span>${r(wy)}</span>
      </span>
    `;
  }
}

// 鼠标事件：第 1 课中可以在画布任意位置拖动来调整向量
canvas.addEventListener("mousedown", (e) => {
  if (currentLessonId !== "lesson1") return;
  dragging = true;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;
  let { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  vx = clamped.x;
  vy = clamped.y;
  drawVector();
});

canvas.addEventListener("mousemove", (e) => {
  if (currentLessonId !== "lesson1") return;
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;

  let { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  vx = clamped.x;
  vy = clamped.y;

  drawVector();
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

canvas.addEventListener("mouseleave", () => {
  dragging = false;
});

// 触摸支持（手机/平板）：同样可以在任意位置拖动
canvas.addEventListener("touchstart", (e) => {
  if (currentLessonId !== "lesson1") return;
  dragging = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (touch.clientX - rect.left) * scaleX;
  const py = (touch.clientY - rect.top) * scaleY;
  let { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  vx = clamped.x;
  vy = clamped.y;
  drawVector();
});

canvas.addEventListener("touchmove", (e) => {
  if (currentLessonId !== "lesson1") return;
  if (!dragging) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (touch.clientX - rect.left) * scaleX;
  const py = (touch.clientY - rect.top) * scaleY;
  let { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  vx = clamped.x;
  vy = clamped.y;
  drawVector();
});

canvas.addEventListener("touchend", () => {
  dragging = false;
});

// 课程切换与小测逻辑
(function setupLessons() {
  const lessonTabs = document.querySelectorAll(".lesson-tab");
  const lessonSections = document.querySelectorAll(".lesson-section");
  const quizLessons = document.querySelectorAll(".quiz-lesson");
  const nextLessonBtn = document.getElementById("nextLessonBtn");

  function setActiveLesson(lessonId) {
    currentLessonId = lessonId;

    // tab 高亮
    lessonTabs.forEach((tab) => {
      const id = tab.getAttribute("data-lesson-id");
      tab.classList.toggle("active", id === lessonId);
    });

    // 左侧讲解内容切换
    lessonSections.forEach((section) => {
      const id = section.getAttribute("data-lesson-id");
      section.classList.toggle("active", id === lessonId);
    });

    // 小测内容切换
    quizLessons.forEach((ql) => {
      const id = ql.getAttribute("data-lesson-id");
      ql.style.display = id === lessonId ? "block" : "none";
    });

    // 第 1 课 / 第 2 课右侧信息区切换
    const vInfo = document.querySelector(
      '.vector-info[data-lesson-id="lesson1"]'
    );
    const vControls = document.querySelector(
      '.vector-controls[data-lesson-id="lesson2"]'
    );
    if (vInfo && vControls) {
      if (lessonId === "lesson1") {
        vInfo.style.display = "flex";
        vControls.style.display = "none";
      } else if (lessonId === "lesson2") {
        vInfo.style.display = "none";
        vControls.style.display = "flex";
      }
    }

    // 更新画布标题/提示
    const canvasTitle = document.getElementById("canvasTitle");
    const canvasSubtitle = document.getElementById("canvasSubtitle");
    const hint = document.querySelector(".hint");

    if (lessonId === "lesson1") {
      canvasTitle.textContent = "拖动箭头，感受向量";
      canvasSubtitle.textContent = "从原点出发的箭头就是一个向量 v。";
      hint.textContent =
        "提示：在坐标系中拖动箭头尖端（鼠标左键按住移动），看看 v 和 |v| 如何变化。";
    } else if (lessonId === "lesson2") {
      canvasTitle.textContent = "两支向量的加法与数乘";
      canvasSubtitle.textContent =
        "在这里，我们将看到 u、v 以及它们的和 u + v 和线性组合。";
      hint.textContent =
        "提示：调整 a、b 滑块，观察 u、v 以及 w = a·u + b·v 的变化。";
    }

    // 每次切换课程时重绘场景
    drawScene();
  }

  lessonTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const lessonId = tab.getAttribute("data-lesson-id");
      setActiveLesson(lessonId);
    });
  });

  // 第 1 课小测逻辑
  const correctAnswers = {
    q1: "B",
    q2: "B",
    q3: "B",
  };

  const explanations = {
    q1: "x = -1 表示向左 1，y = 2 表示向上 2，所以是“向左 1，向上 2”。",
    q2: "|v| = √(6² + 8²) = √(36 + 64) = √100 = 10。",
    q3: "“往东北方向开车，每小时 60 公里”同时有大小和方向，是典型向量。",
  };

  const quizItems = document.querySelectorAll(
    '.quiz-lesson[data-lesson-id="lesson1"] .quiz-item'
  );

  quizItems.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");

        // 清除旧状态
        buttons.forEach((b) => b.classList.remove("correct", "wrong"));
        feedback.classList.remove("ok", "bad");

        if (userAnswer === correctAnswers[qid]) {
          btn.classList.add("correct");
          feedback.textContent = "✅ 回答正确！" + " " + explanations[qid];
          feedback.classList.add("ok");
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "❌ 这不是最合适的选项，再想一想。";
          feedback.classList.add("bad");
        }

        checkAllCorrect();
      });
    });
  });

  function checkAllCorrect() {
    let allCorrect = true;

    quizItems.forEach((item) => {
      const qid = item.getAttribute("data-question");
      const buttons = item.querySelectorAll("button");
      let thisCorrect = false;
      buttons.forEach((btn) => {
        if (
          btn.getAttribute("data-answer") === correctAnswers[qid] &&
          btn.classList.contains("correct")
        ) {
          thisCorrect = true;
        }
      });
      if (!thisCorrect) {
        allCorrect = false;
      }
    });

    if (allCorrect && nextLessonBtn) {
      nextLessonBtn.disabled = false;
      nextLessonBtn.classList.add("enabled");
      nextLessonBtn.textContent =
        "✅ 太棒了！点击这里切换到第 2 课：向量的加法与数乘";

      nextLessonBtn.addEventListener("click", () => {
        setActiveLesson("lesson2");
      });
    }
  }

  // 第 2 课小测逻辑
  const correctAnswers2 = {
    l2q1: "B",
    l2q2: "B",
    l2q3: "A",
  };

  const explanations2 = {
    l2q1: "u + v 表示先走 u 再走 v，从原点到最终终点的箭头。",
    l2q2: "-2v 表示方向相反、长度为 v 的 2 倍。",
    l2q3: "2u + 3v = (2·1 + 3·0, 2·0 + 3·1) = (2, 3)。",
  };

  const quizItems2 = document.querySelectorAll(
    '.quiz-lesson[data-lesson-id="lesson2"] .quiz-item'
  );

  quizItems2.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");

        // 清除旧状态
        buttons.forEach((b) => b.classList.remove("correct", "wrong"));
        feedback.classList.remove("ok", "bad");

        if (userAnswer === correctAnswers2[qid]) {
          btn.classList.add("correct");
          feedback.textContent = "✅ 回答正确！" + " " + explanations2[qid];
          feedback.classList.add("ok");
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "❌ 再想一想，注意几何意义和坐标计算。";
          feedback.classList.add("bad");
        }
      });
    });
  });

  // 第 2 课滑块交互
  const aSlider = document.getElementById("aSlider");
  const bSlider = document.getElementById("bSlider");
  const aValue = document.getElementById("aValue");
  const bValue = document.getElementById("bValue");

  if (aSlider && aValue) {
    aSlider.addEventListener("input", () => {
      aCoeff = parseFloat(aSlider.value);
      aValue.textContent = aCoeff.toFixed(1);
      if (currentLessonId === "lesson2") {
        drawScene();
      }
    });
  }

  if (bSlider && bValue) {
    bSlider.addEventListener("input", () => {
      bCoeff = parseFloat(bSlider.value);
      bValue.textContent = bCoeff.toFixed(1);
      if (currentLessonId === "lesson2") {
        drawScene();
      }
    });
  }

  // 初始化默认课
  setActiveLesson(currentLessonId);
})();

// 初次绘制（第 1 课交互）
drawVector();

