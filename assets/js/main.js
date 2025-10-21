// assets/js/main.js
// Realistic multi-band waveform for header logo
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('logo-wave-svg');
  if (!svg) return;

  const waveLow = document.getElementById('wave-low');
  const waveMid = document.getElementById('wave-mid');
  const waveHigh = document.getElementById('wave-high');

  // Config
  const SAMPLES = 240;       // points across width
  const WIDTH = 1000;        // viewBox width (match SVG)
  const BASE_Y = 70;         // center Y
  const LOW_AMP = 24;
  const MID_AMP = 12;
  const HIGH_AMP = 5;
  const LOW_FREQ = 0.9;
  const MID_FREQ = 2.6;
  const HIGH_FREQ = 8.5;
  const TRANSIENT_PROB = 0.015;
  const TRANSIENT_DECAY = 0.94;
  const NOISE = 1.4;
  const JITTER_SPEED = 0.9;

  // state
  let t = 0;
  let transient = 0;

  // precompute x values & per-sample noise phases
  const xs = new Float32Array(SAMPLES + 1);
  const phases = new Float32Array(SAMPLES + 1);
  for (let i = 0; i <= SAMPLES; i++) {
    xs[i] = (i / SAMPLES) * WIDTH;
    phases[i] = Math.random() * Math.PI * 2;
  }

  function triggerTransient() {
    if (Math.random() < TRANSIENT_PROB) {
      transient += 0.8 + Math.random() * 1.8;
      // occasionally create a stronger hit
      if (Math.random() < 0.12) transient += 1.2 + Math.random() * 2.0;
      // cap
      if (transient > 6) transient = 6;
    }
  }

  // build points with multiple harmonics, per-sample jitter and local spikes
  function buildLayer(amp, freq, speedMul, phaseOffset) {
    const pts = new Array(SAMPLES + 1);
    for (let i = 0; i <= SAMPLES; i++) {
      const nx = i / SAMPLES;
      const x = xs[i];
      // base multi-harmonic waveform
      const h1 = Math.sin((nx * freq * Math.PI * 2) + (t * 0.9 * speedMul) + phaseOffset);
      const h2 = Math.sin((nx * freq * Math.PI * 4) + (t * 1.6 * speedMul) + phaseOffset * 1.5) * 0.45;
      const h3 = Math.sin((nx * freq * Math.PI * 8) + (t * 3.2 * speedMul) + phaseOffset * 2.1) * 0.18;
      // jitter/noise
      const jitter = Math.sin(phases[i] + t * JITTER_SPEED) * (NOISE * (0.6 - Math.abs(0.5 - nx)));
      // localized transient "spike" shape: triangular centered near middle when transient > 0
      const spike = transient > 0 ? transient * (1 - Math.min(1, Math.abs(nx - 0.5) * 3)) : 0;
      const y = BASE_Y + (amp * (h1 + h2 + h3)) + spike + jitter;
      pts[i] = `${Math.round(x)},${y.toFixed(2)}`;
    }
    return pts.join(' ');
  }

  // smoothing helper to avoid wobble: we will lerp previous points for each polyline
  let prevLow = null, prevMid = null, prevHigh = null;
  function lerpPoints(prev, next, alpha) {
    if (!prev) return next;
    const a = prev.split(' ');
    const b = next.split(' ');
    const out = new Array(a.length);
    for (let i = 0; i < a.length; i++) {
      const [xa, ya] = a[i].split(',').map(Number);
      const [xb, yb] = b[i].split(',').map(Number);
      const yi = ya + (yb - ya) * alpha;
      out[i] = `${Math.round(xa)},${yi.toFixed(2)}`;
    }
    return out.join(' ');
  }

  function animate() {
    // random transients
    triggerTransient();

    // decay transient
    transient *= TRANSIENT_DECAY;
    if (transient < 0.0005) transient = 0;

    // advance time
    t += 0.08;

    // build raw points
    const rawLow = buildLayer(LOW_AMP, LOW_FREQ, 0.8, 0.5);
    const rawMid = buildLayer(MID_AMP, MID_FREQ, 1.6, 1.0);
    const rawHigh = buildLayer(HIGH_AMP, HIGH_FREQ, 3.2, 2.0);

    // smooth by interpolating previous frame (simple temporal low-pass)
    const smoothFactor = 0.22; // lower = smoother/slower, higher = more immediate
    const smLow = lerpPoints(prevLow, rawLow, smoothFactor);
    const smMid = lerpPoints(prevMid, rawMid, smoothFactor);
    const smHigh = lerpPoints(prevHigh, rawHigh, smoothFactor);

    // set
    waveLow.setAttribute('points', smLow);
    waveMid.setAttribute('points', smMid);
    waveHigh.setAttribute('points', smHigh);

    // store prev
    prevLow = smLow;
    prevMid = smMid;
    prevHigh = smHigh;

    // loop
    requestAnimationFrame(animate);
  }

  // initialize flat lines for accessibility then start
  const flat = xs.map(x => `${x},${BASE_Y}`).join(' ');
  waveLow.setAttribute('points', flat);
  waveMid.setAttribute('points', flat);
  waveHigh.setAttribute('points', flat);

  // small ramp-in to avoid a flat start
  setTimeout(() => requestAnimationFrame(animate), 220);

  // Respect reduced-motion preference
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    // stop animation, show a subtle static waveform
    // leave the flat lines but add a small static mid wave for visual
    const staticMid = buildLayer(8, 1.6, 1.0, 1.0);
    waveMid.setAttribute('points', staticMid);
    waveLow.setAttribute('points', flat);
    waveHigh.setAttribute('points', flat);
  }
});