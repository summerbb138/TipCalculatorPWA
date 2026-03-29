// State
let billAmount = '';
let splitCount = 1;
let selectedTipRate = 0.18;
const tipRates = [0.12, 0.15, 0.18, 0.20];

// DOM refs
const billInput = document.getElementById('billInput');
const splitLabel = document.getElementById('splitLabel');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const gridHeader = document.getElementById('gridHeader');
const gridBody = document.getElementById('gridBody');
const btnShare = document.getElementById('btnShare');
const btnCamera = document.getElementById('btnCamera');
const cameraInput = document.getElementById('cameraInput');
const ocrLoading = document.getElementById('ocrLoading');

// Currency formatter
const currencyFmt = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatCurrency(cents) {
  return currencyFmt.format(cents / 100);
}

function billCents() {
  const val = parseFloat(billAmount);
  if (isNaN(val) || val <= 0) return 0;
  return Math.round(val * 100);
}

function render() {
  // Split label
  splitLabel.textContent = `${splitCount} ${splitCount === 1 ? 'person' : 'people'}`;
  btnMinus.disabled = splitCount <= 1;
  btnPlus.disabled = splitCount >= 99;

  // Grid header
  gridHeader.textContent = splitCount > 1 ? 'Per Person' : 'Totals';

  // Grid rows
  const bill = billCents();
  gridBody.innerHTML = '';

  for (const rate of tipRates) {
    const pct = Math.round(rate * 100);
    const tipCents = Math.round(bill * rate);
    const totalCents = bill + tipCents;
    const displayTip = splitCount > 1 ? Math.round(tipCents / splitCount) : tipCents;
    const displayTotal = splitCount > 1 ? Math.round(totalCents / splitCount) : totalCents;
    const isSelected = rate === selectedTipRate;

    const tr = document.createElement('tr');
    if (isSelected) tr.classList.add('selected');
    tr.addEventListener('click', () => {
      selectedTipRate = rate;
      render();
    });

    tr.innerHTML = `
      <td class="check-cell">${isSelected ? '\u2713' : ''}</td>
      <td>${pct}%</td>
      <td>${formatCurrency(displayTip)}</td>
      <td>${formatCurrency(displayTotal)}</td>
    `;
    gridBody.appendChild(tr);
  }
}

function shareMessage() {
  const bill = billCents();
  const pct = Math.round(selectedTipRate * 100);
  const tipCents = Math.round(bill * selectedTipRate);
  const totalCents = bill + tipCents;

  if (splitCount > 1) {
    const perPerson = Math.round(totalCents / splitCount);
    return `Bill: ${formatCurrency(bill)} with ${pct}% tip (${formatCurrency(tipCents)}). Total: ${formatCurrency(totalCents)}, split ${splitCount} ways = ${formatCurrency(perPerson)} each.`;
  }
  return `Bill: ${formatCurrency(bill)} with ${pct}% tip (${formatCurrency(tipCents)}). Total: ${formatCurrency(totalCents)}.`;
}

// Event listeners
billInput.addEventListener('input', () => {
  billAmount = billInput.value;
  render();
});

btnMinus.addEventListener('click', () => {
  if (splitCount > 1) { splitCount--; render(); }
});

btnPlus.addEventListener('click', () => {
  if (splitCount < 99) { splitCount++; render(); }
});

btnShare.addEventListener('click', async () => {
  const msg = shareMessage();
  if (navigator.share) {
    try {
      await navigator.share({ text: msg });
    } catch (e) {
      // User cancelled share — ignore
    }
  } else {
    try {
      await navigator.clipboard.writeText(msg);
      btnShare.textContent = 'Copied!';
      setTimeout(() => { btnShare.innerHTML = '\u21E7 Send to Friends'; }, 1500);
    } catch (e) {
      // Fallback: select-and-copy prompt
      window.prompt('Copy this message:', msg);
    }
  }
});

// Camera / OCR
btnCamera.addEventListener('click', () => {
  cameraInput.click();
});

cameraInput.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  ocrLoading.classList.add('visible');

  try {
    // Dynamically load Tesseract.js if not loaded
    if (typeof Tesseract === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }

    const { data: { text } } = await Tesseract.recognize(file, 'eng');

    // Find dollar amounts with regex (same as Swift version)
    const pattern = /\$?\d+\.\d{2}/g;
    const matches = text.match(pattern) || [];
    const amounts = matches
      .map(m => parseFloat(m.replace('$', '')))
      .filter(v => v > 0);

    if (amounts.length > 0) {
      const largest = Math.max(...amounts);
      billInput.value = largest.toFixed(2);
      billAmount = billInput.value;
      render();
    }
  } catch (err) {
    console.error('OCR failed:', err);
  } finally {
    ocrLoading.classList.remove('visible');
    cameraInput.value = '';
  }
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Initial render
render();
