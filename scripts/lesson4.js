// 第 4 课：矩阵乘以向量 = 线性变换
(function () {
  const state = {
    mode: "scale",
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    sx: 2,
    sy: 0.5,
    angleDeg: 30,
    shearK: 0.8,
  };

  function applyModeToMatrix() {
    if (state.mode === "scale") {
      state.a = state.sx;
      state.b = 0;
      state.c = 0;
      state.d = state.sy;
    } else if (state.mode === "rotate") {
      const rad = (state.angleDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      state.a = cos;
      state.b = -sin;
      state.c = sin;
      state.d = cos;
    } else if (state.mode === "shear") {
      state.a = 1;
      state.b = state.shearK;
      state.c = 0;
      state.d = 1;
    }
  }

  function updateMatrixInputs() {
    const m11 = document.getElementById("m11");
    const m12 = document.getElementById("m12");
    const m21 = document.getElementById("m21");
    const m22 = document.getElementById("m22");
    if (!m11 || !m12 || !m21 || !m22) return;
    m11.value = state.a.toFixed(2);
    m12.value = state.b.toFixed(2);
    m21.value = state.c.toFixed(2);
    m22.value = state.d.toFixed(2);
  }

  function setupControls(onChange) {
    const modeSelect = document.getElementById("l4Mode");
    const extra = document.getElementById("l4ExtraControls");

    if (!modeSelect || !extra) return;

    function renderExtra() {
      if (state.mode === "scale") {
        extra.innerHTML = `
          <div class="vc-block">
            <div class="vc-label">缩放系数</div>
          </div>
          <div class="vc-row sliders">
            <div class="vc-block" style="flex: 1 1 0;">
              <div class="vc-label">sx（x 方向）</div>
              <input type="range" id="sxSlider" min="0.2" max="3" step="0.1" value="${state.sx}" />
            </div>
          </div>
          <div class="vc-row sliders">
            <div class="vc-block" style="flex: 1 1 0;">
              <div class="vc-label">sy（y 方向）</div>
              <input type="range" id="sySlider" min="0.2" max="3" step="0.1" value="${state.sy}" />
            </div>
          </div>
        `;
      } else if (state.mode === "rotate") {
        extra.innerHTML = `
          <div class="vc-block">
            <div class="vc-label">旋转角度 θ（度）</div>
            <input type="range" id="angleSlider" min="-180" max="180" step="5" value="${state.angleDeg}" />
            <div class="vc-value">θ = <span id="angleValue">${state.angleDeg}</span>°</div>
          </div>
        `;
      } else if (state.mode === "shear") {
        extra.innerHTML = `
          <div class="vc-block">
            <div class="vc-label">剪切系数 k（水平剪切）</div>
            <input type="range" id="shearSlider" min="-2" max="2" step="0.1" value="${state.shearK}" />
          </div>
        `;
      } else {
        extra.innerHTML = `
          <div class="vc-block">
            <p class="vc-label">直接在上面的矩阵输入框中修改 a, b, c, d。</p>
          </div>
        `;
      }

      // 绑定新渲染出来的控件
      const sxSlider = document.getElementById("sxSlider");
      const sySlider = document.getElementById("sySlider");
      const angleSlider = document.getElementById("angleSlider");
      const shearSlider = document.getElementById("shearSlider");

      if (sxSlider) {
        sxSlider.addEventListener("input", () => {
          state.sx = parseFloat(sxSlider.value);
          applyModeToMatrix();
          updateMatrixInputs();
          onChange();
        });
      }
      if (sySlider) {
        sySlider.addEventListener("input", () => {
          state.sy = parseFloat(sySlider.value);
          applyModeToMatrix();
          updateMatrixInputs();
          onChange();
        });
      }
      if (angleSlider) {
        angleSlider.addEventListener("input", () => {
          state.angleDeg = parseFloat(angleSlider.value);
          const angleValue = document.getElementById("angleValue");
          if (angleValue) angleValue.textContent = state.angleDeg;
          applyModeToMatrix();
          updateMatrixInputs();
          onChange();
        });
      }
      if (shearSlider) {
        shearSlider.addEventListener("input", () => {
          state.shearK = parseFloat(shearSlider.value);
          applyModeToMatrix();
          updateMatrixInputs();
          onChange();
        });
      }
    }

    modeSelect.addEventListener("change", () => {
      state.mode = modeSelect.value;
      if (state.mode !== "custom") {
        applyModeToMatrix();
      }
      updateMatrixInputs();
      renderExtra();
      onChange();
    });

    // 矩阵输入框手动编辑：仅在 custom 模式下生效
    ["m11", "m12", "m21", "m22"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          if (state.mode !== "custom") return;
          state.a = parseFloat(document.getElementById("m11").value) || 0;
          state.b = parseFloat(document.getElementById("m12").value) || 0;
          state.c = parseFloat(document.getElementById("m21").value) || 0;
          state.d = parseFloat(document.getElementById("m22").value) || 0;
          onChange();
        });
      }
    });

    // 初始化一次
    applyModeToMatrix();
    updateMatrixInputs();
    renderExtra();
  }

  function draw(api) {
    const { ctx, origin, gridSize, logicToScreen, drawGrid, drawArrowLabel } = api;
    drawGrid();

    // 绘制原始坐标系的单位向量 e1, e2
    const e1End = logicToScreen(1, 0);
    const e2End = logicToScreen(0, 1);

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(e1End.x, e1End.y);
    ctx.stroke();
    drawArrowLabel(origin, e1End, "e₁", "#cbd5f5");

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(e2End.x, e2End.y);
    ctx.stroke();
    drawArrowLabel(origin, e2End, "e₂", "#cbd5f5");

    // 绘制变换后的基向量 Ae1, Ae2
    const Ae1End = logicToScreen(state.a, state.c);
    const Ae2End = logicToScreen(state.b, state.d);

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(Ae1End.x, Ae1End.y);
    ctx.stroke();
    drawArrowLabel(origin, Ae1End, "A e₁", "#bbf7d0");

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(Ae2End.x, Ae2End.y);
    ctx.stroke();
    drawArrowLabel(origin, Ae2End, "A e₂", "#bbf7d0");

    // 展示一个示例向量 x = (1, 1) 及其像 Ax
    const xEnd = logicToScreen(1, 1);
    const AxEnd = logicToScreen(state.a + state.b, state.c + state.d);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xEnd.x, xEnd.y);
    ctx.stroke();
    drawArrowLabel(origin, xEnd, "x = (1, 1)", "#38bdf8");

    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(AxEnd.x, AxEnd.y);
    ctx.stroke();
    drawArrowLabel(origin, AxEnd, "A x", "#fed7aa");
  }

  window.Lesson4 = {
    id: "lesson4",
    state,
    draw,
    setupControls,
  };
})();

