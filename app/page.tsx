"use client";

import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import LandingSignupForm from "@/components/landing/LandingSignupForm";
import Link from "next/link";

export default function Landing() {
  return (
    <Navbar className="flex flex-col md:flex-row justify-center items-center px-4 gap-8 lg:gap-24 py-16 md:py-0">
      <div className="flex flex-col my-auto max-w-md">
        <h1 className="text-3xl font-bold mx-auto mb-4">Welcome to CodeAAI!</h1>
        <img
          src="/graphics/undraw-proud-coder.svg"
          alt="Proud Coder"
          className="w-72 mx-auto my-4"
        />
        <p className="text-md mb-8 mt-2">
          Jumpstart your coding journey with Codeaai, where beginners in Forsyth
          County can tackle fun challenges and compete for a{" "}
          <span className="font-bold text-primary">$500</span> cash prize!
          Brought to you by the Coding Club at Alliance Academy for Innovation
        </p>
        <div className="flex flex-col items-center">
          <div className="flex justify-center space-x-4">
            <Image
              src="/placeholder.svg?height=30&width=100"
              alt="Sponsor 1"
              width={100}
              height={30}
            />
            <Image
              src="/placeholder.svg?height=30&width=100"
              alt="Sponsor 2"
              width={100}
              height={30}
            />
            <Image
              src="/placeholder.svg?height=30&width=100"
              alt="Sponsor 3"
              width={100}
              height={30}
            />
          </div>
          <span className="text-sm text-center mt-4">
            If you are interested in becoming a sponsor of CodeAAI, email us at{" "}
            <Link
              href={"mailto:contact.codeaai@gmail.com"}
              className="text-primary underline"
            >
              contact.codeaai@gmail.com
            </Link>
          </span>
        </div>
      </div>
      <LandingSignupForm />
    </Navbar>
  );
}
