// let pdfDoc = null;
// let scale = 0.6;
// let pageNum = 1;
// let activeTool = null;
// let textColor = "rgb(255,0,0)";
// let bgColor = "rgb(255,255,255)";
// let uploadedPdfBytesForPDFJS = null;
// let uploadedPdfBytesForPDFLib = null;
// let selectedBox = null;
// let totalPages = 0;
// let isBgTransparent = false;

// const pdfContainer = document.getElementById("pdf-container");
// const prevPageBtn = document.getElementById("prev-page");
// const nextPageBtn = document.getElementById("next-page");
// const pageNumberInput = document.getElementById("page-number");
// const pageCountSpan = document.getElementById("page-count");

// // TOOL TOGGLE
// document.getElementById("tool-text").addEventListener("click", () => {
//   const btn = document.getElementById("tool-text");
//   if (activeTool === "text") {
//     activeTool = null;
//     btn.classList.remove("active");
//   } else {
//     activeTool = "text";
//     document
//       .querySelectorAll(".tool-btn")
//       .forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//   }
// });

// // COLOR PICKERS
// document.getElementById("text-color").addEventListener("change", (e) => {
//   textColor = e.target.value;
//   if (selectedBox) selectedBox.style.color = textColor;
// });
// document.getElementById("bg-color").addEventListener("change", (e) => {
//   bgColor = e.target.value;
//   if (selectedBox && selectedBox.dataset.bgTransparent !== "true")
//     selectedBox.style.backgroundColor = bgColor;
// });
// const bgTransparentEl = document.getElementById("bg-transparent");
// if (bgTransparentEl) {
//   bgTransparentEl.addEventListener("change", (e) => {
//     isBgTransparent = e.target.checked;
//     if (selectedBox) {
//       selectedBox.dataset.bgTransparent = String(isBgTransparent);
//       selectedBox.style.backgroundColor = isBgTransparent
//         ? "transparent"
//         : bgColor;
//     }
//   });
// }

// // FONT CONTROLS
// document.getElementById("font-size").addEventListener("change", (e) => {
//   if (selectedBox) selectedBox.style.fontSize = e.target.value + "px";
// });
// document.getElementById("font-weight").addEventListener("change", (e) => {
//   if (selectedBox) selectedBox.style.fontWeight = e.target.value;
// });
// document.getElementById("font-style").addEventListener("change", (e) => {
//   if (selectedBox) selectedBox.dataset.fontStyle = e.target.value;
// });
// document.getElementById("font-family").addEventListener("change", (e) => {
//   if (selectedBox) selectedBox.style.fontFamily = e.target.value;
// });

// // LOAD PDF
// document.getElementById("pdf-upload").addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onload = async function () {
//     const arrayBuffer = reader.result;
//     uploadedPdfBytesForPDFJS = arrayBuffer.slice(0);
//     uploadedPdfBytesForPDFLib = arrayBuffer.slice(0);

//     try {
//       pdfDoc = await pdfjsLib.getDocument(uploadedPdfBytesForPDFJS).promise;
//       totalPages = pdfDoc.numPages || 1;
//       pageNum = 1;

//       // remove overlays from any previous document
//       document.querySelectorAll(".text-box").forEach((el) => el.remove());
//       selectedBox = null;

//       // update UI
//       if (pageCountSpan) pageCountSpan.textContent = "/ " + totalPages;
//       if (pageNumberInput) {
//         pageNumberInput.value = String(pageNum);
//         pageNumberInput.min = "1";
//         pageNumberInput.max = String(totalPages);
//       }

//       await renderPage(pageNum);
//       updateOverlayVisibility();
//       updatePageUI();
//     } catch (err) {
//       console.error("PDF.js failed to load:", err);
//       alert("Failed to render PDF. Make sure it's a valid PDF.");
//     }
//   };
//   reader.readAsArrayBuffer(file);
// });

// async function renderPage(num) {
//   const page = await pdfDoc.getPage(num);
//   const viewport = page.getViewport({ scale });

//   pdfContainer.style.width = viewport.width + "px";
//   pdfContainer.style.height = viewport.height + "px";

//   // reuse a single canvas for rendering
//   const canvases = pdfContainer.getElementsByTagName("canvas");
//   let canvas = canvases.length ? canvases[0] : null;
//   if (!canvas) {
//     canvas = document.createElement("canvas");
//     pdfContainer.insertBefore(canvas, pdfContainer.firstChild);
//   } else {
//     // clean up any extra canvases if they exist
//     for (let i = 1; i < canvases.length; i++) {
//       canvases[i].remove();
//     }
//   }

//   canvas.width = viewport.width;
//   canvas.height = viewport.height;

//   const ctx = canvas.getContext("2d");
//   await page.render({ canvasContext: ctx, viewport }).promise;
// }

// function updateOverlayVisibility() {
//   const boxes = document.querySelectorAll(".text-box");
//   boxes.forEach((div) => {
//     const divPage = parseInt(div.dataset.page || "1", 10);
//     div.style.visibility = divPage === pageNum ? "visible" : "hidden";
//   });
// }

// function updatePageUI() {
//   if (pageNumberInput) pageNumberInput.value = String(pageNum);
//   if (pageCountSpan) pageCountSpan.textContent = "/ " + (totalPages || 1);
//   if (prevPageBtn) prevPageBtn.disabled = pageNum <= 1;
//   if (nextPageBtn)
//     nextPageBtn.disabled = totalPages ? pageNum >= totalPages : false;
// }

// function clampPage(n) {
//   if (!totalPages) return 1;
//   if (n < 1) return 1;
//   if (n > totalPages) return totalPages;
//   return n;
// }

// async function goToPage(targetPage) {
//   if (!pdfDoc) return;
//   const next = clampPage(targetPage);
//   if (next === pageNum) return;
//   pageNum = next;
//   await renderPage(pageNum);
//   selectedBox = null;
//   updateOverlayVisibility();
//   updatePageUI();
// }

// // NAVIGATION EVENTS
// if (prevPageBtn) {
//   prevPageBtn.addEventListener("click", async () => {
//     if (!pdfDoc) return;
//     await goToPage(pageNum - 1);
//   });
// }
// if (nextPageBtn) {
//   nextPageBtn.addEventListener("click", async () => {
//     if (!pdfDoc) return;
//     await goToPage(pageNum + 1);
//   });
// }
// if (pageNumberInput) {
//   pageNumberInput.addEventListener("change", async (e) => {
//     if (!pdfDoc) return;
//     const val = parseInt(e.target.value, 10) || 1;
//     await goToPage(val);
//   });
// }

// // ADD / SELECT TEXT BOX
// pdfContainer.addEventListener("click", (e) => {
//   if (activeTool !== "text") return;
//   const rect = pdfContainer.getBoundingClientRect();

//   if (e.target.classList.contains("text-box")) {
//     selectedBox = e.target;
//     selectedBox.focus();
//     // reflect transparent state in UI
//     const tEl = document.getElementById("bg-transparent");
//     if (tEl) tEl.checked = selectedBox.dataset.bgTransparent === "true";
//     return;
//   }

//   const scrollLeft = pdfContainer.scrollLeft;
//   const scrollTop = pdfContainer.scrollTop;

//   const div = document.createElement("div");
//   div.className = "text-box";
//   div.contentEditable = true;
//   div.style.top = e.clientY - rect.top + scrollTop + "px";
//   div.style.left = e.clientX - rect.left + scrollLeft + "px";
//   div.style.color = textColor;
//   div.style.backgroundColor = isBgTransparent ? "transparent" : bgColor;
//   div.style.fontSize = document.getElementById("font-size").value + "px";
//   div.style.fontWeight = document.getElementById("font-weight").value;
//   div.dataset.fontStyle = document.getElementById("font-style").value;
//   div.style.fontFamily = document.getElementById("font-family").value;
//   div.dataset.page = String(pageNum);
//   div.dataset.bgTransparent = String(isBgTransparent);
//   div.innerText = "Text";

//   makeDraggable(div);
//   pdfContainer.appendChild(div);
//   div.focus();
//   selectedBox = div;
// });

// // DRAG FUNCTION
// function makeDraggable(el) {
//   let isDragging = false;
//   let shiftX = 0;
//   let shiftY = 0;

//   function onPointerDown(e) {
//     // left button or touch/pen
//     if (e.button !== undefined && e.button !== 0) return;
//     e.preventDefault();

//     const rect = el.getBoundingClientRect();
//     shiftX = e.clientX - rect.left;
//     shiftY = e.clientY - rect.top;

//     isDragging = true;
//     el.style.userSelect = "none";
//     if (el.setPointerCapture) {
//       try {
//         el.setPointerCapture(e.pointerId);
//       } catch (_) {}
//     }
//   }

//   function onPointerMove(e) {
//     if (!isDragging) return;
//     const containerRect = pdfContainer.getBoundingClientRect();

//     let left =
//       e.clientX - containerRect.left - shiftX + pdfContainer.scrollLeft;
//     let top = e.clientY - containerRect.top - shiftY + pdfContainer.scrollTop;

//     // clamp to container bounds
//     const maxLeft = Math.max(0, pdfContainer.scrollWidth - el.offsetWidth);
//     const maxTop = Math.max(0, pdfContainer.scrollHeight - el.offsetHeight);
//     if (left < 0) left = 0;
//     if (top < 0) top = 0;
//     if (left > maxLeft) left = maxLeft;
//     if (top > maxTop) top = maxTop;

//     el.style.left = left + "px";
//     el.style.top = top + "px";
//   }

//   function onPointerUp(e) {
//     if (!isDragging) return;
//     isDragging = false;
//     el.style.userSelect = "text";
//     if (el.releasePointerCapture) {
//       try {
//         el.releasePointerCapture(e.pointerId);
//       } catch (_) {}
//     }
//   }

//   el.addEventListener("pointerdown", onPointerDown);
//   el.addEventListener("pointermove", onPointerMove);
//   el.addEventListener("pointerup", onPointerUp);
//   el.addEventListener("pointercancel", onPointerUp);

//   el.ondragstart = () => false;
// }

// // HELPER: parse rgb string -> {r,g,b}
// function parseRGB(rgbStr) {
//   const nums = rgbStr.match(/\d+/g);
//   if (!nums) return { r: 0, g: 0, b: 0 };
//   return { r: +nums[0] / 255, g: +nums[1] / 255, b: +nums[2] / 255 };
// }

// // FONT MAP
// const fontMap = {
//   Helvetica: PDFLib.StandardFonts.Helvetica,
//   "Helvetica-Bold": PDFLib.StandardFonts.HelveticaBold,
//   "Helvetica-Oblique": PDFLib.StandardFonts.HelveticaOblique,
//   "Helvetica-BoldOblique": PDFLib.StandardFonts.HelveticaBoldOblique,
//   TimesRoman: PDFLib.StandardFonts.TimesRoman,
//   "Times-Bold": PDFLib.StandardFonts.TimesBold,
//   "Times-Italic": PDFLib.StandardFonts.TimesItalic,
//   "Times-BoldItalic": PDFLib.StandardFonts.TimesBoldItalic,
//   Courier: PDFLib.StandardFonts.Courier,
//   "Courier-Bold": PDFLib.StandardFonts.CourierBold,
//   "Courier-Oblique": PDFLib.StandardFonts.CourierOblique,
//   "Courier-BoldOblique": PDFLib.StandardFonts.CourierBoldOblique,
//   Symbol: PDFLib.StandardFonts.Symbol,
//   ZapfDingbats: PDFLib.StandardFonts.ZapfDingbats,
// };

// // GET PDF FONT KEY
// function getPdfFontKey(family, weight, style) {
//   let key = family;

//   // Map normal/italic/oblique correctly
//   const isItalic = style === "italic";
//   const isBold = weight === "bold";

//   if (isBold && isItalic) key += "-BoldOblique";
//   else if (isBold) key += "-Bold";
//   else if (isItalic) key += "-Oblique";

//   return key;
// }

// // EXPORT PDF
// document.getElementById("download").addEventListener("click", async () => {
//   if (!uploadedPdfBytesForPDFLib) return alert("Upload a PDF first");

//   try {
//     const pdfLibDoc = await PDFLib.PDFDocument.load(uploadedPdfBytesForPDFLib);
//     const pages = pdfLibDoc.getPages();
//     const scaleFactor = scale; // match the render scale

//     const textBoxes = Array.from(document.querySelectorAll(".text-box"));
//     const fontCache = {};

//     for (const div of textBoxes) {
//       const style = window.getComputedStyle(div);
//       const fontSize = parseFloat(style.fontSize) / scaleFactor;
//       const family = div.style.fontFamily || "Helvetica";

//       const computedWeight = style.fontWeight || "normal";
//       const isBold =
//         computedWeight === "bold" ||
//         (!isNaN(parseInt(computedWeight, 10)) &&
//           parseInt(computedWeight, 10) >= 600);
//       const weight = isBold ? "bold" : "normal";

//       const fontStyle = div.dataset.fontStyle || "normal";

//       const pdfFontKey = getPdfFontKey(family, weight, fontStyle);
//       const pdfFontName = fontMap[pdfFontKey] || PDFLib.StandardFonts.Helvetica;

//       if (!fontCache[pdfFontName]) {
//         fontCache[pdfFontName] = await pdfLibDoc.embedFont(pdfFontName);
//       }
//       const pdfFont = fontCache[pdfFontName];

//       const pageIndex = Math.max(
//         0,
//         Math.min(pages.length - 1, parseInt(div.dataset.page || "1", 10) - 1)
//       );
//       const page = pages[pageIndex];
//       const { width, height } = page.getSize();

//       const x = parseFloat(div.style.left) / scaleFactor;
//       const y =
//         height -
//         parseFloat(div.style.top) / scaleFactor -
//         div.offsetHeight / scaleFactor;

//       // background (skip if transparent)
//       const isTransparent = div.dataset.bgTransparent === "true";
//       if (!isTransparent) {
//         const bg = parseRGB(div.style.backgroundColor || "rgb(255,255,255)");
//         page.drawRectangle({
//           x,
//           y,
//           width: div.offsetWidth / scaleFactor,
//           height: div.offsetHeight / scaleFactor,
//           color: PDFLib.rgb(bg.r, bg.g, bg.b),
//         });
//       }

//       // text alignment
//       const text = div.innerText;
//       const textWidth = pdfFont.widthOfTextAtSize(text, fontSize);
//       let drawX = x;
//       if (style.textAlign === "center")
//         drawX = x + (div.offsetWidth / scaleFactor - textWidth) / 2;
//       if (style.textAlign === "right")
//         drawX = x + (div.offsetWidth / scaleFactor - textWidth);

//       const txtColor = parseRGB(div.style.color || "rgb(0,0,0)");
//       page.drawText(text, {
//         x: drawX,
//         y: y + div.offsetHeight / scaleFactor - fontSize,
//         size: fontSize,
//         font: pdfFont,
//         color: PDFLib.rgb(txtColor.r, txtColor.g, txtColor.b),
//       });
//     }

//     const newPdfBytes = await pdfLibDoc.save();
//     const blob = new Blob([newPdfBytes], { type: "application/pdf" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "edited.pdf";
//     link.click();
//   } catch (err) {
//     console.error("pdf-lib failed:", err);
//     alert("Export failed. See console.");
//   }
// });

let pdfDoc = null;
let scale = 0.6;
let pageNum = 1;
let activeTool = null;
let textColor = "rgb(255,0,0)";
let bgColor = "rgb(255,255,255)";
let uploadedPdfBytesForPDFJS = null;
let uploadedPdfBytesForPDFLib = null;
let selectedBox = null;
let totalPages = 0;
let isBgTransparent = false;

const pdfContainer = document.getElementById("pdf-container");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageNumberInput = document.getElementById("page-number");
const pageCountSpan = document.getElementById("page-count");

// SHAPE TOOL LOGIC
let currentShape = null;
let startX, startY;
let tempShapeEl = null;
let shapePageWrapper = null;

let selectedShape = null;

pdfContainer.addEventListener("mousedown", (e) => {
  if (activeTool !== "shape") return;

  // If clicking existing overlay (shape/text/handle), do not start drawing
  if (
    e.target &&
    e.target.closest &&
    (e.target.closest(".resize-handle") ||
      e.target.closest(".shape-box") ||
      e.target.closest(".text-box") ||
      e.target.closest(".delete-handle"))
  ) {
    return;
  }

  // locate active page wrapper
  shapePageWrapper = document.querySelector(`#page-${pageNum}`);
  if (!shapePageWrapper) return;

  // read shape controls (with fallbacks)
  const typeEl =
    document.getElementById("shape-type") ||
    document.getElementById("shape-tool");
  const borderEl = document.getElementById("shape-border");
  const fillEl = document.getElementById("shape-fill");
  const fillTransparentEl = document.getElementById("shape-fill-transparent");

  const shapeType = (typeEl && typeEl.value) || "rect";
  const borderColor = (borderEl && borderEl.value) || "#000000";
  const isFillTransparent = !!(fillTransparentEl && fillTransparentEl.checked);
  const fillColor = isFillTransparent
    ? "transparent"
    : (fillEl && fillEl.value) || "#ffffff";

  const rect = shapePageWrapper.getBoundingClientRect();
  const scrollLeft = pdfContainer.scrollLeft;
  const scrollTop = pdfContainer.scrollTop;
  startX = e.clientX - rect.left + scrollLeft;
  startY = e.clientY - rect.top + scrollTop;

  tempShapeEl = document.createElement("div");
  tempShapeEl.classList.add("shape-box");
  tempShapeEl.style.position = "absolute";
  tempShapeEl.style.left = startX + "px";
  tempShapeEl.style.top = startY + "px";

  if (shapeType === "line") {
    tempShapeEl.style.height = "2px";
    tempShapeEl.style.width = "0px";
    tempShapeEl.style.backgroundColor = borderColor;
    tempShapeEl.style.border = "none";
  } else {
    tempShapeEl.style.border = `2px solid ${borderColor}`;
    tempShapeEl.style.backgroundColor = fillColor;
    if (shapeType === "circle") {
      tempShapeEl.style.borderRadius = "50%";
    }
  }

  tempShapeEl.dataset.shape = shapeType;
  tempShapeEl.dataset.page = String(pageNum);
  shapePageWrapper.appendChild(tempShapeEl);
});

pdfContainer.addEventListener("mousemove", (e) => {
  if (!tempShapeEl || !shapePageWrapper) return;
  const shapeType = tempShapeEl.dataset.shape;

  const rect = shapePageWrapper.getBoundingClientRect();
  const scrollLeft = pdfContainer.scrollLeft;
  const scrollTop = pdfContainer.scrollTop;
  const currX = e.clientX - rect.left + scrollLeft;
  const currY = e.clientY - rect.top + scrollTop;

  const width = currX - startX;
  const height = currY - startY;

  tempShapeEl.style.left = Math.min(startX, currX) + "px";
  tempShapeEl.style.top = Math.min(startY, currY) + "px";

  if (shapeType === "line") {
    tempShapeEl.style.width = Math.abs(width) + "px";
  } else {
    tempShapeEl.style.width = Math.abs(width) + "px";
    tempShapeEl.style.height = Math.abs(height) + "px";
  }
});

pdfContainer.addEventListener("mouseup", () => {
  if (!tempShapeEl) return;

  // Enforce larger default size if drawn too small
  const type = tempShapeEl.dataset.shape || "rect";
  let minW = 160;
  let minH = 100;
  if (type === "line") {
    minW = 120;
    minH = 2;
  } else if (type === "circle") {
    minW = 120;
    minH = 120;
  }
  if (tempShapeEl.offsetWidth < minW) tempShapeEl.style.width = minW + "px";
  if (tempShapeEl.offsetHeight < minH) tempShapeEl.style.height = minH + "px";

  makeDraggable(tempShapeEl);
  addResizeHandle(tempShapeEl);
  addDeleteHandle(tempShapeEl);
  selectShape(tempShapeEl);
  tempShapeEl = null;
  shapePageWrapper = null;
});

// ADD RESIZE HANDLE
function addResizeHandle(el) {
  // avoid duplicates
  if (el.querySelector && el.querySelector(".resize-handle")) return;

  const handle = document.createElement("div");
  handle.classList.add("resize-handle");
  el.appendChild(handle);

  let startW, startH, startX, startY;
  const isLine = el.dataset.shape === "line";

  function onPointerDown(e) {
    e.stopPropagation();
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startW = el.offsetWidth;
    startH = el.offsetHeight;
    if (handle.setPointerCapture) {
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp, { once: true });
  }

  function onPointerMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const minW = 40;
    const minH = isLine ? 2 : 24;
    const newW = Math.max(minW, startW + dx);
    const newH = isLine ? 2 : Math.max(minH, startH + dy);
    el.style.width = newW + "px";
    if (!isLine) el.style.height = newH + "px";
  }

  function onPointerUp(e) {
    document.removeEventListener("pointermove", onPointerMove);
    if (handle.releasePointerCapture) {
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  }

  handle.addEventListener("pointerdown", onPointerDown);
}

// Select a shape helper
function selectShape(el) {
  if (selectedShape && selectedShape !== el) {
    selectedShape.classList.remove("selected");
  }
  selectedShape = el;
  if (selectedShape) {
    selectedShape.classList.add("selected");
  }
}
// Click to select existing shapes
pdfContainer.addEventListener("click", (e) => {
  if (!e.target || !e.target.closest) return;
  const shapeEl = e.target.closest(".shape-box");
  if (shapeEl) selectShape(shapeEl);
});

// TOOL TOGGLE
document.getElementById("tool-text").addEventListener("click", () => {
  const btn = document.getElementById("tool-text");
  if (activeTool === "text") {
    activeTool = null;
    btn.classList.remove("active");
  } else {
    activeTool = "text";
    document
      .querySelectorAll(".tool-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
});

const shapeToolBtn = document.getElementById("tool-shape");
if (shapeToolBtn) {
  shapeToolBtn.addEventListener("click", () => {
    if (activeTool === "shape") {
      activeTool = null;
      shapeToolBtn.classList.remove("active");
    } else {
      activeTool = "shape";
      document
        .querySelectorAll(".tool-btn")
        .forEach((b) => b.classList.remove("active"));
      shapeToolBtn.classList.add("active");
    }
  });
}

// COLOR PICKERS
document.getElementById("text-color").addEventListener("change", (e) => {
  textColor = e.target.value;
  if (selectedBox) selectedBox.style.color = textColor;
});
document.getElementById("bg-color").addEventListener("change", (e) => {
  bgColor = e.target.value;
  if (selectedBox && selectedBox.dataset.bgTransparent !== "true")
    selectedBox.style.backgroundColor = bgColor;
});
const bgTransparentEl = document.getElementById("bg-transparent");
if (bgTransparentEl) {
  bgTransparentEl.addEventListener("change", (e) => {
    isBgTransparent = e.target.checked;
    if (selectedBox) {
      selectedBox.dataset.bgTransparent = String(isBgTransparent);
      selectedBox.style.backgroundColor = isBgTransparent
        ? "transparent"
        : bgColor;
    }
  });
}

// FONT CONTROLS
document.getElementById("font-size").addEventListener("change", (e) => {
  if (selectedBox) selectedBox.style.fontSize = e.target.value + "px";
});
document.getElementById("font-weight").addEventListener("change", (e) => {
  if (selectedBox) selectedBox.style.fontWeight = e.target.value;
});
document.getElementById("font-style").addEventListener("change", (e) => {
  if (selectedBox) selectedBox.dataset.fontStyle = e.target.value;
});
document.getElementById("font-family").addEventListener("change", (e) => {
  if (selectedBox) selectedBox.style.fontFamily = e.target.value;
});

// LOAD PDF
document.getElementById("pdf-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function () {
    const arrayBuffer = reader.result;
    uploadedPdfBytesForPDFJS = arrayBuffer.slice(0);
    uploadedPdfBytesForPDFLib = arrayBuffer.slice(0);

    try {
      pdfDoc = await pdfjsLib.getDocument(uploadedPdfBytesForPDFJS).promise;
      totalPages = pdfDoc.numPages || 1;
      pageNum = 1;

      pdfContainer.innerHTML = ""; // clear old pages
      selectedBox = null;

      if (pageCountSpan) pageCountSpan.textContent = "/ " + totalPages;
      if (pageNumberInput) {
        pageNumberInput.value = String(pageNum);
        pageNumberInput.min = "1";
        pageNumberInput.max = String(totalPages);
      }

      await renderPage(pageNum);
      updatePageUI();
    } catch (err) {
      console.error("PDF.js failed to load:", err);
      alert("Failed to render PDF. Make sure it's a valid PDF.");
    }
  };
  reader.readAsArrayBuffer(file);
});

// RENDER PAGE (now with per-page wrapper)
async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale });

  let pageWrapper = document.querySelector(`#page-${num}`);
  if (!pageWrapper) {
    pageWrapper = document.createElement("div");
    pageWrapper.id = `page-${num}`;
    pageWrapper.className = "page-wrapper relative";
    pageWrapper.dataset.page = num;
    pdfContainer.appendChild(pageWrapper);
  }

  pageWrapper.style.width = viewport.width + "px";
  pageWrapper.style.height = viewport.height + "px";

  // show only this page
  document.querySelectorAll(".page-wrapper").forEach((p) => {
    p.style.display = p.dataset.page == num ? "block" : "none";
  });

  // canvas rendering
  let canvas = pageWrapper.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    pageWrapper.insertBefore(canvas, pageWrapper.firstChild);
  }
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;
}

function updatePageUI() {
  if (pageNumberInput) pageNumberInput.value = String(pageNum);
  if (pageCountSpan) pageCountSpan.textContent = "/ " + (totalPages || 1);
  if (prevPageBtn) prevPageBtn.disabled = pageNum <= 1;
  if (nextPageBtn)
    nextPageBtn.disabled = totalPages ? pageNum >= totalPages : false;
}

function clampPage(n) {
  if (!totalPages) return 1;
  if (n < 1) return 1;
  if (n > totalPages) return totalPages;
  return n;
}

async function goToPage(targetPage) {
  if (!pdfDoc) return;
  const next = clampPage(targetPage);
  if (next === pageNum) return;
  pageNum = next;
  await renderPage(pageNum);
  selectedBox = null;
  updatePageUI();
}

// NAVIGATION EVENTS
if (prevPageBtn) {
  prevPageBtn.addEventListener("click", async () => {
    if (!pdfDoc) return;
    await goToPage(pageNum - 1);
  });
}
if (nextPageBtn) {
  nextPageBtn.addEventListener("click", async () => {
    if (!pdfDoc) return;
    await goToPage(pageNum + 1);
  });
}
if (pageNumberInput) {
  pageNumberInput.addEventListener("change", async (e) => {
    if (!pdfDoc) return;
    const val = parseInt(e.target.value, 10) || 1;
    await goToPage(val);
  });
}

// ADD / SELECT TEXT BOX
pdfContainer.addEventListener("click", (e) => {
  if (activeTool !== "text") return;
  const pageWrapper = document.querySelector(`#page-${pageNum}`);
  if (!pageWrapper) return;

  if (e.target.classList.contains("text-box")) {
    selectedBox = e.target;
    addDeleteHandle(selectedBox);
    selectedBox.focus();
    const tEl = document.getElementById("bg-transparent");
    if (tEl) tEl.checked = selectedBox.dataset.bgTransparent === "true";
    return;
  }

  const rect = pageWrapper.getBoundingClientRect();
  const scrollLeft = pdfContainer.scrollLeft;
  const scrollTop = pdfContainer.scrollTop;

  const div = document.createElement("div");
  div.className = "text-box";
  div.contentEditable = true;
  div.style.top = e.clientY - rect.top + scrollTop + "px";
  div.style.left = e.clientX - rect.left + scrollLeft + "px";
  div.style.color = textColor;
  div.style.backgroundColor = isBgTransparent ? "transparent" : bgColor;
  // larger default size
  div.style.width = "180px";
  div.style.height = "48px";
  div.style.fontSize = document.getElementById("font-size").value + "px";
  div.style.fontWeight = document.getElementById("font-weight").value;
  div.dataset.fontStyle = document.getElementById("font-style").value;
  div.style.fontFamily = document.getElementById("font-family").value;
  div.dataset.page = String(pageNum);
  div.dataset.bgTransparent = String(isBgTransparent);
  div.innerText = "Text";

  makeDraggable(div);
  addResizeHandle(div);
  addDeleteHandle(div);
  pageWrapper.appendChild(div);
  div.focus();
  selectedBox = div;
});

// DRAG FUNCTION
function makeDraggable(el) {
  let isDragging = false;
  let shiftX = 0;
  let shiftY = 0;

  function onPointerDown(e) {
    // ignore if starting on resize or delete handle
    if (
      e.target &&
      e.target.closest &&
      (e.target.closest(".resize-handle") || e.target.closest(".delete-handle"))
    ) {
      return;
    }
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();

    const rect = el.getBoundingClientRect();
    shiftX = e.clientX - rect.left;
    shiftY = e.clientY - rect.top;
    isDragging = true;
    el.style.userSelect = "none";

    // capture if supported
    if (el.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    // also listen on document for robustness
    document.addEventListener("pointermove", onDocPointerMove);
    document.addEventListener("pointerup", onDocPointerUp, { once: true });
  }

  function onDocPointerMove(e) {
    if (!isDragging) return;

    const parent = el.parentElement || pdfContainer;
    const parentRect = parent.getBoundingClientRect();

    // parent may not scroll; pdfContainer does
    const left = e.clientX - parentRect.left - shiftX + pdfContainer.scrollLeft;
    const top = e.clientY - parentRect.top - shiftY + pdfContainer.scrollTop;

    // clamp within parent dimensions
    const maxLeft = Math.max(0, (parent.clientWidth || 0) - el.offsetWidth);
    const maxTop = Math.max(0, (parent.clientHeight || 0) - el.offsetHeight);

    let clampedLeft = left;
    let clampedTop = top;
    if (clampedLeft < 0) clampedLeft = 0;
    if (clampedTop < 0) clampedTop = 0;
    if (clampedLeft > maxLeft) clampedLeft = maxLeft;
    if (clampedTop > maxTop) clampedTop = maxTop;

    el.style.left = clampedLeft + "px";
    el.style.top = clampedTop + "px";
  }

  function onDocPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    el.style.userSelect = "text";
    if (el.releasePointerCapture) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    document.removeEventListener("pointermove", onDocPointerMove);
  }

  el.addEventListener("pointerdown", onPointerDown);
  el.ondragstart = () => false;
}

// Add delete handle to shapes
function addDeleteHandle(el) {
  if (el.querySelector && el.querySelector(".delete-handle")) return;
  const del = document.createElement("div");
  del.classList.add("delete-handle");
  del.textContent = "×";
  el.appendChild(del);
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (selectedShape === el) selectedShape = null;
    if (selectedBox === el) selectedBox = null;
    if (el.parentElement) el.parentElement.removeChild(el);
  });
}

// HELPER: parse rgb string -> {r,g,b}
function parseRGB(rgbStr) {
  const nums = rgbStr.match(/\d+/g);
  if (!nums) return { r: 0, g: 0, b: 0 };
  return { r: +nums[0] / 255, g: +nums[1] / 255, b: +nums[2] / 255 };
}

function isTransparentColor(colorStr) {
  if (!colorStr) return true;
  const s = colorStr.replace(/\s+/g, "").toLowerCase();
  return s === "transparent" || s === "rgba(0,0,0,0)";
}

// FONT MAP + EXPORT remain same -----------------------
const fontMap = {
  Helvetica: PDFLib.StandardFonts.Helvetica,
  "Helvetica-Bold": PDFLib.StandardFonts.HelveticaBold,
  "Helvetica-Oblique": PDFLib.StandardFonts.HelveticaOblique,
  "Helvetica-BoldOblique": PDFLib.StandardFonts.HelveticaBoldOblique,
  TimesRoman: PDFLib.StandardFonts.TimesRoman,
  "Times-Bold": PDFLib.StandardFonts.TimesBold,
  "Times-Italic": PDFLib.StandardFonts.TimesItalic,
  "Times-BoldItalic": PDFLib.StandardFonts.TimesBoldItalic,
  Courier: PDFLib.StandardFonts.Courier,
  "Courier-Bold": PDFLib.StandardFonts.CourierBold,
  "Courier-Oblique": PDFLib.StandardFonts.CourierOblique,
  "Courier-BoldOblique": PDFLib.StandardFonts.CourierBoldOblique,
  Symbol: PDFLib.StandardFonts.Symbol,
  ZapfDingbats: PDFLib.StandardFonts.ZapfDingbats,
};

function getPdfFontKey(family, weight, style) {
  let key = family;
  const isItalic = style === "italic";
  const isBold = weight === "bold";
  if (isBold && isItalic) key += "-BoldOblique";
  else if (isBold) key += "-Bold";
  else if (isItalic) key += "-Oblique";
  return key;
}

document.getElementById("download").addEventListener("click", async () => {
  if (!uploadedPdfBytesForPDFLib) return alert("Upload a PDF first");
  try {
    const pdfLibDoc = await PDFLib.PDFDocument.load(uploadedPdfBytesForPDFLib);
    const pages = pdfLibDoc.getPages();
    const scaleFactor = scale;
    const textBoxes = Array.from(document.querySelectorAll(".text-box"));
    const fontCache = {};

    for (const div of textBoxes) {
      const style = window.getComputedStyle(div);
      const fontSize = parseFloat(style.fontSize) / scaleFactor;
      const family = div.style.fontFamily || "Helvetica";
      const computedWeight = style.fontWeight || "normal";
      const isBold =
        computedWeight === "bold" ||
        (!isNaN(parseInt(computedWeight, 10)) &&
          parseInt(computedWeight, 10) >= 600);
      const weight = isBold ? "bold" : "normal";
      const fontStyle = div.dataset.fontStyle || "normal";
      const pdfFontKey = getPdfFontKey(family, weight, fontStyle);
      const pdfFontName = fontMap[pdfFontKey] || PDFLib.StandardFonts.Helvetica;
      if (!fontCache[pdfFontName]) {
        fontCache[pdfFontName] = await pdfLibDoc.embedFont(pdfFontName);
      }
      const pdfFont = fontCache[pdfFontName];
      const pageIndex = Math.max(
        0,
        Math.min(pages.length - 1, parseInt(div.dataset.page || "1", 10) - 1)
      );
      const page = pages[pageIndex];
      const { width, height } = page.getSize();
      const x = parseFloat(div.style.left) / scaleFactor;
      const y =
        height -
        parseFloat(div.style.top) / scaleFactor -
        div.offsetHeight / scaleFactor;
      if (div.dataset.bgTransparent !== "true") {
        const bg = parseRGB(div.style.backgroundColor || "rgb(255,255,255)");
        page.drawRectangle({
          x,
          y,
          width: div.offsetWidth / scaleFactor,
          height: div.offsetHeight / scaleFactor,
          color: PDFLib.rgb(bg.r, bg.g, bg.b),
        });
      }
      let text;
      {
        const clone = div.cloneNode(true);
        if (clone.querySelectorAll) {
          clone.querySelectorAll(".delete-handle").forEach((h) => h.remove());
        }
        text = clone.innerText;
      }
      const textWidth = pdfFont.widthOfTextAtSize(text, fontSize);
      let drawX = x;
      if (style.textAlign === "center")
        drawX = x + (div.offsetWidth / scaleFactor - textWidth) / 2;
      if (style.textAlign === "right")
        drawX = x + (div.offsetWidth / scaleFactor - textWidth);
      const txtColor = parseRGB(div.style.color || "rgb(0,0,0)");
      page.drawText(text, {
        x: drawX,
        y: y + div.offsetHeight / scaleFactor - fontSize,
        size: fontSize,
        font: pdfFont,
        color: PDFLib.rgb(txtColor.r, txtColor.g, txtColor.b),
      });
    }

    // Export shapes
    const shapeBoxes = Array.from(document.querySelectorAll(".shape-box"));
    for (const shape of shapeBoxes) {
      const style = window.getComputedStyle(shape);
      const pageIndex = Math.max(
        0,
        Math.min(pages.length - 1, parseInt(shape.dataset.page || "1", 10) - 1)
      );
      const page = pages[pageIndex];
      const { width, height } = page.getSize();
      const x = parseFloat(shape.style.left) / scaleFactor;
      const y =
        height -
        parseFloat(shape.style.top) / scaleFactor -
        shape.offsetHeight / scaleFactor;
      const w = shape.offsetWidth / scaleFactor;
      const h = shape.offsetHeight / scaleFactor;
      const type = shape.dataset.shape || "rect";

      const fillCss = style.backgroundColor;
      const borderCss = style.borderTopColor;
      const borderWidthPx = parseFloat(style.borderTopWidth || "0");
      const borderWidth = isNaN(borderWidthPx)
        ? 0
        : borderWidthPx / scaleFactor;

      const fillIsTransparent = isTransparentColor(fillCss);
      const borderColorRgb = parseRGB(borderCss || "rgb(0,0,0)");
      const fillRgb = parseRGB(fillCss || "rgb(255,255,255)");

      if (type === "line") {
        // Represent line as a filled rectangle of height h and width w
        const lineRgb = parseRGB(fillCss || "rgb(0,0,0)");
        page.drawRectangle({
          x,
          y,
          width: w,
          height: h,
          color: PDFLib.rgb(lineRgb.r, lineRgb.g, lineRgb.b),
        });
        continue;
      }

      if (type === "circle") {
        // Draw ellipse with center and radii
        const cx = x + w / 2;
        const cy = y + h / 2;
        const xr = w / 2;
        const yr = h / 2;
        const drawOpts = {
          x: cx,
          y: cy,
          xScale: xr,
          yScale: yr,
        };
        if (!fillIsTransparent)
          drawOpts.color = PDFLib.rgb(fillRgb.r, fillRgb.g, fillRgb.b);
        if (borderWidth > 0) {
          drawOpts.borderColor = PDFLib.rgb(
            borderColorRgb.r,
            borderColorRgb.g,
            borderColorRgb.b
          );
          drawOpts.borderWidth = borderWidth;
        }
        if (page.drawEllipse) {
          page.drawEllipse(drawOpts);
        } else {
          // Fallback: rectangle if drawEllipse not available
          const rectOpts = { x, y, width: w, height: h };
          if (!fillIsTransparent)
            rectOpts.color = PDFLib.rgb(fillRgb.r, fillRgb.g, fillRgb.b);
          if (borderWidth > 0) {
            rectOpts.borderColor = PDFLib.rgb(
              borderColorRgb.r,
              borderColorRgb.g,
              borderColorRgb.b
            );
            rectOpts.borderWidth = borderWidth;
          }
          page.drawRectangle(rectOpts);
        }
        continue;
      }

      // Default: rectangle
      const rectOpts = { x, y, width: w, height: h };
      if (!fillIsTransparent)
        rectOpts.color = PDFLib.rgb(fillRgb.r, fillRgb.g, fillRgb.b);
      if (borderWidth > 0) {
        rectOpts.borderColor = PDFLib.rgb(
          borderColorRgb.r,
          borderColorRgb.g,
          borderColorRgb.b
        );
        rectOpts.borderWidth = borderWidth;
      }
      page.drawRectangle(rectOpts);
    }

    const newPdfBytes = await pdfLibDoc.save();
    const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  } catch (err) {
    console.error("pdf-lib failed:", err);
    alert("Export failed. See console.");
  }
});

// SHAPE CONTROLS LIVE UPDATE
const shapeBorderInput = document.getElementById("shape-border");
if (shapeBorderInput) {
  shapeBorderInput.addEventListener("change", (e) => {
    if (!selectedShape) return;
    const color = e.target.value;
    if (selectedShape.dataset.shape === "line") {
      selectedShape.style.backgroundColor = color;
      selectedShape.style.border = "none";
    } else {
      selectedShape.style.borderColor = color;
    }
  });
}
const shapeFillInput = document.getElementById("shape-fill");
if (shapeFillInput) {
  shapeFillInput.addEventListener("change", (e) => {
    if (!selectedShape) return;
    if (selectedShape.dataset.shape === "line") return;
    const isTransparent = !!(
      document.getElementById("shape-fill-transparent") &&
      document.getElementById("shape-fill-transparent").checked
    );
    selectedShape.style.backgroundColor = isTransparent
      ? "transparent"
      : e.target.value;
  });
}
const shapeFillTransparentInput = document.getElementById(
  "shape-fill-transparent"
);
if (shapeFillTransparentInput) {
  shapeFillTransparentInput.addEventListener("change", (e) => {
    if (!selectedShape) return;
    if (selectedShape.dataset.shape === "line") return;
    const checked = e.target.checked;
    selectedShape.style.backgroundColor = checked
      ? "transparent"
      : shapeFillInput
      ? shapeFillInput.value
      : "#ffffff";
  });
}

// Guard optional options-panel block to avoid runtime errors
document.addEventListener("DOMContentLoaded", () => {
  const textToolBtn = document.getElementById("tool-text");
  const textToolOptions = document.getElementById("text-tool-options");

  const shapeToolBtn = document.getElementById("tool-shape");
  const shapeToolOptions = document.getElementById("shape-tool-options");

  textToolBtn.addEventListener("click", () => {
    textToolBtn.classList.toggle("ring");
    textToolBtn.classList.toggle("ring-offset-1");
    textToolBtn.classList.toggle("ring-blue-400");
    textToolOptions.classList.toggle("hidden");
  });

  shapeToolBtn.addEventListener("click", () => {
    shapeToolBtn.classList.toggle("ring");
    shapeToolBtn.classList.toggle("ring-offset-1");
    shapeToolBtn.classList.toggle("ring-purple-400");
    shapeToolOptions.classList.toggle("hidden");
  });
});

// Make the advanced options-panel block a no-op if missing
document.addEventListener("DOMContentLoaded", () => {
  const optionsPanel = document.getElementById("options-panel");
  if (!optionsPanel) return; // nothing to do if panel isn't present
  const textToolBtn = document.getElementById("tool-text");
  const shapeToolBtn = document.getElementById("tool-shape");
  const pdfContainer = document.getElementById("pdf-container");

  let activeTool = null;

  function setActiveTool(tool) {
    activeTool = tool;
    [textToolBtn, shapeToolBtn].forEach((btn) =>
      btn.classList.remove(
        "ring",
        "ring-offset-1",
        "ring-blue-400",
        "ring-purple-400"
      )
    );
    optionsPanel.innerHTML = "";
    optionsPanel.classList.add("hidden");
    if (tool === "text") {
      textToolBtn.classList.add("ring", "ring-offset-1", "ring-blue-400");
      optionsPanel.classList.remove("hidden");
    }
    if (tool === "shape") {
      shapeToolBtn.classList.add("ring", "ring-offset-1", "ring-purple-400");
      optionsPanel.classList.remove("hidden");
    }
  }

  textToolBtn.addEventListener("click", () => setActiveTool("text"));
  shapeToolBtn.addEventListener("click", () => setActiveTool("shape"));

  let currentShape = null;
  let startX, startY;
  let tempShapeEl = null;

  pdfContainer.addEventListener("mousedown", (e) => {
    if (activeTool !== "shape") return;
    currentShape = (
      document.getElementById("shape-type") ||
      document.getElementById("shape-tool")
    ).value;
    const borderColor = (
      document.getElementById("shape-border") || { value: "#000000" }
    ).value;
    const isTransparent = (
      document.getElementById("shape-fill-transparent") || { checked: false }
    ).checked;
    const fillColor = (
      document.getElementById("shape-fill") || { value: "transparent" }
    ).value;
    startX = e.offsetX;
    startY = e.offsetY;
    tempShapeEl = document.createElement("div");
    tempShapeEl.classList.add("absolute");
    if (currentShape === "line") {
      tempShapeEl.style.backgroundColor = borderColor;
      tempShapeEl.style.border = "none";
    } else {
      tempShapeEl.style.border = `2px solid ${borderColor}`;
      tempShapeEl.style.backgroundColor = isTransparent
        ? "transparent"
        : fillColor;
      if (currentShape === "circle") {
        tempShapeEl.classList.add("rounded-full");
      }
    }
    pdfContainer.appendChild(tempShapeEl);
  });

  pdfContainer.addEventListener("mousemove", (e) => {
    if (!tempShapeEl) return;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    tempShapeEl.style.left = `${Math.min(startX, e.offsetX)}px`;
    tempShapeEl.style.top = `${Math.min(startY, e.offsetY)}px`;
    if (currentShape === "line") {
      tempShapeEl.style.width = `${Math.abs(width)}px`;
      tempShapeEl.style.height = `2px`;
    } else {
      tempShapeEl.style.width = `${Math.abs(width)}px`;
      tempShapeEl.style.height = `${Math.abs(height)}px`;
    }
  });

  pdfContainer.addEventListener("mouseup", () => {
    tempShapeEl = null;
  });
});
