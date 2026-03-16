// 第 3 课：Span{u} 与 Span{u, v} 可视化
(function () {
  function draw(api) {
    const { ctx, origin, logicToScreen, drawGrid, drawArrowLabel } = api;
    const ux = window.Lesson2.state.ux;
    const uy = window.Lesson2.state.uy;
    const vx2 = window.Lesson2.state.vx2;
    const vy2 = window.Lesson2.state.vy2;

    drawGrid();

    const modeInput = document.querySelector('input[name="l3mode"]:checked');
    const mode = modeInput ? modeInput.value : "u";
    const showSpanArea = document.getElementById("showSpanArea");
    const spanConclusion = document.getElementById("spanConclusion");

    const uEnd = logicToScreen(ux, uy);
    const vEnd = logicToScreen(vx2, vy2);

    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(uEnd.x, uEnd.y);
    ctx.stroke();
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
    drawArrowLabel(origin, uEnd, "u");

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
    drawArrowLabel(origin, vEnd, "v");

    const l3uDisplay = document.getElementById("l3uDisplay");
    const l3vDisplay = document.getElementById("l3vDisplay");
    if (l3uDisplay && l3vDisplay) {
      const r = (x) => Math.round(x * 10) / 10;
      l3uDisplay.innerHTML = `<span class="column-vector"><span>${r(ux)}</span><span>${r(uy)}</span></span>`;
      l3vDisplay.innerHTML = `<span class="column-vector"><span>${r(vx2)}</span><span>${r(vy2)}</span></span>`;
    }

    const showArea = showSpanArea && showSpanArea.checked;

    if (mode === "u") {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const k = 5;
      const p1 = logicToScreen(-k * ux, -k * uy);
      const p2 = logicToScreen(k * ux, k * uy);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      if (spanConclusion) {
        spanConclusion.textContent = "当前：Span{u} 是过原点的一条直线（1 维）。";
      }
    } else {
      const det = ux * vy2 - uy * vx2;
      const isCollinear = Math.abs(det) < 1e-5;
      if (isCollinear) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const k = 5;
        const p1 = logicToScreen(-k * ux, -k * uy);
        const p2 = logicToScreen(k * ux, k * uy);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        if (spanConclusion) {
          spanConclusion.textContent = "当前：u 与 v 共线，Span{u, v} 仍然是一条线（1 维）。";
        }
      } else {
        if (showArea) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
          const step = 0.7;
          for (let a = -3; a <= 3; a += step) {
            for (let b = -3; b <= 3; b += step) {
              const x = a * ux + b * vx2;
              const y = a * uy + b * vy2;
              const p = logicToScreen(x, y);
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        if (spanConclusion) {
          spanConclusion.textContent = "当前：u 与 v 不共线，Span{u, v} 可以铺满整个平面（2 维）。";
        }
      }
    }
  }

  window.Lesson3 = {
    id: "lesson3",
    draw,
  };
})();
