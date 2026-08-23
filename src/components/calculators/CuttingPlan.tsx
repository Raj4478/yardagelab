import type { VisualizationData } from '@/calculators/types';

const ROLE_STYLE: Record<string, { fill: string; stroke: string }> = {
  fabric: { fill: 'rgba(31,90,82,0.06)', stroke: 'rgba(31,90,82,0.5)' },
  overhang: { fill: 'rgba(196,89,58,0.08)', stroke: 'rgba(196,89,58,0.55)' },
  quilt: { fill: 'rgba(31,90,82,0.14)', stroke: 'rgba(31,90,82,0.75)' },
  panel: { fill: 'rgba(31,90,82,0.06)', stroke: 'rgba(31,90,82,0.5)' },
  piece: { fill: 'rgba(196,89,58,0.12)', stroke: 'rgba(196,89,58,0.6)' },
  border: { fill: 'rgba(196,89,58,0.06)', stroke: 'rgba(196,89,58,0.5)' },
  block: { fill: 'rgba(31,90,82,0.12)', stroke: 'rgba(31,90,82,0.7)' },
  seam: { fill: 'none', stroke: '#c4593a' },
};

export function CuttingPlan({ data, title }: { data: VisualizationData; title: string }) {
  const PAD = 8;
  const MAXW = 320;
  const MAXH = 300;
  const scale = Math.min(
    (MAXW - PAD * 2) / Math.max(data.boundingWidth, 0.001),
    (MAXH - PAD * 2) / Math.max(data.boundingHeight, 0.001),
  );
  const w = data.boundingWidth * scale + PAD * 2;
  const h = data.boundingHeight * scale + PAD * 2;

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w }} role="img" aria-label={`${title}. ${data.caption}.`} className="h-auto">
        <rect x="0" y="0" width={w} height={h} rx="10" fill="#fffdf8" stroke="#ddd0ba" />
        <g transform={`translate(${PAD}, ${PAD})`}>
          {data.rects.map((r, i) => {
            const style = ROLE_STYLE[r.role] ?? ROLE_STYLE.panel!;
            return <g key={i}><rect x={r.x * scale} y={r.y * scale} width={r.width * scale} height={r.height * scale} fill={style.fill} stroke={style.stroke} strokeWidth={1} rx={2} /></g>;
          })}
          {data.seams?.map((s, i) => <line key={`seam-${i}`} x1={s.x1 * scale} y1={s.y1 * scale} x2={s.x2 * scale} y2={s.y2 * scale} stroke="#c4593a" strokeWidth={1.5} strokeDasharray="4 3" />)}
        </g>
      </svg>
      <figcaption className="mt-3 text-center font-sans text-sm text-ink-faint">{data.caption}</figcaption>
    </figure>
  );
}
