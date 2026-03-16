// 第 1 课：单向量的内部表示与拖动
(function () {
  const vecDisplay = document.getElementById("vecDisplay");
  const lenDisplay = document.getElementById("lenDisplay");

  const state = {
    vx: 3,
    vy: 2,
  };

  function updateVectorText() {
    if (!vecDisplay || !lenDisplay) return;
    const dx = state.vx;
    const dy = state.vy;
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

  function draw(api) {
    const { ctx, origin, logicToScreen, drawGrid, drawArrowLabel } = api;
    drawGrid();

    const end = logicToScreen(state.vx, state.vy);

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

    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

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
    drawArrowLabel(origin, end, "v");

    updateVectorText();
  }

  function setVector(x, y) {
    state.vx = x;
    state.vy = y;
    updateVectorText();
  }

  window.Lesson1 = {
    id: "lesson1",
    get state() {
      return state;
    },
    draw,
    updateVectorText,
    setVector,
  };
})();
