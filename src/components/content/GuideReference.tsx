import sizes from '@/lib/quilt-sizes.json';
import { ChartDownload } from './ChartDownload';

function Table({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={caption}><table><caption className="mb-3 text-left font-semibold text-ink">{caption}</caption><thead><tr>{headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function GuideReference({ slug }: { slug: string }) {
  if (slug === 'fabric-yardage-conversion-chart' || slug === 'inches-to-yards-for-fabric') return <>
    <Table caption="Fabric length conversion chart" headers={['Yards', 'Inches', 'Centimeters', 'Meters']} rows={[[0.125,'1/8'],[0.25,'1/4'],[0.375,'3/8'],[0.5,'1/2'],[0.625,'5/8'],[0.75,'3/4'],[0.875,'7/8'],[1,'1'],[1.5,'1 1/2'],[2,'2'],[3,'3']].map(([value,label]) => [String(label), String(Number(value)*36), (Number(value)*91.44).toFixed(2), (Number(value)*0.9144).toFixed(4)])} />
    <p>One yard is a length, not a square: a yard cut from a 44-inch bolt measures 36 × 44 inches before removing the selvedges. A quarter yard is 9 inches long. A fat quarter is a different cut, typically about 18 × 22 inches from nominal 44-inch fabric.</p>
    <figure className="my-8 rounded-xl border border-line bg-paper-card p-5"><svg viewBox="0 0 520 190" className="w-full" role="img" aria-label="Fabric cuts from a nominal 44-inch-wide bolt: quarter yard 9 by 44 inches, half yard 18 by 44 inches, full yard 36 by 44 inches.">
      {[{x:10,w:72,label:'1/4 yard',length:'9 in'},{x:110,w:144,label:'1/2 yard',length:'18 in'},{x:280,w:230,label:'1 yard',length:'36 in'}].map(c => <g key={c.x}><rect x={c.x} y="25" width={c.w} height="115" fill="#e2ebe5" stroke="#1f5a52"/><text x={c.x+c.w/2} y="16" textAnchor="middle" fontSize="13">{c.label}</text><text x={c.x+c.w/2} y="163" textAnchor="middle" fontSize="13">{c.length} long</text></g>)}
      <text x="260" y="187" textAnchor="middle" fontSize="12">Each cut uses the bolt width. Diagram is illustrative.</text>
    </svg><figcaption>Length changes with yardage; usable width depends on the cloth.</figcaption></figure>
  </>;
  if (slug === 'standard-quilt-sizes') return <>
    <Table caption="Finished quilt planning sizes (not mattress dimensions)" headers={['Quilt', 'Inches', 'Centimeters (approx.)']} rows={sizes.map(s => [s.name,`${s.widthIn} × ${s.lengthIn}`,`${(s.widthIn*2.54).toFixed(1)} × ${(s.lengthIn*2.54).toFixed(1)}`])} />
    <p>These are YardageLab’s approximate planning references, also used by the quilt size calculator. Measure the actual bed and choose the drop before cutting. There is no universal finished quilt size.</p>
    <ChartDownload />
  </>;
  if (slug === 'quilt-binding-width-guide') return <>
    <Table caption="Straight-grain, double-fold binding: starting choices" headers={['Cut strip width', 'When to consider it', 'Check before cutting']} rows={[
      ['2 1/4 in','A narrower edge','Test the fold around your batting.'],['2 1/2 in','A flexible starting point','Check coverage on both sides.'],['2 3/4 in','A fuller edge or thicker sandwich','A wider strip increases yardage.']]} />
    <p>Make a short sample using your fabric, batting and seam allowance. Cut width is not finished binding width. For a 60 × 80-inch quilt with 10 inches allowed for joins and overlap, 290 inches of binding requires seven 42-inch strips before join losses. At 2½ inches per strip, the calculator estimates 17.5 inches of fabric, rounded to ½ yard. Check that your total join loss and closing overlap fit the chosen allowance; increase it when needed.</p>
  </>;
  if (slug === 'how-much-quilt-backing-do-i-need') return <>
    <h2>A complete 60 × 80-inch example</h2><p>Add 4 inches on each side: the backing must cover 68 × 88 inches. Two 42-inch fabric widths joined with ¼-inch seams provide 83.5 inches of usable joined width. Cut each panel 88 inches long: 176 inches total ÷ 36 = 4.8889 yards, rounded up to 5 yards. Allow separately for shrinkage, squaring and print matching.</p>
    <p>Near a width boundary, seams matter. Two 42-inch panels cannot make an 84-inch backing after sewing. The calculator accounts for that lost width and compares permitted orientations.</p>
  </>;
  if (slug === 'common-fabric-widths') return <Table caption="Typical widths: verify your actual fabric" headers={['Fabric', 'Common width reference', 'Before calculating']} rows={[
    ['Quilting cotton','42–44 in usable','Exclude selvedges and damaged edges.'],['Apparel fabric','Often 54–60 in nominal','Follow pattern layout and grainline.'],['Home decor','Often 54 in nominal','Check repeat, direction and usable width.'],['Wide backing','Often 108 in nominal','Check usable width and shrinkage.']]} />;
  if (slug === 'how-to-measure-fabric-width') return <figure className="my-6 rounded-xl border border-line p-5"><svg viewBox="0 0 520 180" role="img" aria-label="Measure usable fabric width across the cloth, perpendicular to the selvedges, excluding both selvedges." className="w-full"><rect x="40" y="20" width="440" height="110" fill="#e2ebe5" stroke="#1f5a52"/><path d="M60 20V130M460 20V130" stroke="#9b442b" strokeDasharray="4 4"/><path d="M60 75H460M60 67V83M460 67V83" stroke="#22201c"/><text x="260" y="64" textAnchor="middle" fontSize="15">Usable width</text><text x="260" y="157" textAnchor="middle" fontSize="13">Exclude the narrow selvedge on each side.</text></svg><figcaption>Lay fabric flat. Measure across it without stretching, then repeat in several places and use the narrowest reliable width.</figcaption></figure>;
  return null;
}
