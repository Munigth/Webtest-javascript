(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const { PDFDocument, degrees, rgb } = PDFLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const state = { file: null, source: null, pages: [], selected: new Set(), dragIndex: null };
  const els = {
    fileInput: $("fileInput"), drop: $("dropZone"), grid: $("pagesGrid"), empty: $("emptyState"),
    export: $("exportBtn"), status: $("status"), count: $("pageCount"),
    progress: $("progressWrap"), bar: $("progressBar"), progressText: $("progressText")
  };

  function message(text, type = "") {
    els.status.textContent = text;
    els.status.className = "status " + type;
  }

  function updateControls() {
    const hasPages = state.pages.length > 0;
    const hasSelection = state.selected.size > 0;
    $("rotateLeftBtn").disabled = !hasSelection;
    $("rotateRightBtn").disabled = !hasSelection;
    $("duplicateBtn").disabled = !hasSelection;
    $("deleteBtn").disabled = !hasSelection;
    els.export.disabled = !hasPages;
    $("resetBtn").disabled = !state.file;
    $("selectAllBtn").disabled = !hasPages;
    $("clearSelectionBtn").disabled = !hasSelection;
    els.count.textContent = hasPages
      ? `${state.pages.length} page(s) · ${state.selected.size} sélectionnée(s) — glissez pour réorganiser`
      : "Importez un PDF pour afficher ses pages.";
    els.empty.classList.toggle("hidden", hasPages);
    els.grid.classList.toggle("hidden", !hasPages);
  }

  function fmtBytes(n) {
    return n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} Ko` : `${(n / 1024 / 1024).toFixed(2)} Mo`;
  }

  async function loadFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return message("Choisissez un fichier PDF valide.", "error");
    }
    if (file.size > 100 * 1024 * 1024) return message("Le fichier dépasse la limite de 100 Mo.", "error");

    message("Lecture du PDF…");
    els.export.disabled = true;
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: false });
      const preview = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      state.file = file;
      state.source = pdf;
      state.pages = Array.from({ length: pdf.getPageCount() }, (_, index) => ({ index, rotation: 0, thumb: null }));
      state.selected.clear();
      $("fileName").textContent = file.name;
      $("fileMeta").textContent = `${pdf.getPageCount()} pages · ${fmtBytes(file.size)}`;
      $("fileSummary").classList.remove("hidden");
      $("docStatus").textContent = "Document chargé";
      await renderAll(preview);
      message("PDF chargé. Sélectionnez ou faites glisser les pages pour les modifier.", "success");
      updateControls();
    } catch (error) {
      console.error(error);
      message("Impossible de lire ce PDF. Il est peut-être protégé, endommagé ou non pris en charge.", "error");
    }
  }

  async function renderAll(pdf) {
    els.grid.innerHTML = "";
    for (let i = 0; i < state.pages.length; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 0.45 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      state.pages[i].thumb = canvas.toDataURL("image/jpeg", 0.72);
      addCard(i);
    }
  }

  function addCard(i) {
    const page = state.pages[i];
    const card = document.createElement("article");
    card.className = "page-card";
    card.draggable = true;
    card.dataset.index = i;
    if (state.selected.has(i)) card.classList.add("selected");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "page-check";
    check.checked = state.selected.has(i);
    check.setAttribute("aria-label", `Sélectionner la page ${i + 1}`);
    check.addEventListener("click", event => event.stopPropagation());
    check.addEventListener("change", () => toggleSelect(i, check.checked));

    const wrap = document.createElement("div");
    wrap.className = "thumb-wrap";
    const image = document.createElement("img");
    image.src = page.thumb;
    image.alt = `Aperçu de la page ${i + 1}`;
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.transform = `rotate(${page.rotation}deg)`;
    wrap.append(image);

    const footer = document.createElement("div");
    footer.className = "page-card-footer";
    footer.innerHTML = `<span class="page-number">Page ${i + 1}</span><span class="page-badge">${page.rotation ? `${page.rotation}°` : "PDF"}</span>`;
    const remove = document.createElement("button");
    remove.className = "mini-delete";
    remove.type = "button";
    remove.title = "Supprimer cette page";
    remove.textContent = "×";
    remove.addEventListener("click", event => {
      event.stopPropagation();
      state.selected = new Set([i]);
      deleteSelected();
    });

    card.append(check, wrap, footer, remove);
    card.addEventListener("click", () => toggleSelect(i, !state.selected.has(i)));
    card.addEventListener("dragstart", event => {
      state.dragIndex = i;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend", () => {
      state.dragIndex = null;
      document.querySelectorAll(".page-card").forEach(item => item.classList.remove("dragging", "drag-target"));
    });
    card.addEventListener("dragover", event => {
      event.preventDefault();
      card.classList.add("drag-target");
    });
    card.addEventListener("dragleave", () => card.classList.remove("drag-target"));
    card.addEventListener("drop", event => {
      event.preventDefault();
      const from = state.dragIndex;
      const to = Number(card.dataset.index);
      if (from !== null && from !== to) {
        const [moved] = state.pages.splice(from, 1);
        state.pages.splice(to, 0, moved);
        state.selected.clear();
        renderCards();
        updateControls();
      }
    });
    els.grid.append(card);
  }

  function renderCards() {
    els.grid.innerHTML = "";
    state.pages.forEach((_, index) => addCard(index));
  }

  function toggleSelect(index, selected) {
    selected ? state.selected.add(index) : state.selected.delete(index);
    const card = els.grid.querySelector(`[data-index="${index}"]`);
    if (card) {
      card.classList.toggle("selected", selected);
      card.querySelector("input").checked = selected;
    }
    updateControls();
  }

  function mutateSelected(fn) {
    if (!state.selected.size) return;
    [...state.selected].sort((a, b) => a - b).forEach(index => fn(state.pages[index]));
    renderCards();
    updateControls();
  }

  function rotate(deg) {
    mutateSelected(page => page.rotation = (page.rotation + deg + 360) % 360);
  }

  function deleteSelected() {
    if (!state.selected.size) return;
    if (!confirm(`Supprimer ${state.selected.size} page(s) ?`)) return;
    state.pages = state.pages.filter((_, index) => !state.selected.has(index));
    state.selected.clear();
    renderCards();
    updateControls();
    message("Page(s) supprimée(s).", "success");
  }

  function duplicateSelected() {
    const indices = [...state.selected].sort((a, b) => a - b);
    if (!indices.length) return;
    let offset = 0;
    indices.forEach(index => {
      const page = state.pages[index + offset];
      state.pages.splice(index + offset + 1, 0, { ...page });
      offset++;
    });
    state.selected.clear();
    renderCards();
    updateControls();
    message("Page(s) dupliquée(s).", "success");
  }

  function mm(value) { return value * 72 / 25.4; }

  // Les feuilles sont en paysage : chaque moitié correspond à une page du livret.
  // En portrait, la largeur disponible était divisée par deux une seconde fois,
  // ce qui réduisait inutilement le texte (par exemple A4 vers environ 1/2 au lieu de 1/√2).
  function dimensions() {
    const value = $("paperSize").value;
    if (value === "A4") return [841.89, 595.276];
    if (value === "A3") return [1190.55, 841.89];
    return [792, 612]; // Letter paysage
  }

  function bookletPairs(n) {
    const total = Math.ceil(n / 4) * 4;
    const pairs = [];
    for (let i = 0; i < total / 4; i++) {
      pairs.push([total - 1 - 2 * i, 2 * i]);
      pairs.push([2 * i + 1, total - 2 - 2 * i]);
    }
    return pairs;
  }

  async function buildPDF() {
    if (!state.pages.length) return;
    els.export.disabled = true;
    els.progress.classList.remove("hidden");
    els.bar.style.width = "0%";
    message("Création du document…");
    try {
      const out = await PDFDocument.create();
      const [pw, ph] = dimensions();
      const margin = mm(Math.max(0, Number($("margin").value) || 0));
      const gutter = mm(Math.max(0, Number($("gutter").value) || 0));
      const halfW = (pw - 2 * margin - gutter) / 2;
      const halfH = ph - 2 * margin;

      const edited = await PDFDocument.create();
      const copied = await edited.copyPages(state.source, state.source.getPageIndices());
      for (const item of state.pages) {
        const page = copied[item.index];
        const baseRotation = page.getRotation().angle;
        page.setRotation(degrees((baseRotation + item.rotation) % 360));
        edited.addPage(page);
      }

      const embedded = await out.embedPages(edited.getPages());
      const n = embedded.length;
      const padded = Math.ceil(n / 4) * 4;
      const pairs = $("duplexMode").value === "fronts"
        ? Array.from({ length: padded / 4 }, (_, i) => [padded - 1 - 2 * i, 2 * i])
        : bookletPairs(n);

      for (let k = 0; k < pairs.length; k++) {
        const [left, right] = pairs[k];
        const sheet = out.addPage([pw, ph]);
        const draw = (index, x) => {
          if (index >= n) return;
          const page = embedded[index];
          const autoRotate = $("autoRotate").checked;
          const originalW = page.width;
          const originalH = page.height;
          const rotatePage = autoRotate && originalW > originalH;
          const sourceW = rotatePage ? originalH : originalW;
          const sourceH = rotatePage ? originalW : originalH;
          // Conserver les proportions et exploiter au mieux la moitié de feuille.
          const scale = Math.min(halfW / sourceW, halfH / sourceH);
          const width = sourceW * scale;
          const height = sourceH * scale;
          const xPos = x + (halfW - width) / 2;
          const yPos = margin + (halfH - height) / 2;
          sheet.drawPage(page, {
            x: xPos, y: yPos, width, height,
            rotate: degrees(rotatePage ? 90 : 0)
          });
        };

        draw(left, margin);
        draw(right, margin + halfW + gutter);

        if ($("foldLine").checked) {
          for (let y = margin; y < ph - margin; y += 7) {
            sheet.drawLine({ start: { x: pw / 2, y }, end: { x: pw / 2, y: Math.min(y + 3, ph - margin) }, thickness: 0.45, color: rgb(0.55, 0.62, 0.72) });
          }
        }
        if ($("cropMarks").checked) {
          const length = 8;
          for (const x of [margin, pw / 2 + gutter / 2, pw - margin]) {
            sheet.drawLine({ start: { x, y: margin - length }, end: { x, y: margin - 2 }, thickness: 0.5, color: rgb(0.35, 0.4, 0.48) });
            sheet.drawLine({ start: { x, y: ph - margin + 2 }, end: { x, y: ph - margin + length }, thickness: 0.5, color: rgb(0.35, 0.4, 0.48) });
          }
        }
        const percent = Math.round((k + 1) / pairs.length * 90);
        els.bar.style.width = percent + "%";
        els.progressText.textContent = `Imposition des feuilles : ${k + 1}/${pairs.length}`;
      }

      const bytes = await out.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (state.file.name.replace(/\.pdf$/i, "") || "document") + "_livret.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      els.bar.style.width = "100%";
      els.progressText.textContent = "Terminé";
      message("Livret généré et téléchargé. Vérifiez le recto-verso avec une feuille de test.", "success");
    } catch (error) {
      console.error(error);
      message("Erreur pendant la création : " + (error.message || "opération impossible"), "error");
    } finally {
      els.export.disabled = state.pages.length === 0;
      setTimeout(() => els.progress.classList.add("hidden"), 3500);
      updateControls();
    }
  }

  els.fileInput.addEventListener("change", event => loadFile(event.target.files[0]));
  els.drop.addEventListener("dragover", event => { event.preventDefault(); els.drop.classList.add("drag"); });
  els.drop.addEventListener("dragleave", () => els.drop.classList.remove("drag"));
  els.drop.addEventListener("drop", event => {
    event.preventDefault();
    els.drop.classList.remove("drag");
    loadFile(event.dataTransfer.files[0]);
  });
  $("rotateLeftBtn").addEventListener("click", () => rotate(-90));
  $("rotateRightBtn").addEventListener("click", () => rotate(90));
  $("deleteBtn").addEventListener("click", deleteSelected);
  $("duplicateBtn").addEventListener("click", duplicateSelected);
  els.export.addEventListener("click", buildPDF);
  $("selectAllBtn").addEventListener("click", () => {
    state.selected = new Set(state.pages.map((_, index) => index));
    renderCards();
    updateControls();
  });
  $("clearSelectionBtn").addEventListener("click", () => {
    state.selected.clear();
    renderCards();
    updateControls();
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Fermer le document et effacer les modifications ?")) return;
    state.file = null;
    state.source = null;
    state.pages = [];
    state.selected.clear();
    els.grid.innerHTML = "";
    $("fileSummary").classList.add("hidden");
    els.fileInput.value = "";
    $("docStatus").textContent = "En attente";
    message("");
    updateControls();
  });
  document.addEventListener("keydown", event => {
    if ((event.key === "Delete" || event.key === "Backspace") && state.selected.size && !["INPUT", "SELECT"].includes(document.activeElement.tagName)) deleteSelected();
  });

  updateControls();
})();
