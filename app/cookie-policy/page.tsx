import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Cookie Policy', description: 'How YardageLab uses cookies and similar technologies.', path: '/cookie-policy/' });

export default function Page() {
  return (
    <ContentPage title="Cookie Policy" intro="What cookies we use, why, and how to control them." breadcrumbName="Cookie Policy" breadcrumbPath="/cookie-policy/">
      <blockquote>This is a starter template. Update the specific cookies listed below to match the analytics and advertising vendors you actually enable, and have it reviewed for your jurisdictions.</blockquote>
      <h3>What cookies are</h3><p>Cookies are small files a site stores in your browser. Some are essential for a site to function; others help measure usage or support advertising.</p>
      <h3>Categories we may use</h3>
      <table><thead><tr><th>Category</th><th>Purpose</th><th>Consent</th></tr></thead><tbody><tr><td>Essential</td><td>Remember your cookie choices and keep the site working.</td><td>Not required</td></tr><tr><td>Analytics</td><td>Understand which tools are used so we can improve them.</td><td>Where required</td></tr><tr><td>Advertising</td><td>Support ads if introduced; may be set by ad partners.</td><td>Required</td></tr></tbody></table>
      <h3>Managing cookies</h3><p>Where consent is required, non-essential cookies are blocked until you allow them, and you can change your choice at any time. You can also clear or block cookies in your browser settings.</p>
    </ContentPage>
  );
}
