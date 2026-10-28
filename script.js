(function () {
  const list = document.getElementById("projects");
  const buttons = document.querySelectorAll(".filters button");
  const fmt = (v, unit) => (Number.isInteger(v) ? v : v.toFixed(1)) + (unit || "");

  function metricHTML(m) {
    const lower = m.lower ? '<span class="lower"> (lower is better)</span>' : "";
    const label = `<div class="metric-label">${m.label}${lower}</div>`;
    if (m.pct) {
      const row = (cls, v, note) =>
        `<div class="bar-row"><span class="note">${note}</span>` +
        `<div class="track"><div class="fill ${cls}" style="width:${Math.max(v, 0.6)}%"></div></div>` +
        `<span class="val ${cls}">${fmt(v, m.unit)}</span></div>`;
      return label + `<div class="bars" role="img" aria-label="${m.label}: ${m.baseNote} ${fmt(m.base, m.unit)}, mine ${fmt(m.mine, m.unit)}">` +
        row("base", m.base, m.baseNote) + row("mine", m.mine, m.mineNote) + "</div>";
    }
    if (m.baseText) {
      return label + `<div class="pair"><span class="from">${m.baseText}</span><span class="to">${m.mineText}</span>` +
        `<span class="notes">${m.baseNote} → ${m.mineNote}</span></div>`;
    }
    return label + `<div class="solo">${m.mineText}</div>`;
  }

  function render(filter) {
    const items = window.PROJECTS.filter(p => filter === "all" || p.areas.includes(filter));
    list.innerHTML = items.map(p => `
      <li class="project">
        <div>
          <h3><a href="https://github.com/aaryanpallath/${p.repo}">${p.name}</a></h3>
          <p>${p.what}</p>
          <div class="stack">${p.stack}</div>
        </div>
        <div class="metric">${metricHTML(p.metric)}</div>
      </li>`).join("");
  }

  buttons.forEach(b => b.addEventListener("click", () => {
    buttons.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    document.body.classList.remove("loaded");      // the draw-in plays only on first load
    render(b.dataset.filter);
  }));

  render("all");
  requestAnimationFrame(() => document.body.classList.add("loaded"));
})();
