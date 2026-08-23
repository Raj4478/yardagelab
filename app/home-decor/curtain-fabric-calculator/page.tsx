import type { Metadata } from 'next';
import { CalculatorScaffold } from '@/components/content/CalculatorScaffold';
import { CurtainCalculator } from '@/components/calculators/CurtainCalculator';
import { Section, FAQ } from '@/components/content/sections';
import { CALCULATOR_BY_ID } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

const meta = CALCULATOR_BY_ID['curtain-fabric-calculator']!;
export const metadata: Metadata = generatePageMetadata({ title: meta.title, description: meta.description, path: meta.route, keywords: meta.keywords, ogType: 'article' });

export default function Page() {
  return (
    <CalculatorScaffold calculatorId="curtain-fabric-calculator" interactive={<CurtainCalculator />}>
      <Section id="methodology" title="How the curtain calculation works" eyebrow="Methodology"><p>Curtains need extra width to gather nicely and extra length for the header and hem:</p><ul><li>Gathered width = track width × fullness ratio</li><li>Fabric widths = gathered width ÷ fabric width (rounded up)</li><li>Cut length = finished drop + header + hem</li><li>Total fabric = fabric widths × cut length</li></ul><p>If your fabric has a <strong>pattern repeat</strong>, each cut length is rounded up to a whole number of repeats so the pattern matches across seams. The total is converted to yards and rounded up to the next quarter yard.</p></Section>
      <Section id="example" title="Worked example" eyebrow="See it in numbers"><p>A <strong>48″</strong> window, <strong>84″</strong> drop, 2× fullness, 54″ fabric, 8″ header + 8″ hem:</p><ul><li>Gathered width = 48 × 2 = 96″</li><li>96″ ÷ 54″ = 1.8 → 2 fabric widths</li><li>Cut length = 84 + 16 = 100″; 2 × 100″ = 200″</li><li>200″ ÷ 36 = 5.56 yd → buy <strong>5.75 yd</strong></li></ul></Section>
      <Section id="reference" title="Fullness ratios" eyebrow="Reference"><table><thead><tr><th>Ratio</th><th>Look</th><th>Best for</th></tr></thead><tbody><tr><td>1.5×</td><td>Light gather</td><td>Sheers, casual panels</td></tr><tr><td>2.0×</td><td>Standard gather</td><td>Most pencil-pleat curtains</td></tr><tr><td>2.5–3.0×</td><td>Full, luxurious</td><td>Pinch pleat, formal rooms</td></tr></tbody></table><p>Header and hem allowances of 6–10″ each are common; deeper hems drape better on long drops.</p></Section>
      <Section id="faq" title="Frequently asked questions"><FAQ items={[{ q: 'Does “panels” mean a pair of curtains?', a: 'Panels is the number of finished curtain pieces (2 for a typical pair). The tool never uses fewer fabric widths than panels, so each panel gets at least one width.' }, { q: 'How do I handle a patterned fabric?', a: 'Enter the vertical pattern repeat. Each cut length is rounded up to a full repeat so the motif lines up where widths are joined — this can noticeably increase the fabric needed.' }, { q: 'What about width lost to side hems?', a: 'Fullness at 2× or more generally absorbs side hems. For very precise projects, add a few inches to the window width to cover side turnings.' }]} /></Section>
      <Section id="sources" title="Sources & assumptions" eyebrow="Transparency"><ul><li>Gathered width = window width × fullness; side hems are absorbed by fullness.</li><li>Cut length = drop + header + hem, rounded up to a full pattern repeat when given.</li><li>At least one fabric width per panel.</li><li>Purchase yardage rounds up to the next ¼ yard.</li></ul></Section>
    </CalculatorScaffold>
  );
}
