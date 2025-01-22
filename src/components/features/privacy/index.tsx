const PrivacyPolicy = () => {
  const effectiveDate = "January 21, 2025";
  const appName = "DanceCloud";
  const contactEmail = "contact@smpath.com";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#0e080e] to-[#0d0612]">
      <div className="container mx-auto py-16">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-[#b248f433] p-12 backdrop-blur-sm before:absolute before:inset-0 before:rounded-[32px] before:bg-gradient-to-b before:from-white/10 before:via-white/5 before:to-transparent before:p-[1px]">
          {/* Content wrapper */}
          <div className="relative z-10">
            <h1 className="mb-2 text-[56px] font-semibold leading-tight tracking-[-0.02em] text-white">
              Privacy Policy
            </h1>
            <p className="mb-8 text-xl text-neutral-400">
              Effective Date: {effectiveDate}
            </p>

            <div className="space-y-8">
              <section>
                <p className="text-xl leading-relaxed text-neutral-300">
                  At {appName}, we take your privacy seriously and are committed
                  to protecting your personal data. This Privacy Policy explains
                  how we collect, use, store, and protect your information when
                  you use our app or website.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  1. Types of Data Collected
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We collect the following types of data to provide and improve
                  our services:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Personal Information: Name, email address, and encrypted
                    password.
                  </li>
                  <li>
                    Payment Information: Credit card details for payment
                    processing via Stripe.
                  </li>
                  <li>
                    Login Information: Information needed for authentication
                    through third-party services such as Facebook, Google, and
                    Apple login.
                  </li>
                  <li>
                    Other Information: Additional details necessary for account
                    creation and authentication via email/password or
                    third-party services.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  2. Methods of Collection
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We collect data through the following methods:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Forms: When you create an account, update your profile, or
                    make payments, we collect data via forms.
                  </li>
                  <li>
                    Third-Party Services: We use Google, Facebook, and Apple
                    login services to authenticate users. These third-party
                    services may collect additional information in accordance
                    with their own privacy policies.
                  </li>
                  <li>
                    Stripe: Payment details are collected and processed through
                    Stripe, our trusted payment provider.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  3. Data Usage
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  The data we collect is used for the following purposes:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Account Management: To enable login and user authentication
                    via email/password or third-party logins (Google, Facebook,
                    Apple).
                  </li>
                  <li>
                    Service Improvement: To enhance our app's functionality and
                    user experience.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  4. Data Sharing
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We share your information with trusted third parties for the
                  following purposes:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Firebase: We use Firebase for storing user account data and
                    managing login details, ensuring secure and efficient data
                    storage and management.
                  </li>
                  <li>
                    Payment Provider (Stripe): Your payment details, including
                    credit card information, are securely handled by Stripe,
                    which is responsible for processing transactions.
                  </li>
                </ul>
                <p className="text-xl leading-relaxed text-neutral-300">
                  These third parties are contractually obligated to protect
                  your personal data and only use it for the purposes outlined
                  in this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  5. User Rights
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  As a user, you have the right to:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Access: Request a copy of the personal data we hold about
                    you.
                  </li>
                  <li>
                    Update: Correct any inaccurate or incomplete information.
                  </li>
                  <li>
                    Delete: Request deletion of your personal data. Please note
                    that deleting your data may affect your ability to use some
                    features of the app, and you may lose access to your
                    account.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  6. Data Security
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We take data security seriously:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Google/Facebook Login: When using Google or Facebook login,
                    your login credentials are managed by these platforms, which
                    implement strong security measures.
                  </li>
                  <li>
                    Email/Password Login: If you use email and password login,
                    your credentials are securely stored by Firebase, which
                    employs state-of-the-art security practices.
                  </li>
                  <li>
                    Payment Information: Stripe handles all payment-related
                    information and uses robust security protocols, making it
                    one of the most trusted payment providers in Romania and
                    internationally.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  7. Data Retention
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We retain your data from the moment you create an account
                  until you delete it. Your data will be retained for as long as
                  necessary to fulfill the purposes outlined in this Privacy
                  Policy or as required by law.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  8. Cookies
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We do not use cookies to track or store information on your
                  device.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  9. Changes to This Privacy Policy
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We may update this Privacy Policy from time to time. When we
                  do, we will notify you by updating the "Effective Date" at the
                  top of this page. Please review this Privacy Policy
                  periodically for any changes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  10. Contact Us
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  If you have any questions or concerns about this Privacy
                  Policy or how your data is handled, please contact us at:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>Email: {contactEmail}</li>
                  <li>
                    Website:{" "}
                    <a
                      href="https://www.smpath.com"
                      className="text-blue-500 hover:underline"
                    >
                      https://www.smpath.com
                    </a>
                  </li>
                </ul>
              </section>

              <p className="mt-8 border-t border-neutral-800 pt-8 text-lg text-neutral-400">
                By using our services, you agree to the terms outlined in this
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrivacyPolicy };
