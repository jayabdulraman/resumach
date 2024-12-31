import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> 12/16/2024
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
        <p>
          By accessing or using resumach, you affirm that:
        </p>
        <ul className="list-disc ml-6">
          <li>You are at least 16 years old or have the consent of a legal guardian.</li>
          <li>You have the authority to enter into these Terms.</li>
          <li>You will comply with all applicable laws and regulations while using our services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description of Services</h2>
        <p>
          resumach leverages artificial intelligence to customize resumes based on job descriptions. Our services include:
        </p>
        <ul className="list-disc ml-6">
          <li>A freemium tier with limited customization options.</li>
          <li>A credit purchasing tier with unlimited customization and additional features.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Registration and Security</h2>
        <ul className="list-disc ml-6">
          <li>Provide accurate and complete information during registration.</li>
          <li>Maintain the security of your account credentials.</li>
          <li>Notify us immediately if you suspect unauthorized access to your account.</li>
          <li>Be responsible for all activities conducted under your account.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Subscription and Payments</h2>
        <ul className="list-disc ml-6">
          <li><strong>Freemium Tier:</strong> Basic features are free to use with certain limitations.</li>
          <li><strong>Credit Tier:</strong> Credit purchasing with unlimited customization options.</li>
          <li><strong>Payment Processing:</strong> Payments are handled securely through Stripe. By subscribing, you agree to Stripe’s terms and conditions.</li>
        </ul>
        <p className="mt-2">
          All credit subscriptions fees have a five (5) refund policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acceptable Use Policy</h2>
        <ul className="list-disc ml-6">
          <li>Do not use resumach for any unlawful or unauthorized purposes.</li>
          <li>Do not upload or input content that violates the rights of others or contains harmful material.</li>
          <li>Do not attempt to access, modify, or interfere with the functionality or security of resumach’s services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
        <p>
          resumach retains all rights, title, and interest in the web app, including its content, features, and underlying technology. You may not reproduce, distribute, or create derivative works from our services without prior written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
        <p>
          resumach is provided on an “as-is” and “as-available” basis. We make no guarantees regarding the accuracy, reliability, or suitability of our services for your specific needs. Your use of resumach is at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, resumach is not liable for:
        </p>
        <ul className="list-disc ml-6">
          <li>Indirect, incidental, or consequential damages.</li>
          <li>Loss of data, revenue, or profits resulting from the use or inability to use our services.</li>
        </ul>
        <p className="mt-2">
          Our total liability for any claims shall not exceed the amount paid by you for our services in the past 12 months.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you:
        </p>
        <ul className="list-disc ml-6">
          <li>Violate these Terms.</li>
          <li>Engage in fraudulent or harmful activities.</li>
        </ul>
        <p className="mt-2">
          Upon termination, your access to resumach and associated data may be revoked.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Any changes will be posted with a new effective date. Continued use of resumach after updates constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Governing Law and Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of Arizona. Any disputes arising under these Terms shall be resolved through negotiation, and if unresolved, in the courts of Arizona.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions or concerns about these Terms, please contact us:
        </p>
        <ul className="list-disc ml-6">
          <li>Email: info@ajalloh.com</li>
        </ul>
      </section>

      <p className="text-sm text-gray-500">
        Thank you for choosing resumach to streamline your job search process.
      </p>
    </div>
  );
};
