// 第 5 课：基与坐标表示
(function () {
  const state = {
    // 基底向量 u, v（标准坐标）
    ux: 1,
    uy: 0,
    vx: 0,
    vy: 1,
    // 目标向量 x（标准坐标）
    xx: 2,
    xy: 1,
    // 当前拖动对象：'u' | 'v' | 'x'
    draggingTarget: null,
  };

  function det2(a, b, c, d) {
    return a * d - b * c;
  }

  function solveAlphaBeta() {
    const { ux, uy, vx, vy, xx, xy } = state;
    const D = det2(ux, vx, uy, vy);
    if (Math.abs(D) < 1e-6) {
      return { ok: false, alpha: 0, beta: 0 };
    }
    // 解 [ux vx; uy vy] [alpha; beta] = [xx; xy]
    const alpha = det2(xx, vx, xy, vy) / D;
    const beta = det2(ux, xx, uy, xy) / D;
    return { ok: true, alpha, beta };
  }

  function updateSideDisplays() {
    const { ux, uy, vx, vy, xx, xy } = state;
    const uDom = document.getElementById("l5uDisplay");
    const vDom = document.getElementById("l5vDisplay");
    const xDom = document.getElementById("l5xDisplay");
    const coordDom = document.getElementById("l5coordDisplay");
    const statusDom = document.getElementById("l5status");
    const r = (x) => Math.round(x * 100) / 100;

    if (uDom) {
      uDom.innerHTML = `
        <span class="column-vector">
          <span>${r(ux)}</span>
          <span>${r(uy)}</span>
        </span>
      `;
    }
    if (vDom) {
      vDom.innerHTML = `
        <span class="column-vector">
          <span>${r(vx)}</span>
          <span>${r(vy)}</span>
        </span>
      `;
    }
    if (xDom) {
      xDom.innerHTML = `
        <span class="column-vector">
          <span>${r(xx)}</span>
          <span>${r(xy)}</span>
        </span>
      `;
    }

    const sol = solveAlphaBeta();
    if (!coordDom || !statusDom) return;
    if (!sol.ok) {
      coordDom.textContent = "当前：u 与 v 共线，不能把它们当作一组基底。";
      statusDom.textContent = "";
    } else {
      coordDom.innerHTML = `
        x 在基底 {u, v} 下的坐标为
        <span class="column-vector">
          <span>${r(sol.alpha)}</span>
          <span>${r(sol.beta)}</span>
        </span>
        ，即 x = ${r(sol.alpha)}·u + ${r(sol.beta)}·v。
      `;
      statusDom.textContent = "";
    }
  }

  function draw(api) {
    const { ctx, origin, logicToScreen, drawGrid, drawArrowLabel } = api;
    const { ux, uy, vx, vy, xx, xy } = state;

    drawGrid();

    // 绘制基底向量 u, v
    const uEnd = logicToScreen(ux, uy);
    const vEnd = logicToScreen(vx, vy);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(uEnd.x, uEnd.y);
    ctx.stroke();
    drawArrowLabel(origin, uEnd, "u", "#bae6fd");

    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(vEnd.x, vEnd.y);
    ctx.stroke();
    drawArrowLabel(origin, vEnd, "v", "#fed7aa");

    // 绘制 x 及其由 αu + βv 拼出的平行四边形
    const xEnd = logicToScreen(xx, xy);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xEnd.x, xEnd.y);
    ctx.stroke();
    drawArrowLabel(origin, xEnd, "x", "#bbf7d0");

    const sol = solveAlphaBeta();
    if (sol.ok) {
      const alpha = sol.alpha;
      const beta = sol.beta;
      const auEnd = logicToScreen(alpha * ux, alpha * uy);
      const auPlusBvEnd = logicToScreen(
        alpha * ux + beta * vx,
        alpha * uy + beta * vy
      );

      // 辅助线：从原点到 αu，再到 αu + βv
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(auEnd.x, auEnd.y);
      ctx.lineTo(auPlusBvEnd.x, auPlusBvEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrowLabel(origin, auEnd, "αu", "#cbd5f5");
      drawArrowLabel(auEnd, auPlusBvEnd, "βv", "#e5e7eb");

      // 轻微强调 x 与 αu+βv 的终点重合
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(xEnd.x, xEnd.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    updateSideDisplays();
  }

  function setDraggingTarget(target) {
    state.draggingTarget = target;
  }

  function updateFromDrag(logicX, logicY) {
    // 限制范围，避免拖得太远
    const clamp = (v) => Math.max(-6, Math.min(6, v));
    const x = clamp(logicX);
    const y = clamp(logicY);
    if (state.draggingTarget === "u") {
      state.ux = x;
      state.uy = y;
    } else if (state.draggingTarget === "v") {
      state.vx = x;
      state.vy = y;
    } else if (state.draggingTarget === "x") {
      state.xx = x;
      state.xy = y;
    }
  }

  window.Lesson5 = {
    id: "lesson5",
    state,
    draw,
    setDraggingTarget,
    updateFromDrag,
  };
})();

