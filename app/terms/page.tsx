import Navbar from '@/components/navbar/Navbar'
import { Card } from '@/components/ui/card'
import React from 'react'

export default function TermsOfUse() {
    return (
        <Navbar footer={true}>
            <div className='w-full h-screen flex justify-center items-center'>
                <Card className='max-w-[40vw] p-8  overflow-auto'>
                    <h1 className="text-xl font-bold">Terms of Use</h1>
                    <h3 className='text-muted-foreground  mb-4'>Last Updated on February 15th, 2025</h3>

                    <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
                    <p className="mb-2">By using CodeAAI.org, you agree to comply with these Terms of Use. If you do not agree, do not use the Website.</p>

                    <h2 className="text-lg font-semibold">2. Purpose</h2>
                    <p className="mb-2">CodeAAI.org provides coding challenges and educational resources to help users improve their programming skills. The Website is intended for learning, practice, and constructive discussion.</p>

                    <h2 className="text-lg font-semibold">3. Prohibited Activities</h2>
                    <ul className="list-disc ml-5 mb-2">
                        <li><strong>Cheating:</strong> Engaging in solution sharing is strictly prohibited. AI usage is allowed, however.</li>
                        <li><strong>Disrespecting Others:</strong> Engaging in harassment, hate speech, or any behavior that creates a hostile environment.</li>
                        <li><strong>Disrupting the Platform:</strong> Exploiting vulnerabilities, spamming, or interfering with the Website’s normal operation.</li>
                    </ul>

                    <h2 className="text-lg font-semibold">4. Consequences of Violations</h2>
                    <p className="mb-2">Failure to comply with these Terms will result in permanent removal from CodeAAI.org.</p>

                    <h2 className="text-lg font-semibold">5. Changes to Terms</h2>
                    <p className="mb-2">We may update these Terms of Use from time to time. Continued use of CodeAAI.org constitutes acceptance of any modifications.</p>

                    <h2 className="text-lg font-semibold">6. Contact Us</h2>
                    <p className="mb-2">For any questions about these Terms, contact us at <a href="mailto:contact.codeaai@gmail.com" className="text-blue-500 underline">contact.codeaai@gmail.com</a>.</p>
                </Card>
            </div>
        </Navbar>
    )
}
