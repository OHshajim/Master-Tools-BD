import { useBrandContext } from '@/hooks/useBrandContext';

const PrivacyPolicy = () => {
  const { brandInfo } = useBrandContext();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="text-muted-foreground mb-8">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
          <p className="text-foreground/80 mb-4">
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
          </p>
          
          <h3 className="text-xl font-medium text-foreground mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Name and email address</li>
            <li>Phone number</li>
            <li>Payment information</li>
            <li>Account credentials</li>
            <li>Communications with us</li>
          </ul>

          <h3 className="text-xl font-medium text-foreground mb-2">Usage Information</h3>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Click patterns and user preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
          <p className="text-foreground/80 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and promotional offers</li>
            <li>Monitor and analyze trends and usage patterns</li>
            <li>Detect, investigate, and prevent fraudulent activities</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
          <p className="text-foreground/80 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>With service providers who help us operate our platform</li>
            <li>To comply with legal obligations or respond to legal requests</li>
            <li>To protect our rights, property, or safety, or that of others</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
          <p className="text-foreground/80 mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibent text-foreground mb-4">5. Data Retention</h2>
          <p className="text-foreground/80 mb-4">
            We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
          <p className="text-foreground/80 mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
          <p className="text-foreground/80 mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences, though this may affect some functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Links</h2>
          <p className="text-foreground/80 mb-4">
            Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
          <p className="text-foreground/80 mb-4">
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
          <p className="text-foreground/80 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
          <p className="text-foreground/80 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="text-foreground/80">
            <p>Email: {brandInfo.supportEmail}</p>
            <p>Phone: {brandInfo.contactNumber}</p>
            <p>Platform: {brandInfo.platformName}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;