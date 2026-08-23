import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Contact', description: 'Get in touch with the YardageLab team about a calculator, correction or suggestion.', path: '/contact/' });

export default function Page() {
  return (
    <ContentPage title="Contact" intro="Questions, corrections and tool suggestions are all welcome." breadcrumbName="Contact" breadcrumbPath="/contact/">
      <p>The fastest way to reach us is by email. We read every message, and calculator corrections go to the top of the pile.</p>
      <p><strong>Email:</strong> <a href="mailto:hello@yardagelab.com">hello@yardagelab.com</a></p>
      <h3>Reporting a calculation problem</h3>
      <p>To help us reproduce and fix it quickly, please include:</p>
      <ul><li>Which calculator you were using</li><li>The exact numbers you entered and the units</li><li>The result you got and the result you expected</li></ul>
      <p>We treat formula reports as high priority — a bad number can waste a maker’s money and time, so we verify, add a failing test, fix and re-review before anything goes live.</p>
    </ContentPage>
  );
}
