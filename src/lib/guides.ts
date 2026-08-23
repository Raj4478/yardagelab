import type { HubId } from './registry';

export interface GuideSection { heading: string; body: string[] }
export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  hub: HubId;
  relatedCalculatorIds: string[];
  lastReviewed: string;
  sections: GuideSection[];
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'standard-quilt-sizes', title: 'Standard Quilt Sizes: Practical Reference Chart',
    description: 'A practical reference for common baby, throw, twin, queen and king quilt dimensions, plus guidance for choosing your finished size.',
    hub: 'quilting', relatedCalculatorIds: ['quilt-size-calculator','quilt-backing-calculator','quilt-binding-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'There is no single universal quilt size', body: ['Quilt sizes vary by maker, mattress depth, desired drop and whether pillows are covered. Treat published dimensions as planning ranges, then measure the actual bed or intended use before cutting.'] },
      { heading: 'Useful planning ranges', body: ['Baby quilts are often around 36 × 52 in, throws around 50 × 65 in, twin quilts around 70 × 90 in, queens around 90 × 95 in and kings around 108 × 95 in. These are reference points rather than construction rules.'] },
      { heading: 'Plan from the finished size backward', body: ['Choose the intended finished dimensions first, then calculate blocks, borders, backing and binding. YardageLab separates those steps so assumptions remain visible.'] },
    ],
  },
  {
    slug: 'how-much-quilt-backing-do-i-need', title: 'How Much Quilt Backing Do I Need?',
    description: 'Learn how quilt dimensions, overhang, usable fabric width, seams and wide-back fabric affect backing yardage.',
    hub: 'quilting', relatedCalculatorIds: ['quilt-backing-calculator','quilt-size-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Start with the quilt top', body: ['Backing must be larger than the quilt top. Add the chosen overhang on every side before deciding how many widths of fabric are required. Long-arm quilters often request more overhang than domestic-machine quilting.'] },
      { heading: 'Use usable width, not the bolt label alone', body: ['A fabric sold as 44 in wide may have less usable width once selvedges are excluded. Enter the width you can actually sew with.'] },
      { heading: 'Panel layout changes yardage', body: ['Standard-width backing normally requires multiple joined panels. Wide-back fabric can remove seams and sometimes reduce total length purchased. Compare layouts before buying.'] },
    ],
  },
  {
    slug: 'common-fabric-widths', title: 'Common Fabric Widths and When They Matter',
    description: 'Reference common fabric widths and understand why usable width matters when calculating yardage and cutting layouts.',
    hub: 'sewing', relatedCalculatorIds: ['fabric-yardage-calculator','fabric-unit-converter'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Fabric width is a layout constraint', body: ['Yardage is not only area. Pieces must physically fit across the usable width, so a small change in width can change how many rows fit and therefore how much length is needed.'] },
      { heading: 'Common examples', body: ['Quilting cotton is commonly sold around 42–44 in usable width. Apparel and home-decor fabrics are frequently wider. Wide-back quilting fabrics can be around 108 in. Always use the actual usable width from the product or measured cloth.'] },
    ],
  },
  {
    slug: 'fabric-yardage-conversion-chart', title: 'Fabric Yardage Conversion Chart',
    description: 'Quickly convert common fractions of a yard to inches, centimeters and meters for fabric purchasing and cutting.',
    hub: 'conversions', relatedCalculatorIds: ['fabric-unit-converter','fabric-yardage-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Core conversion', body: ['One yard equals 36 inches and 0.9144 meter. A half yard is 18 inches; a quarter yard is 9 inches; an eighth yard is 4.5 inches.'] },
      { heading: 'Buying versus calculating', body: ['A mathematically exact answer may not match the increments a store sells. Round purchase quantities upward according to the seller’s available increments rather than rounding the material requirement down.'] },
    ],
  },
  {
    slug: 'quilt-backing-overhang', title: 'Quilt Backing Overhang: How Much Extra Should You Add?',
    description: 'Understand backing overhang, why long-arm quilting often needs extra fabric and how to choose a safe allowance.',
    hub: 'quilting', relatedCalculatorIds: ['quilt-backing-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Why backing extends beyond the top', body: ['Extra backing gives room for basting, alignment, quilting movement and trimming. The correct amount depends on the quilting method and the requirements of the person or machine doing the quilting.'] },
      { heading: 'Confirm before buying', body: ['Four inches per side is a common planning assumption for long-arm work, but it is not universal. If a professional quilter will finish the quilt, use their stated requirement.'] },
    ],
  },
  {
    slug: 'quilt-binding-width-guide', title: 'Quilt Binding Width Guide',
    description: 'Choose strip width for straight-grain quilt binding and understand how strip width changes fabric requirements.',
    hub: 'quilting', relatedCalculatorIds: ['quilt-binding-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Strip width controls the fabric requirement', body: ['Binding calculators multiply the number of width-of-fabric strips by the cut strip width. Wider binding therefore uses more fabric even when quilt perimeter is unchanged.'] },
      { heading: 'Straight grain and bias are different', body: ['The current YardageLab binding calculator models straight-grain width-of-fabric strips. Curves or projects that specifically require bias binding need a different cutting model.'] },
    ],
  },
  {
    slug: 'inches-to-yards-for-fabric', title: 'Inches to Yards for Fabric: Quick Reference',
    description: 'Convert fabric lengths from inches to decimal yards and common fractional-yard purchase quantities.',
    hub: 'conversions', relatedCalculatorIds: ['fabric-unit-converter'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Divide inches by 36', body: ['Convert inches to yards by dividing by 36. For example, 72 inches is 2 yards and 45 inches is 1.25 yards.'] },
      { heading: 'Round purchases upward', body: ['When the exact value falls between the increments sold by a fabric shop, buy the next available increment unless your project specification explicitly allows less.'] },
    ],
  },
  {
    slug: 'how-to-measure-fabric-width', title: 'How to Measure Usable Fabric Width',
    description: 'Measure usable fabric width correctly so yardage calculators reflect the cloth you can actually cut and sew.',
    hub: 'sewing', relatedCalculatorIds: ['fabric-yardage-calculator','quilt-backing-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Measure perpendicular to the selvedge', body: ['Lay the fabric flat without stretching it and measure from one usable edge to the other across the width of goods. If you will remove selvedges, exclude them from the usable measurement.'] },
      { heading: 'Use the narrower reliable width', body: ['If width varies along the fabric, calculate with the narrower usable width. That produces a safer cutting plan than assuming the maximum width.'] },
    ],
  },
  {
    slug: 'wideback-vs-standard-quilting-fabric', title: 'Wide-Back vs Standard-Width Quilt Backing',
    description: 'Compare wide-back and standard-width quilting fabric by seams, layout, yardage and handling before choosing backing.',
    hub: 'quilting', relatedCalculatorIds: ['quilt-backing-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Standard width often needs seams', body: ['Typical quilting cotton may require two or three panels for larger quilts. This can be economical but requires planning seam placement and matching directional prints where relevant.'] },
      { heading: 'Wide-back simplifies layout', body: ['Wide-back fabric can cover many quilts without piecing. Compare price per usable area and the exact length needed rather than assuming one format is always cheaper.'] },
    ],
  },
  {
    slug: 'how-much-extra-fabric-should-i-buy', title: 'How Much Extra Fabric Should I Buy?',
    description: 'Plan sensible extra fabric for shrinkage, squaring, directional prints, mistakes and store cutting variation without guessing.',
    hub: 'sewing', relatedCalculatorIds: ['fabric-yardage-calculator'], lastReviewed: '2026-08-23',
    sections: [
      { heading: 'Extra fabric is risk allowance', body: ['The correct buffer depends on project complexity, pattern repeat, shrinkage, directional layouts and how replaceable the fabric is. A calculator should show the exact material requirement separately from any optional buffer.'] },
      { heading: 'Do not hide the buffer in the math', body: ['YardageLab keeps exact requirements and purchase recommendations distinct. Add a project-specific allowance deliberately rather than silently inflating every result.'] },
    ],
  },
];

export const GUIDE_BY_SLUG = Object.fromEntries(GUIDES.map((guide) => [guide.slug, guide]));
