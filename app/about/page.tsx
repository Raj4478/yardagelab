import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About YardageLab',
  description: 'Why YardageLab exists and the principles behind every calculator.',
  path: '/about/',
});

export default function Page() {
  return (
    <ContentPage title="About YardageLab" intro={SITE.tagline} breadcrumbName="About" breadcrumbPath="/about/">
      <p>YardageLab makes free, reliable fabric-math tools for people who sew and quilt. Buying too little fabric means a second trip and a dye-lot mismatch; buying too much wastes money. Our calculators exist to get that number right the first time.</p>
      <h3>What we believe</h3>
      <ul>
        <li><strong>Utility first.</strong> Every page is a tool you can use, not a wall of text wrapped around an ad.</li>
        <li><strong>Show the work.</strong> We separate the exact mathematical result from a shop-friendly amount to buy, and we list our assumptions on every result.</li>
        <li><strong>Tested math.</strong> Each formula is backed by a suite of automated golden tests and human review before it ships.</li>
        <li><strong>Fast and calm.</strong> No pop-ups over the inputs, no layout shift, no sign-up.</li>
      </ul>
      <h3>How the numbers are made</h3>
      <p>Read the <Link href="/calculation-methodology/">calculation methodology</Link> for the exact formulas and rounding rules, and our <Link href="/editorial-policy/">editorial policy</Link> for how we research and review each tool.</p>
      <p>Spotted something off? <Link href="/contact/">Tell us</Link> — corrections from real makers make these tools better.</p>
    </ContentPage>
  );
}
