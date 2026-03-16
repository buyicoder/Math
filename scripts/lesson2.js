// 第 2 课：两支向量 u、v 与线性组合 w = a·u + b·v
(function () {
  const state = {
    ux: 2,
    uy: 1,
    vx2: -1,
    vy2: 2,
    aCoeff: 1,
    bCoeff: 1,
  };

  function draw(api) {
    const { ctx, origin, logicToScreen, drawGrid, drawArrowLabel } = api;
    const { ux, uy, vx2, vy2, aCoeff, bCoeff } = state;
    drawGrid();

    const uEnd = logicToScreen(ux, uy);
    const vEnd = logicToScreen(vx2, vy2);
    const wx = aCoeff * ux + bCoeff * vx2;
    const wy = aCoeff * uy + bCoeff * vy2;
    const wEnd = logicToScreen(wx, wy);

    const auX = aCoeff * ux;
    const auY = aCoeff * uy;
    const bvX = bCoeff * vx2;
    const bvY = bCoeff * vy2;
    const auEnd = logicToScreen(auX, auY);
    const comboEnd = logicToScreen(auX + bvX, auY + bvY);

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

    drawDashedArrow(origin, auEnd, "rgba(56, 189, 248, 0.6)");
    drawArrowLabel(origin, auEnd, "a·u", "rgba(56, 189, 248, 0.9)");
    drawDashedArrow(auEnd, comboEnd, "rgba(251, 146, 60, 0.6)");
    drawArrowLabel(auEnd, comboEnd, "b·v", "rgba(251, 146, 60, 0.9)");

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
    drawArrowLabel(origin, wEnd, "w = a·u + b·v");

    const uDisplay = document.getElementById("uDisplay");
    const vDisplay = document.getElementById("vDisplay");
    const wDisplay = document.getElementById("wDisplay");
    if (uDisplay && vDisplay && wDisplay) {
      const r = (x) => Math.round(x * 10) / 10;
      uDisplay.innerHTML = `<span class="column-vector"><span>${r(ux)}</span><span>${r(uy)}</span></span>`;
      vDisplay.innerHTML = `<span class="column-vector"><span>${r(vx2)}</span><span>${r(vy2)}</span></span>`;
      wDisplay.innerHTML = `<span class="column-vector"><span>${r(wx)}</span><span>${r(wy)}</span></span>`;
    }
  }

  window.Lesson2 = {
    id: "lesson2",
    get state() {
      return state;
    },
    draw,
  };
})();
