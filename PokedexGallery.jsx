/**
 * PokedexGallery — flat grid of individual stage cards
 * ─────────────────────────────────────────────────────
 * Props:
 *   pokedex – state.pokedex[] (entries enriched with .stages / .lineKey)
 */

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const S = {
  card:  '0 2px 8px rgba(0,0,0,.07), inset 0 1px 0 rgba(255,255,255,.8)',
  shiny: '0 2px 8px rgba(0,0,0,.07), 0 0 10px rgba(250,204,21,.4)',
  leg:   '0 2px 8px rgba(0,0,0,.07), 0 0 12px rgba(139,92,246,.28)',
};

/* ════════════════════════════════════════════════
   STAGE CARD
   ════════════════════════════════════════════════ */
function StageCard({ id, name, spriteUrl, displayStage, totalStages, isFinal, sessions, isShiny, isLegendary }) {
  const border = isFinal && isLegendary ? '2px solid #8b5cf6'
               : isFinal && isShiny     ? '2px solid #facc15'
               :                          '2px solid #c8e4e4';

  const bg = isFinal && isLegendary ? 'linear-gradient(180deg,#f5f3ff,#fff)'
           : isFinal && isShiny     ? 'linear-gradient(180deg,#fffbeb,#fff)'
           :                          '#fff';

  const boxShadow = isFinal && isLegendary ? S.leg
                  : isFinal && isShiny     ? S.shiny
                  :                          S.card;

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-xl
                 transition-transform duration-200 hover:-translate-y-[3px]"
      style={{ width: 120, padding: '10px 6px 9px', background: bg, border, boxShadow }}
    >
      {isFinal && isLegendary && (
        <span className="absolute top-[3px] left-[5px]" style={{ fontSize: 9 }}>★</span>
      )}
      {isFinal && isShiny && (
        <span className="absolute top-[3px] right-[5px]" style={{ fontSize: 9 }}>✨</span>
      )}

      <img
        src={spriteUrl ?? `${SPRITE_BASE}/${id}.png`}
        alt={name}
        style={{ width: 52, height: 52, imageRendering: 'pixelated', display: 'block' }}
      />

      <span
        className="text-center capitalize leading-snug mt-1"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(5px,1.3vw,6.5px)', color: '#374151' }}
      >
        {name}
      </span>

      <span
        className="mt-[4px]"
        style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 7, fontWeight: 500, letterSpacing: '0.07em', color: '#6AB1B1' }}
      >
        {`Stage ${displayStage}/${totalStages}`}
      </span>

      {isFinal && totalStages > 1 && sessions != null && (
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 6, fontWeight: 500, color: '#9ab5b5', letterSpacing: '0.05em', marginTop: 2 }}>
          {sessions} sessions
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════ */
function EmptyDex() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full text-center py-8">
      <span style={{ fontSize: 30 }}>📖</span>
      <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6.5, color: '#7B949C', lineHeight: 2 }}>
        No Pokémon caught yet.<br />Start your focus journey!
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
export default function PokedexGallery({ pokedex = [] }) {
  if (!pokedex.length) return <EmptyDex />;

  // Step 1 — deduplicate: one entry per lineKey, keeping highest reachedStage
  const lineMap = new Map();
  for (const entry of pokedex) {
    const key = entry.lineKey ?? entry.name;
    const existing = lineMap.get(key);
    if (!existing || (entry.reachedStage ?? 1) > (existing.reachedStage ?? 1)) {
      lineMap.set(key, entry);
    }
  }

  // Step 2 — flatMap expansion: each entry yields one card per unlocked stage
  const displayedCards = Array.from(lineMap.values()).flatMap(entry => {
    const stages = entry.stages?.length
      ? entry.stages
      : [{ id: entry.id, name: entry.name, spriteUrl: entry.spriteUrl }]; // legacy
    const reached = entry.reachedStage ?? stages.length;

    return stages.slice(0, reached).map((stage, index) => ({
      ...stage,
      isFinal: (index + 1) === reached,
      lineKey: entry.lineKey ?? entry.name,
      displayStage: index + 1,
      totalStages: stages.length,
      sessions: entry.completedSessions,
      isShiny: entry.isShiny,
      isLegendary: entry.isLegendary,
    }));
  });

  // Step 3 — render flat grid; no grid-cols restrictions
  return (
    <div style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', paddingRight: 2 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, padding: '4px 2px' }}>
        {displayedCards.map(card => (
          <StageCard key={`${card.lineKey}-${card.id}`} {...card} />
        ))}
      </div>
    </div>
  );
}
