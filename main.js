// 画布与坐标相关
const canvas = document.getElementById("vectorCanvas");
const ctx = canvas.getContext("2d");

// 显示向量和长度的 DOM
const vecDisplay = document.getElementById("vecDisplay");
const lenDisplay = document.getElementById("lenDisplay");

// 向量的内部表示（逻辑坐标）
let vx = 3;
let vy = 2;

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

function drawVector() {
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

// 鼠标事件：现在可以在画布任意位置拖动来调整向量
canvas.addEventListener("mousedown", (e) => {
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

  let currentLessonId = "lesson1";

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

    // 更新画布标题/提示（先简单区分 1、2 课）
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
        "提示：第 2 课的具体交互即将上线，现在可以先阅读左侧讲解内容。";
    }
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

  // 初始化默认课
  setActiveLesson(currentLessonId);
})();

// 初次绘制（第 1 课交互）
drawVector();

