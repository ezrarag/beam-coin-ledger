export default function RedemptionPolicy() {
  return (
    <article className="prose max-w-3xl mx-auto p-6">
      <h1>BEAM Coin Redemption Policy</h1>

      <p><strong>Effective Date:</strong> October 30, 2025</p>

      <h2>1. Eligibility</h2>
      <p>
        Only registered participants with verified Stripe Connect accounts may redeem BEAM for U.S. dollars.
      </p>

      <h2>2. Minimum and Maximum Redemption</h2>
      <ul>
        <li>Minimum redemption amount: 100 BEAM ($100 USD equivalent)</li>
        <li>Maximum redemption per week: 500 BEAM ($500 USD)</li>
      </ul>

      <h2>3. Fees</h2>
      <p>
        A 0.5% service fee is deducted from each redemption to support BEAM operations and transaction costs.
        Instant payouts to debit cards incur an additional fee as listed by Stripe.
      </p>

      <h2>4. Processing Timeline</h2>
      <p>
        Approved redemptions are processed within 1–3 business days after administrative review.
      </p>

      <h2>5. Funding and Reserve Policy</h2>
      <p>
        BEAM maintains a designated reserve account equal to or greater than 100% of outstanding redeemable BEAM.
        Redemption requests may be paused if reserves fall below this threshold.
      </p>

      <h2>6. Auditing and Transparency</h2>
      <p>
        Aggregate issuance and redemption data are publicly viewable on the BEAM Impact Ledger page.
      </p>

      <h2>7. Amendments</h2>
      <p>
        BEAM may revise this policy with notice to participants. The latest version supersedes all previous versions.
      </p>

      <h2>8. Contact</h2>
      <p>
        For support or redemption questions, contact treasury@beamthinktank.space.
      </p>
    </article>
  );
}

