import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Privacy Policy', description: 'How YardageLab handles data, analytics and your privacy.', path: '/privacy-policy/' });

export default function Page() {
  return (
    <ContentPage title="Privacy Policy" intro="We collect the minimum needed to keep the tools working and improving." breadcrumbName="Privacy Policy" breadcrumbPath="/privacy-policy/">
      <blockquote>This is a starter policy template. Before launch, have it reviewed against the laws that apply to your audience (for example GDPR, UK GDPR, CCPA/CPRA) and the specific analytics and ad vendors you enable.</blockquote>
      <h3>What we calculate stays with you</h3><p>Calculations run in your browser. The measurements you type are not required for the tool to work on our servers, and we don’t need them to give you a result.</p>
      <h3>Analytics</h3><p>We may use privacy-conscious analytics to understand which tools are used and where they can improve. We record product events such as “a calculation completed” along with the calculator name and unit system. We do not attach your raw measurements to those events.</p>
      <h3>Cookies</h3><p>Any non-essential analytics or advertising cookies are governed by our <Link href="/cookie-policy/">Cookie Policy</Link> and, where required, are only set after you consent.</p>
      <h3>Advertising</h3><p>If we introduce advertising, ad partners may use cookies or similar technologies subject to consent where required. We will name active partners here when that happens.</p>
      <h3>Your choices</h3><ul><li>Withdraw or change consent at any time from the cookie settings.</li><li>Use browser controls to block or clear cookies.</li><li>Contact us at <a href="mailto:hello@yardagelab.com">hello@yardagelab.com</a> with any privacy request.</li></ul>
      <h3>Contact</h3><p>Questions about privacy? Email <a href="mailto:hello@yardagelab.com">hello@yardagelab.com</a>.</p>
    </ContentPage>
  );
}
