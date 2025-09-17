import { useBrandContext } from '@/hooks/useBrandContext';

const TermsOfService = () => {
  const { brandInfo } = useBrandContext();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="text-muted-foreground mb-8">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
          <p className="text-foreground/80 mb-4">
            By accessing and using {brandInfo.platformName}, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
          <p className="text-foreground/80 mb-4">
            Permission is granted to temporarily download one copy of the materials on {brandInfo.platformName} for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Terms</h2>
          <p className="text-foreground/80 mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Uses</h2>
          <p className="text-foreground/80 mb-4">
            You may not use our service:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>For any unlawful purpose or to solicit others to perform such acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Service Availability</h2>
          <p className="text-foreground/80 mb-4">
            Our service is provided "as is." We do not guarantee that our service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify or discontinue the service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
          <p className="text-foreground/80 mb-4">
            Payment for services is required in advance. All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing at any time with proper notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
          <p className="text-foreground/80 mb-4">
            In no event shall {brandInfo.platformName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {brandInfo.platformName}, even if we have been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy Policy</h2>
          <p className="text-foreground/80 mb-4">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
          <p className="text-foreground/80 mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page. Your continued use of the service after such modifications constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
          <p className="text-foreground/80 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="text-foreground/80">
            <p>Email: {brandInfo.supportEmail}</p>
            <p>Phone: {brandInfo.contactNumber}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;