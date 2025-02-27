import Navbar from '@/components/navbar/Navbar'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function PrivacyPolicy() {
    return (
        <Navbar footer={true}>
            <div className='w-full h-screen flex justify-center items-center '>
                <Card className='max-w-[60vw] p-8  mt-16 overflow-auto'>
                    <h1 className="text-xl font-bold">Privacy Policy</h1>
                    <h3 className='text-muted-foreground  mb-4'>Last Updated on February 15th, 2025</h3>
                    <h2 className="text-lg font-semibold">1. Information We Collect</h2>
                    <p className="mb-4">CodeAAI.org collects the parent email addresses of users solely for the purpose of contacting participants regarding rewards and prizes. We do not collect any other sensitive information from users, aside from a username and password.</p>


                    <h2 className="text-lg font-semibold">2. Who Can Use CodeAAI.org</h2>
                    <p className="mb-4">Users must be legally enrolled in high school to compete. If you are under 18, you may use the platform only with appropriate eligibility verification.</p>

                    <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
                    <p className="mb-4">We do not sell, share, or misuse collected email addresses. They are used strictly for competition-related communication, including notifying winners and distributing prizes.</p>

                    <h2 className="text-lg font-semibold">4. Data Protection</h2>
                    <p className="mb-4">We implement reasonable security measures to protect user information but cannot guarantee absolute security. We are not liable for any breaches in security. Use CodeAAI at your own risk.</p>

                    <h2 className="text-lg font-semibold">5. Changes to This Policy</h2>
                    <p className="mb-4">We may update this Privacy Policy from time to time. Continued use of CodeAAI.org constitutes acceptance of any modifications.</p>

                    <h2 className="text-lg font-semibold">6. Contact Us</h2>
                    <p className="mb-4">For any privacy concerns, contact us at <Link href="mailto:contact.codeaai@gmail.com" className="text-blue-500 underline">contact.codeaai@gmail.com</Link>.</p>
                </Card>
            </div>
        </Navbar>
    )
}
