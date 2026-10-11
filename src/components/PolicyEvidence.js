import Link from 'next/link';

// Shows the exact policy text behind a finding, so the reviewer can check the AI's claim.
export default function PolicyEvidence({ ids = [], policyById }) {
  if (!ids.length) return <div className="small" style={{ color: 'var(--warn)' }}>No policy citation. Treat this statement as unverified.</div>;
  return (
    <>
      {ids.map((id) => {
        const s = policyById[id];
        return (
          <details className="evidence" key={id}>
            <summary>{id}{s ? `: ${s.title}` : ''}</summary>
            <p>{s ? s.text : 'Section not found in the current policy.'} <Link href={`/policy#${id}`}>View in policy</Link></p>
          </details>
        );
      })}
    </>
  );
}
