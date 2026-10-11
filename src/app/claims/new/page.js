import ClaimForm from '@/components/ClaimForm';

export default function NewClaimPage() {
  return (
    <>
      <h1>New claim</h1>
      <p className="muted">Pick “Other / not sure” if you are unsure of the category; the assistant will suggest one.</p>
      <ClaimForm />
    </>
  );
}
