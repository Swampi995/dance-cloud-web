const TermsOfService = () => {
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
              Terms and Conditions
            </h1>
            <p className="mb-8 text-xl text-neutral-400">
              Effective Date: {effectiveDate}
            </p>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Acceptance of Terms
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  These Terms and Conditions of Use (the "Terms of Use") apply
                  to the {appName} mobile application ("{appName}") and any
                  associated services or websites linked to {appName} by its
                  owner and operator, including the {appName} Admin website
                  (collectively, the "App"). The App is the property of{" "}
                  {appName}, its affiliates, and licensors. By using the App,
                  you agree to these Terms of Use; if you do not agree, do not
                  use the App.
                </p>
                <p className="text-xl leading-relaxed text-neutral-300">
                  {appName} reserves the right to change, modify, add, or remove
                  portions of these Terms of Use at any time. It is your
                  responsibility to review these Terms of Use periodically for
                  changes. Your continued use of the App after changes are
                  posted will mean you accept and agree to the changes. As long
                  as you comply with these Terms of Use, you can access and use
                  the App.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Intellectual Property
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  All materials found on the App—such as text, images,
                  interfaces, visual designs, photos, trademarks, logos, audio,
                  music, artwork, and computer code (collectively referred to as
                  "Content")—as well as the organization, arrangement, and
                  presentation of these materials, are the property of {appName}{" "}
                  or are used under appropriate licenses. These materials are
                  protected by copyright, trademark laws, and other intellectual
                  property regulations.
                </p>
                <p className="text-xl leading-relaxed text-neutral-300">
                  Unless explicitly allowed by these Terms of Use, you are
                  prohibited from copying, reproducing, republishing, uploading,
                  sharing, publicly displaying, encoding, or distributing any
                  part of the App or its Content for commercial use without
                  prior written consent from {appName}.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  User Content
                </h2>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    You are responsible for any content you upload, post, or
                    share on the App.
                  </li>
                  <li>
                    You grant {appName} a non-exclusive, worldwide, royalty-free
                    license to use, reproduce, and display your content in
                    connection with the App.
                  </li>
                  <li>
                    Prohibited content includes anything unlawful, abusive,
                    defamatory, or otherwise objectionable.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Acceptance of Terms
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  By accessing or using {appName}, you agree to be bound by
                  these Terms of Service and all applicable laws and
                  regulations. If you do not agree with any of these terms, you
                  are prohibited from using or accessing our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  User Accounts
                </h2>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials.
                  </li>
                  <li>
                    You agree to provide accurate and complete information when
                    creating an account.
                  </li>
                  <li>
                    You are responsible for all activities that occur under your
                    account.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Payment Terms
                </h2>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>All payments are processed securely through Stripe.</li>
                  <li>
                    Subscription fees are billed in advance on a recurring
                    basis.
                  </li>
                  <li>
                    You can cancel your subscription at any time through your
                    account settings.
                  </li>
                  <li>
                    Refunds are handled in accordance with our refund policy.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  User Content
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  You retain all rights to any content you submit, post, or
                  display on or through our services. By submitting content, you
                  grant us a worldwide, non-exclusive license to use, copy,
                  modify, and distribute your content.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Prohibited Activities
                </h2>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Impersonating others or providing false information</li>
                  <li>Interfering with or disrupting our services</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Termination
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We reserve the right to terminate or suspend your account and
                  access to our services at our sole discretion, without notice,
                  for conduct that we believe violates these Terms of Service or
                  is harmful to other users, us, or third parties, or for any
                  other legitimate reason in accordance with applicable laws. If
                  we decide to unilaterally discontinue the App or terminate
                  your access, we will provide notice as required by applicable
                  EU laws. However, in cases of severe violations of these Terms
                  of Use, termination may be immediate.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Changes to Terms
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  We reserve the right to modify these terms at any time. We
                  will notify users of any material changes by updating the
                  effective date at the top of this page.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Use of App
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  You agree not to:
                </p>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    Use any automated systems (e.g., spiders) to access, copy,
                    or monitor the App.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any part of the App
                    or its associated systems.
                  </li>
                  <li>
                    Test the vulnerability of the App's security measures.
                  </li>
                  <li>
                    Interfere with the proper functioning of the App or others'
                    use of it.
                  </li>
                  <li>
                    Use the App or its Content for any unlawful purpose or in
                    violation of these Terms of Use.
                  </li>
                </ul>
                <p className="text-xl leading-relaxed text-neutral-300">
                  {appName} reserves the right to bar any activity that it deems
                  a violation of these Terms of Use.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Accounts, Passwords and Security
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  Certain features of the App may require account registration.
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for any activity that occurs
                  under your account. You agree to notify {appName} immediately
                  of any unauthorized use of your account or any other breach of
                  security. {appName} will not be liable for any loss resulting
                  from unauthorized use of your account.
                </p>
                <p className="text-xl leading-relaxed text-neutral-300">
                  You may not use anyone else's account without their explicit
                  consent. {appName} reserves the right to suspend or terminate
                  accounts found to be in violation of these Terms of Use.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Third-Party Services
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  The App may contain links to other independent third-party
                  applications or providers (e.g., Stripe). These providers are
                  used solely for convenience and are not under {appName}'s
                  control. {appName} is not responsible for and does not endorse
                  the content on third-party providers. You are responsible for
                  making your own decisions regarding interactions with such
                  providers.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Disclaimers
                </h2>
                <ul className="ml-6 list-disc space-y-3 text-xl leading-relaxed text-neutral-300">
                  <li>
                    {appName} does not guarantee that the App or its Content
                    will be error-free or uninterrupted, or that defects will be
                    corrected.
                  </li>
                  <li>
                    The App is provided "as is" and "as available" without
                    warranties of any kind, express or implied.
                  </li>
                  <li>
                    {appName} is not responsible for third-party acts,
                    omissions, or conduct in connection with or related to your
                    use of the App. Your sole remedy for dissatisfaction with
                    the App is to stop using it.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Limitation of Liability
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  To the fullest extent permitted by law, {appName} shall not be
                  liable for any damages, including lost profits, data loss, or
                  business interruption, arising out of your use of the App.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Indemnity</h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  You agree to indemnify and hold harmless {appName}, its
                  affiliates, officers, and employees from claims, losses,
                  liabilities, or expenses arising out of your use of the App or
                  violation of these Terms of Use.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Termination
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  {appName} may terminate or suspend your access to the App
                  without notice for violations of these Terms of Use or other
                  agreements. Upon termination, your rights to use the App cease
                  immediately.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Governing Law and Jurisdiction
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  These Terms of Use are governed by the laws of Romania. Any
                  disputes arising under these Terms of Use will be subject to
                  the exclusive jurisdiction of the courts in Cluj-Napoca.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Contact Us
                </h2>
                <p className="text-xl leading-relaxed text-neutral-300">
                  For questions or concerns about these Terms of Use, please
                  contact us at:
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
                By using our services, you acknowledge that you have read and
                understand these Terms and Conditions and agree to be bound by
                them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
