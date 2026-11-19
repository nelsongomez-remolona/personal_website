/* Live specimens for the Maya case study. Each block works without JS as a static render. */
(() => {
  const ICONS = {
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>',
  };
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  /* ---------- button playground ---------- */
  document.querySelectorAll("[data-playground]").forEach((root) => {
    const state = { variant: "outline", color: "primary", size: "sm", state: "enabled", "slot-layout": "mainAndTrailing" };
    const stage = root.querySelector(".pg-stage");
    const code = root.querySelector(".pg-code");

    const attr = (k, v) => `<span class="a">${k}</span>=<span class="v">"${v}"</span>`;
    const render = () => {
      const s = state;
      const lead = s["slot-layout"] === "mainAndLeading";
      const trail = s["slot-layout"] === "mainAndTrailing";
      const disabled = s.state === "disabled" ? " disabled" : "";
      stage.innerHTML =
        `<button class="maya-button" variant="${s.variant}" color="${s.color}" size="${s.size}" state="${s.state}" slot-layout="${s["slot-layout"]}"${disabled}>` +
        (lead ? `<span class="slot">${ICONS.plus}</span>` : "") +
        `<span class="button__content">Confirm</span>` +
        (trail ? `<span class="slot">${ICONS.check}</span>` : "") +
        `</button>`;

      const lines = [
        `&lt;<span class="t">button</span> ${attr("class", "maya-button")} ${attr("variant", s.variant)} ${attr("color", s.color)}`,
        `        ${attr("size", s.size)} ${attr("state", s.state)} ${attr("slot-layout", s["slot-layout"])}&gt;`,
      ];
      const slot = (cls, alias) =>
        `  &lt;<span class="t">span</span> ${attr("class", cls)} ${attr("content-type", "icon")} ${attr("fa-alias", alias)} ${attr("size", "xs")} ${attr("color", "neutral")}&gt;` +
        `&lt;<span class="t">i</span> ${attr("class", "fa fa-" + alias)}&gt;&lt;/<span class="t">i</span>&gt;&lt;/<span class="t">span</span>&gt;`;
      if (lead) lines.push(slot("leadingSlot", "plus"));
      lines.push(`  &lt;<span class="t">span</span> ${attr("class", "button__content")}&gt;Confirm&lt;/<span class="t">span</span>&gt;`);
      if (trail) lines.push(slot("trailingSlot", "check"));
      lines.push(`&lt;/<span class="t">button</span>&gt;`);
      code.innerHTML = lines.join("\n");

      root.querySelectorAll(".seg button").forEach((b) => {
        b.setAttribute("aria-pressed", String(state[b.dataset.prop] === b.dataset.value));
      });
    };

    root.addEventListener("click", (e) => {
      const b = e.target.closest(".seg button");
      if (!b) return;
      state[b.dataset.prop] = b.dataset.value;
      render();
    });
    render();
  });

  /* ---------- column-driven table ---------- */
  const ROWS = [
    { id: "A14581", name: "Pigment Yellow 150", owner: "Albert Innes", status: "In progress", lot: "LOT-2201" },
    { id: "A14582", name: "Hexyl laurate", owner: "Dana Ruiz", status: "Complete", lot: "LOT-2202" },
    { id: "A14583", name: "Ethylhexyl palmitate", owner: "Kei Moto", status: "In progress", lot: "LOT-2203" },
    { id: "A14584", name: "Black 999 dispersion", owner: "Albert Innes", status: "Queued", lot: "LOT-2204" },
  ];
  const initials = (n) => n.split(" ").map((p) => p[0]).join("");
  const CELL = {
    text: (r) => esc(r.name),
    chips: (r) => `<span class="chip${r.status === "Complete" ? " neutral" : ""}">${r.status}</span>`,
    avatarAndText: (r) => `<span class="avatar">${initials(r.owner)}</span>${esc(r.owner)}`,
    links: (r) => `<a class="mlink" href="#" tabindex="-1" onclick="return false">${r.lot}</a>`,
  };
  const HEAD = { text: "Name", chips: "Status", avatarAndText: "Owner", links: "Lot" };

  document.querySelectorAll("[data-coltable]").forEach((root) => {
    const table = root.querySelector(".mtable");
    const cfg = { type: "chips", size: "md" };
    const render = () => {
      table.dataset.size = cfg.size;
      table.querySelector("thead").innerHTML =
        `<tr><th>ID</th><th>Material</th><th>${HEAD[cfg.type]} <code style="font:400 10px var(--mono);color:var(--m-slate-50)">dataColumn type="${cfg.type}"</code></th></tr>`;
      table.querySelector("tbody").innerHTML = ROWS.map((r) =>
        `<tr><td style="font-family:var(--mono);font-size:12px;color:var(--m-slate-40)">${r.id}</td><td>${esc(r.name)}</td><td>${CELL[cfg.type](r)}</td></tr>`
      ).join("");
      root.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(cfg[b.dataset.prop] === b.dataset.value)));
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest(".seg button");
      if (!b) return;
      cfg[b.dataset.prop] = b.dataset.value;
      render();
    });
    render();
  });

  /* ---------- before / after ---------- */
  document.querySelectorAll(".ba").forEach((ba) => {
    const input = ba.querySelector("input");
    const set = () => ba.style.setProperty("--x", input.value + "%");
    input.addEventListener("input", set);
    set();
  });
})();
