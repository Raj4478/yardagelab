'use client';

import { useRef, useState } from 'react';
import { track } from '@/lib/analytics';

// Read semantic text rather than CSS-transformed innerText. Include collapsed
// assumptions, omit decorative SVGs, and preserve readable block boundaries.
function resultText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
  if (!(node instanceof HTMLElement) || node.getAttribute('aria-hidden') === 'true') return '';
  const text = Array.from(node.childNodes).map(resultText).join(' ');
  return text + (/^(DIV|P|LI|DT|DD|SUMMARY|FIGCAPTION|DETAILS)$/.test(node.tagName) ? '\n' : '');
}

/** Copies the current rendered result, including units and assumptions. No measurements in URLs. */
export function ResultActions({ calculatorId, children }: { calculatorId: string; children: React.ReactNode }) {
  const result = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('');
  const [manualCopy, setManualCopy] = useState('');
  const [busy, setBusy] = useState(false);

  function currentText() {
    const tool = result.current?.closest('[data-calculator-tool]');
    const labels = Array.from(tool?.querySelectorAll('label') || []);
    const inputs = Array.from(tool?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-calculator-inputs] input, [data-calculator-inputs] select') || []).map(input => {
      const label = labels.find(label => label.htmlFor === input.id)?.textContent?.trim() || input.getAttribute('aria-label') || 'Value';
      const value = input instanceof HTMLSelectElement ? input.selectedOptions[0]?.textContent : input.type === 'checkbox' ? (input.checked ? 'Yes' : 'No') : input.value;
      return `${label}: ${value}`;
    }).join('\n');
    const units = tool?.querySelector('[role="radio"][aria-checked="true"]')?.textContent;
    const output = result.current ? resultText(result.current).split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n') : '';
    return `${document.querySelector('h1')?.textContent || 'YardageLab calculation'}\n${units ? `Input units: ${units}\n` : ''}${inputs ? `\n${inputs}\n` : ''}\n${output}\n\n${window.location.origin}${window.location.pathname}`;
  }

  function whatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(currentText())}`, '_blank', 'noopener,noreferrer');
    track({ name: 'share_whatsapp', params: { calculator_id: calculatorId } });
    setStatus('WhatsApp opened. Choose a contact and review the message before sending.');
  }

  async function save(share: boolean) {
    const text = currentText();
    setBusy(true);
    setManualCopy('');
    try {
      if (share && typeof navigator.share === 'function') {
        await navigator.share({ title: 'YardageLab calculation', text });
        setStatus('Calculation shared.');
        track({ name: 'share_calculation', params: { calculator_id: calculatorId } });
      } else {
        await navigator.clipboard.writeText(text);
        setStatus('Results copied. Paste them into a note or message.');
        track({ name: 'copy_results', params: { calculator_id: calculatorId } });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setStatus('Sharing cancelled.');
      else {
        setManualCopy(text);
        setStatus('Your browser could not copy automatically. Select and copy the text below.');
      }
    } finally { setBusy(false); }
  }

  return <>
    <div ref={result}>{children}</div>
    <div className="mt-5 border-t border-line pt-4 print:hidden">
      <div className="flex flex-wrap gap-2">
        <button className="btn-ghost" type="button" disabled={busy} onClick={() => save(false)}>Copy results</button>
        <button className="btn-ghost" type="button" disabled={busy} onClick={whatsapp}>WhatsApp</button>
        <button className="btn-ghost" type="button" disabled={busy} onClick={() => save(true)}>Share calculation</button>
      </div>
      <p role="status" className="mt-2 text-sm text-ink-soft">{status}</p>
      {manualCopy && <label className="field-label mt-3">Results to copy<textarea className="field-input mt-2 min-h-48" readOnly value={manualCopy} onFocus={event => event.currentTarget.select()} /></label>}
    </div>
  </>;
}
