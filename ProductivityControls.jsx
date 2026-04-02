import { useState } from 'react';

/* ─── shared shadow tokens (claymorphic / 3-D inset style) ─── */
const shadow = {
  panel: '0 4px 16px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.7)',
  input: 'inset 2px 2px 4px rgba(0,0,0,.10), inset 0 -2px 3px rgba(255,255,255,.6)',
  track: 'inset 1px 1px 3px rgba(0,0,0,.15), inset 0 -1px 2px rgba(255,255,255,.5)',
  apply: 'inset 3px 3px 5px rgba(255,255,255,.30), inset 0 -3px 5px rgba(0,0,0,.22), 0 2px 6px rgba(0,0,0,.12)',
};

/* ─── Row wrapper ─────────────────────────────────────────── */
function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className="text-[#7B949C] tracking-widest uppercase shrink-0"
        style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 9, fontWeight: 500 }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

/* ─── Number input ────────────────────────────────────────── */
function NumberInput({ label, value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-[#9ab5b5] uppercase tracking-widest"
        style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 7, fontWeight: 500 }}
      >
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-12 text-center rounded-lg text-[#374151] outline-none transition-colors"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11,
          padding: '5px 4px',
          background: '#fff',
          border: '1px solid #c8e4e4',
          boxShadow: shadow.input,
        }}
      />
    </div>
  );
}

/* ─── Range slider ────────────────────────────────────────── */
function RangeSlider({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div
        className="relative flex-1 h-[10px] rounded-full"
        style={{ background: '#C7EAEA', border: '1px solid #b5dede', boxShadow: shadow.track }}
      >
        {/* filled track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full pointer-events-none"
          style={{ width: `${value}%`, background: '#6AB1B1', borderRadius: 'inherit' }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
      <span
        className="text-[#7B949C] tabular-nums shrink-0"
        style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 9, fontWeight: 500, minWidth: 24, textAlign: 'right' }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Divider ─────────────────────────────────────────────── */
function Divider() {
  return <div className="w-full h-px" style={{ background: 'rgba(148,181,181,0.2)' }} />;
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   Props:
     onClose  — called when ✕ is pressed
     onSave   — called with { focusTime, breakTime, sfxVolume }
                overlay closes automatically after save
═══════════════════════════════════════════════════════════ */
export default function ProductivityControls({ onClose, onSave, settings = {} }) {
  /* local draft state — seeded from parent settings prop */
  const [focusTime, setFocusTime] = useState(settings.focusTime ?? 25);
  const [breakTime, setBreakTime] = useState(settings.breakTime ?? 5);
  const [sfxVolume, setSfxVolume] = useState(settings.sfxVolume ?? 70);

  function handleApply() {
    onSave?.({ focusTime, breakTime, sfxVolume }); // pass local state up via callback
    onClose?.();                                   // parent closes overlay automatically
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-xl w-full max-w-xs mx-auto"
      style={{
        padding: '14px 16px',
        background: 'linear-gradient(160deg, #d4f0f0 0%, #e8faf6 100%)',
        border: '1px solid #c8e4e4',
        boxShadow: shadow.panel,
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-[10px]"
        style={{ borderBottom: '1px solid rgba(148,181,181,.25)' }}
      >
        <h2
          className="text-[#374151] uppercase tracking-widest"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8 }}
        >
          Settings
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#9ab5b5] hover:text-[#374151] transition-colors leading-none"
            style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, padding: '2px 4px' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Timer Durations ── */}
      <Row label="Timer">
        <div className="flex gap-3">
          <NumberInput label="Focus" value={focusTime} onChange={setFocusTime} />
          <NumberInput label="Break" value={breakTime} onChange={setBreakTime} />
        </div>
      </Row>

      <Divider />

      {/* ── SFX Volume ── */}
      <Row label="SFX Vol">
        <div className="flex-1 ml-3">
          <RangeSlider value={sfxVolume} onChange={setSfxVolume} />
        </div>
      </Row>

      <Divider />

      {/* ── Apply Button ── */}
      <button
        onClick={handleApply}
        className="w-full rounded-xl transition-all duration-150 active:translate-y-px"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#fff',
          background: '#6AB1B1',
          border: '1px solid #7B949C',
          padding: '9px 0',
          boxShadow: shadow.apply,
          cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#5a9e9e')}
        onMouseLeave={e => (e.currentTarget.style.background = '#6AB1B1')}
      >
        ✦ Apply Changes
      </button>
    </div>
  );
}
