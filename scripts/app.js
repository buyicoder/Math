// 应用入口：画布与坐标、课程切换、小测与控件；各课绘制由 lesson1/2/3 模块提供

let currentLessonId = "lesson1";

const canvas = document.getElementById("vectorCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const origin = { x: width / 2, y: height / 2 };
const gridSize = 30;
const maxAbs = 6;

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

  ctx.strokeStyle = "#4b5563";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width - 12, origin.y);
  ctx.moveTo(origin.x, height - 12);
  ctx.lineTo(origin.x, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - 12, origin.y);
  ctx.lineTo(width - 18, origin.y - 4);
  ctx.lineTo(width - 18, origin.y + 4);
  ctx.closePath();
  ctx.fillStyle = "#4b5563";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x - 4, 8);
  ctx.lineTo(origin.x + 4, 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px system-ui";
  ctx.fillText("x", width - 18, origin.y - 8);
  ctx.fillText("y", origin.x + 8, 14);
}

function drawArrowLabel(start, end, text, color = "#e5e7eb") {
  const angle = Math.atan2(start.y - end.y, end.x - start.x);
  const offset = 14;
  const lx = end.x + offset * Math.cos(angle - Math.PI / 2);
  const ly = end.y - offset * Math.sin(angle - Math.PI / 2);
  ctx.fillStyle = color;
  ctx.font = "12px system-ui";
  ctx.fillText(text, lx, ly);
}

function drawScene() {
  const api = {
    ctx,
    origin,
    gridSize,
    logicToScreen,
    drawGrid,
    drawArrowLabel,
  };
  if (currentLessonId === "lesson1" && window.Lesson1) {
    window.Lesson1.draw(api);
  } else if (currentLessonId === "lesson2" && window.Lesson2) {
    window.Lesson2.draw(api);
  } else if (currentLessonId === "lesson3" && window.Lesson3) {
    window.Lesson3.draw(api);
  } else if (currentLessonId === "lesson4" && window.Lesson4) {
    window.Lesson4.draw(api);
  } else if (currentLessonId === "lesson5" && window.Lesson5) {
    window.Lesson5.draw(api);
  }
}

function renderContentFromConfig() {
  const cfg = window.LessonsContent;
  const lessonContent = document.getElementById("lessonContent");
  const quizCard = document.querySelector(".quiz-card");
  if (!cfg || !lessonContent || !quizCard) return;

  lessonContent.innerHTML = "";

  quizCard.querySelectorAll(".quiz-lesson").forEach((el) => el.remove());

  const order = cfg.order || Object.keys(cfg.lessons || {});
  order.forEach((lessonId, index) => {
    const lessonCfg = cfg.lessons && cfg.lessons[lessonId];
    if (!lessonCfg) return;

    const section = document.createElement("div");
    section.className = "lesson-section";
    section.setAttribute("data-lesson-id", lessonId);
    if (index === 0) section.classList.add("active");
    section.innerHTML = lessonCfg.leftInner || "";
    lessonContent.appendChild(section);

    const quizLesson = document.createElement("div");
    quizLesson.className = "quiz-lesson";
    quizLesson.setAttribute("data-lesson-id", lessonId);
    quizLesson.innerHTML = lessonCfg.quizInner || "";
    if (lessonId !== "lesson1") {
      quizLesson.style.display = "none";
    }
    quizCard.appendChild(quizLesson);
  });
}

canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;
  const { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  if (currentLessonId === "lesson1" && window.Lesson1) {
    window.Lesson1.setVector(clamped.x, clamped.y);
  } else if (currentLessonId === "lesson5" && window.Lesson5) {
    window.Lesson5.updateFromDrag(x, y);
  }
  drawScene();
});

canvas.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;
  const { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  if (currentLessonId === "lesson1" && window.Lesson1) {
    window.Lesson1.setVector(clamped.x, clamped.y);
  } else if (currentLessonId === "lesson5" && window.Lesson5) {
    window.Lesson5.updateFromDrag(x, y);
  }
  drawScene();
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

canvas.addEventListener("mouseleave", () => {
  dragging = false;
});

canvas.addEventListener("touchstart", (e) => {
  dragging = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (touch.clientX - rect.left) * scaleX;
  const py = (touch.clientY - rect.top) * scaleY;
  const { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  if (currentLessonId === "lesson1" && window.Lesson1) {
    window.Lesson1.setVector(clamped.x, clamped.y);
  } else if (currentLessonId === "lesson5" && window.Lesson5) {
    window.Lesson5.updateFromDrag(x, y);
  }
  drawScene();
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
  const { x, y } = screenToLogic(px, py);
  const clamped = clampVector(x, y);
  if (currentLessonId === "lesson1" && window.Lesson1) {
    window.Lesson1.setVector(clamped.x, clamped.y);
  } else if (currentLessonId === "lesson5" && window.Lesson5) {
    window.Lesson5.updateFromDrag(x, y);
  }
  drawScene();
});

canvas.addEventListener("touchend", () => {
  dragging = false;
});

(function setupLessons() {
  renderContentFromConfig();

  const lessonTabs = document.querySelectorAll(".lesson-tab");
  const lessonSections = document.querySelectorAll(".lesson-section");
  const quizLessons = document.querySelectorAll(".quiz-lesson");
  const nextLessonBtn = document.getElementById("nextLessonBtn");

  function setActiveLesson(lessonId) {
    currentLessonId = lessonId;

    lessonTabs.forEach((tab) => {
      const id = tab.getAttribute("data-lesson-id");
      tab.classList.toggle("active", id === lessonId);
    });

    lessonSections.forEach((section) => {
      const id = section.getAttribute("data-lesson-id");
      section.classList.toggle("active", id === lessonId);
    });

    quizLessons.forEach((ql) => {
      const id = ql.getAttribute("data-lesson-id");
      ql.style.display = id === lessonId ? "block" : "none";
    });

    const vInfo = document.querySelector('.vector-info[data-lesson-id="lesson1"]');
    const vControls = document.querySelector('.vector-controls[data-lesson-id="lesson2"]');
    const vControls3 = document.querySelector('.vector-controls[data-lesson-id="lesson3"]');
    const vControls4 = document.querySelector('.vector-controls[data-lesson-id="lesson4"]');
    const vControls5 = document.querySelector('.vector-controls[data-lesson-id="lesson5"]');
    if (vInfo && vControls && vControls3 && vControls4 && vControls5) {
      if (lessonId === "lesson1") {
        vInfo.style.display = "flex";
        vControls.style.display = "none";
        vControls3.style.display = "none";
        vControls4.style.display = "none";
        vControls5.style.display = "none";
      } else if (lessonId === "lesson2") {
        vInfo.style.display = "none";
        vControls.style.display = "flex";
        vControls3.style.display = "none";
        vControls4.style.display = "none";
        vControls5.style.display = "none";
      } else if (lessonId === "lesson3") {
        vInfo.style.display = "none";
        vControls.style.display = "none";
        vControls3.style.display = "flex";
        vControls4.style.display = "none";
        vControls5.style.display = "none";
      } else if (lessonId === "lesson4") {
        vInfo.style.display = "none";
        vControls.style.display = "none";
        vControls3.style.display = "none";
        vControls4.style.display = "flex";
        vControls5.style.display = "none";
        if (window.Lesson4 && !vControls4.dataset.inited) {
          window.Lesson4.setupControls(() => {
            if (currentLessonId === "lesson4") {
              drawScene();
            }
          });
          vControls4.dataset.inited = "true";
        }
      } else if (lessonId === "lesson5") {
        vInfo.style.display = "none";
        vControls.style.display = "none";
        vControls3.style.display = "none";
        vControls4.style.display = "none";
        vControls5.style.display = "flex";
      }
    }

    const canvasTitle = document.getElementById("canvasTitle");
    const canvasSubtitle = document.getElementById("canvasSubtitle");
    const hint = document.querySelector(".hint");
    if (lessonId === "lesson1") {
      if (canvasTitle) canvasTitle.textContent = "拖动箭头，感受向量";
      if (canvasSubtitle) canvasSubtitle.textContent = "从原点出发的箭头就是一个向量 v。";
      if (hint) hint.textContent = "提示：在坐标系中拖动箭头尖端（鼠标左键按住移动），看看 v 和 |v| 如何变化。";
    } else if (lessonId === "lesson2") {
      if (canvasTitle) canvasTitle.textContent = "两支向量的加法与数乘";
      if (canvasSubtitle) canvasSubtitle.textContent = "在这里，我们将看到 u、v 以及它们的和 u + v 和线性组合。";
      if (hint) hint.textContent = "提示：调整 a、b 滑块，观察 u、v 以及 w = a·u + b·v 的变化。";
    } else if (lessonId === "lesson3") {
      if (canvasTitle) canvasTitle.textContent = "线性组合与张成（Span）";
      if (canvasSubtitle) canvasSubtitle.textContent = "观察 Span{u} 一条线，和 Span{u, v} 可以覆盖的区域。";
      if (hint) hint.textContent = "提示：拖动 u、v，切换模式，感受它们能“铺满”哪些地方。";
    } else if (lessonId === "lesson4") {
      if (canvasTitle) canvasTitle.textContent = "矩阵 = 变形平面的机器";
      if (canvasSubtitle) canvasSubtitle.textContent = "观察矩阵如何把 e₁, e₂ 和向量 x 变到新的位置。";
      if (hint) hint.textContent = "提示：切换变换类型或调整参数，看看 A e₁、A e₂ 和 A x 的变化。";
    } else if (lessonId === "lesson5") {
      if (canvasTitle) canvasTitle.textContent = "同一支箭头，在不同基底下的坐标";
      if (canvasSubtitle) canvasSubtitle.textContent = "比较 x 在标准基底和在 {u, v} 基底下的两种坐标表示。";
      if (hint) hint.textContent = "提示：在右侧控制区切换拖动对象（默认拖 x），然后在画布里拖动，观察坐标和平行四边形的变化。";
    }

    drawScene();
  }

  lessonTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const lessonId = tab.getAttribute("data-lesson-id");
      setActiveLesson(lessonId);
    });
  });

  const correctAnswers = { q1: "B", q2: "B", q3: "B" };
  const explanations = {
    q1: "x = -1 表示向左 1，y = 2 表示向上 2，所以是“向左 1，向上 2”。",
    q2: "|v| = √(6² + 8²) = √(36 + 64) = √100 = 10。",
    q3: "\"往东北方向开车，每小时 60 公里\"同时有大小和方向，是典型向量。",
  };
  const quizItems = document.querySelectorAll('.quiz-lesson[data-lesson-id="lesson1"] .quiz-item');

  quizItems.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");
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
        if (btn.getAttribute("data-answer") === correctAnswers[qid] && btn.classList.contains("correct")) {
          thisCorrect = true;
        }
      });
      if (!thisCorrect) allCorrect = false;
    });
    if (allCorrect && nextLessonBtn) {
      nextLessonBtn.disabled = false;
      nextLessonBtn.classList.add("enabled");
      nextLessonBtn.textContent = "✅ 太棒了！点击这里切换到第 2 课：向量的加法与数乘";
      nextLessonBtn.addEventListener("click", () => {
        setActiveLesson("lesson2");
      });
    }
  }

  const correctAnswers2 = { l2q1: "B", l2q2: "B", l2q3: "A" };
  const explanations2 = {
    l2q1: "u + v 表示先走 u 再走 v，从原点到最终终点的箭头。",
    l2q2: "-2v 表示方向相反、长度为 v 的 2 倍。",
    l2q3: "2u + 3v = (2·1 + 3·0, 2·0 + 3·1) = (2, 3)。",
  };
  const quizItems2 = document.querySelectorAll('.quiz-lesson[data-lesson-id="lesson2"] .quiz-item');

  quizItems2.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");
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

  const aSlider = document.getElementById("aSlider");
  const bSlider = document.getElementById("bSlider");
  const aValue = document.getElementById("aValue");
  const bValue = document.getElementById("bValue");
  const legendA = document.getElementById("legendA");
  const legendB = document.getElementById("legendB");

  if (aSlider && aValue && window.Lesson2) {
    aSlider.addEventListener("input", () => {
      window.Lesson2.state.aCoeff = parseFloat(aSlider.value);
      const txt = window.Lesson2.state.aCoeff.toFixed(1);
      aValue.textContent = txt;
      if (legendA) legendA.textContent = txt;
      if (currentLessonId === "lesson2") drawScene();
    });
  }
  if (bSlider && bValue && window.Lesson2) {
    bSlider.addEventListener("input", () => {
      window.Lesson2.state.bCoeff = parseFloat(bSlider.value);
      const txt = window.Lesson2.state.bCoeff.toFixed(1);
      bValue.textContent = txt;
      if (legendB) legendB.textContent = txt;
      if (currentLessonId === "lesson2") drawScene();
    });
  }

  const l3ModeInputs = document.querySelectorAll('input[name="l3mode"]');
  const showSpanArea = document.getElementById("showSpanArea");
  l3ModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (currentLessonId === "lesson3") drawScene();
    });
  });
  if (showSpanArea) {
    showSpanArea.addEventListener("change", () => {
      if (currentLessonId === "lesson3") drawScene();
    });
  }

  // 第 4 课小测逻辑
  const correctAnswers4 = {
    l4q1: "A",
    l4q2: "A",
    l4q3: "B",
  };
  const explanations4 = {
    l4q1: "对任意 (x, y)，A(x, y) = (2x, y)，因此是沿 x 方向拉伸 2 倍，y 不变。",
    l4q2: "[[0, -1], [1, 0]] 把 (1,0) 变成 (0,1)，(0,1) 变成 (-1,0)，正是逆时针 90° 旋转矩阵。",
    l4q3: "T(x) = A x + b 含有平移项 b，不满足 T(0) = 0，所以不是线性变换。",
  };
  const quizItems4 = document.querySelectorAll('.quiz-lesson[data-lesson-id="lesson4"] .quiz-item');
  quizItems4.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");
        buttons.forEach((b) => b.classList.remove("correct", "wrong"));
        feedback.classList.remove("ok", "bad");
        if (userAnswer === correctAnswers4[qid]) {
          btn.classList.add("correct");
          feedback.textContent = "✅ 回答正确！" + " " + explanations4[qid];
          feedback.classList.add("ok");
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "❌ 再想一想，结合画面里的几何效果一起思考。";
          feedback.classList.add("bad");
        }
      });
    });
  });

  // 第 5 课小测逻辑
  const correctAnswers5 = {
    l5q1: "B",
    l5q2: "A",
    l5q3: "A",
  };
  const explanations5 = {
    l5q1: "x = (2,1) 表示沿 e₁ 方向走 2，沿 e₂ 方向走 1。",
    l5q2: "解 2 = α + β, 1 = β，可得 β = 1, α = 1，所以坐标是 (1,1)。",
    l5q3: "改变的是坐标轴和坐标数字，向量本身（在平面上的箭头）没有改变。",
  };
  const quizItems5 = document.querySelectorAll('.quiz-lesson[data-lesson-id="lesson5"] .quiz-item');
  quizItems5.forEach((item) => {
    const qid = item.getAttribute("data-question");
    const buttons = item.querySelectorAll("button");
    const feedback = item.querySelector(".quiz-feedback");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const userAnswer = btn.getAttribute("data-answer");
        buttons.forEach((b) => b.classList.remove("correct", "wrong"));
        feedback.classList.remove("ok", "bad");
        if (userAnswer === correctAnswers5[qid]) {
          btn.classList.add("correct");
          feedback.textContent = "✅ 回答正确！" + " " + explanations5[qid];
          feedback.classList.add("ok");
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "❌ 再想一想，可以结合画布里的图像来理解。";
          feedback.classList.add("bad");
        }
      });
    });
  });

  setActiveLesson(currentLessonId);
})();

drawScene();
