import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Editorial Policy', description: 'How YardageLab researches, reviews, tests and publishes its calculators and guides.', path: '/editorial-policy/' });

export default function Page() {
  return (
    <ContentPage title="Editorial Policy" intro="How we make sure every calculator and guide is accurate, original and genuinely useful." breadcrumbName="Editorial Policy" breadcrumbPath="/editorial-policy/">
      <h3>Our standard</h3><p>YardageLab publishes tools, not filler. Before a calculator or guide goes live it must solve a clear task better than what’s already easily found, and it must be verified by a person.</p>
      <h3>How a calculator is made</h3><ol><li>Identify a real user task and confirm no existing page already solves it.</li><li>Research the formula and assumptions from credible domain sources.</li><li>Implement the math as a pure, typed function with automated golden tests.</li><li>Human domain review of the formula and edge cases.</li><li>Accessibility and mobile review.</li><li>Publish, then monitor for real-world corrections.</li></ol>
      <h3>How we use AI</h3><p>We may use AI assistance for brainstorming, code scaffolding, drafting explanations and copyediting. We do <strong>not</strong> use it to mass-produce pages, invent authors or expertise, fabricate reviews, or paraphrase other sites. A human verifies every calculation and reviews every page before publishing.</p>
      <h3>Corrections</h3><p>When a formula problem is reported or found, we treat it as high priority: reproduce it, add a failing test, fix the math, get domain review, and update the “last reviewed” date if the assumptions changed.</p>
      <h3>What we don’t do</h3><ul><li>No keyword doorway pages or near-duplicate tools.</li><li>No copied or lightly-reworded competitor content.</li><li>No fake experience, authorship, ratings or reviews.</li><li>No publishing untested calculations.</li></ul>
    </ContentPage>
  );
}
