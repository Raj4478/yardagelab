import type { Metadata } from 'next';
import { CalculatorScaffold } from '@/components/content/CalculatorScaffold';
import { UnitConverter } from '@/components/calculators/UnitConverter';
import { Section, FAQ } from '@/components/content/sections';
import { CALCULATOR_BY_ID } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

const meta = CALCULATOR_BY_ID['fabric-unit-converter']!;
export const metadata: Metadata = generatePageMetadata({ title: meta.title, description: meta.description, path: meta.route, keywords: meta.keywords, ogType: 'article' });

export default function Page() {
  return (
    <CalculatorScaffold calculatorId="fabric-unit-converter" interactive={<UnitConverter />}>
      <Section id="methodology" title="How the conversion works" eyebrow="Methodology"><p>Every conversion runs through a single canonical base unit — the millimeter — using exact constants (1 inch = 25.4 mm, 1 yard = 914.4 mm). That means results are deterministic and reversible: convert there and back and you land on the same number.</p><p>For imperial results we also show a shop-friendly fraction rounded to the nearest eighth, so you can read a number straight onto a cutting mat.</p></Section>
      <Section id="reference" title="Quick fabric conversions" eyebrow="Reference"><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>Inches</td><td>Centimeters</td><td>2.54</td></tr><tr><td>Yards</td><td>Meters</td><td>0.9144</td></tr><tr><td>Yards</td><td>Inches</td><td>36</td></tr><tr><td>Meters</td><td>Yards</td><td>1.0936</td></tr><tr><td>Centimeters</td><td>Inches</td><td>0.3937</td></tr></tbody></table></Section>
      <Section id="faq" title="Frequently asked questions"><FAQ items={[{ q: 'Why is the fraction “approximate”?', a: 'Fabric is cut in practical increments, so the fraction is rounded to the nearest eighth of a unit. The decimal value above it is the precise conversion.' }, { q: 'Which units are supported?', a: 'Inches, feet, yards, millimeters, centimeters and meters — the common units for fabric length and cutting.' }]} /></Section>
      <Section id="sources" title="Sources & assumptions" eyebrow="Transparency"><ul><li>Exact SI/imperial constants; millimeter base unit.</li><li>Fractions rounded to the nearest ⅛ for the cutting table.</li></ul></Section>
    </CalculatorScaffold>
  );
}
