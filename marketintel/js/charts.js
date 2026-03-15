// charts.js — KPI counters and live number updates

let _kpiSignals = 847;
let _kpiPriceShifts = 23;
let _kpiPivots = 7;

// animate a number counting up from 0 to target
function animateCount(el, target, duration) {
  if (!el) return;
  const start    = 0;
  const range    = target - start;
  const startTime = performance.now();

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + range * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initKPIAnimations() {
  animateCount(document.getElementById('kpiSignals'),    _kpiSignals,    800);
  animateCount(document.getElementById('kpiPriceShifts'),_kpiPriceShifts, 600);
  animateCount(document.getElementById('kpiPivots'),     _kpiPivots,     500);
}

// simulate live signal count ticking up
function startLiveKPIs() {
  setInterval(() => {
    _kpiSignals += Math.floor(Math.random() * 4) + 1;
    const el = document.getElementById('kpiSignals');
    if (el) el.textContent = _kpiSignals;

    if (Math.random() > 0.65) {
      _kpiPriceShifts += Math.random() > 0.5 ? 1 : -1;
      _kpiPriceShifts = Math.max(0, _kpiPriceShifts);
      const el2 = document.getElementById('kpiPriceShifts');
      if (el2) el2.textContent = _kpiPriceShifts;
    }
  }, 4500);
}
