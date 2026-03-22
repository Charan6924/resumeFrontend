export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-[var(--text-primary)] mb-8">
          Terms of Service
        </h1>

        <div className="space-y-8 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Sift, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              2. Description of Service
            </h2>
            <p>
              Sift is an AI-powered resume screening platform that helps recruiters find
              candidates using natural language queries. We process and analyze uploaded
              resumes to match them with your search criteria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              3. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must have the right to upload any resumes or documents you submit</li>
              <li>You agree not to misuse the service or attempt to access it through unauthorized means</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              4. Data Privacy
            </h2>
            <p>
              We take data privacy seriously. Uploaded resumes and candidate information
              are processed securely and used only for the purpose of providing our
              screening service. We do not sell or share your data with third parties
              for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              5. Intellectual Property
            </h2>
            <p>
              The Sift platform, including its design, features, and underlying technology,
              is owned by us and protected by intellectual property laws. You retain
              ownership of any data you upload to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              Sift is provided &quot;as is&quot; without warranties of any kind. We are not liable
              for any hiring decisions made based on our service. AI-powered screening
              is a tool to assist your process, not replace human judgment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              7. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the service
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              8. Contact
            </h2>
            <p>
              If you have questions about these terms, please contact us at{' '}
              <a href="mailto:support@sift.app" className="text-blue-600 hover:underline">
                support@sift.app
              </a>
            </p>
          </section>

          <p className="text-[var(--text-muted)] text-sm pt-8 border-t border-[var(--border-primary)]">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  )
}
