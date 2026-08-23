import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Terms of Use', description: 'The terms for using YardageLab’s calculators and content.', path: '/terms/' });

export default function Page() {
  return (
    <ContentPage title="Terms of Use" intro="Please use these tools as planning aids, and confirm before you cut." breadcrumbName="Terms" breadcrumbPath="/terms/">
      <blockquote>This is a starter template and not legal advice. Have it reviewed by a qualified professional before you rely on it.</blockquote>
      <h3>Acceptance</h3><p>By using YardageLab, you agree to these terms. If you don’t agree, please don’t use the site.</p>
      <h3>Calculators are estimates</h3><p>Our calculators provide estimates for planning purposes. Fabric behavior, cutting error and project specifics vary. We make no warranty that a result is correct for your particular project, and we are not liable for material bought or cut based on a result. When a project matters, buy a margin of extra fabric and confirm against your own pattern.</p>
      <h3>Acceptable use</h3><ul><li>Don’t misuse the site, attempt to disrupt it, or scrape it aggressively.</li><li>Content and code are provided for personal, lawful use.</li></ul>
      <h3>Intellectual property</h3><p>The YardageLab name, design, original diagrams and written content are ours unless otherwise noted. Please don’t copy them wholesale.</p>
      <h3>Changes</h3><p>We may update these terms; material changes will be reflected on this page.</p>
      <h3>Contact</h3><p>Questions about these terms? Email <a href="mailto:hello@yardagelab.com">hello@yardagelab.com</a>.</p>
    </ContentPage>
  );
}
