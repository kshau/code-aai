"use client";

import Navbar from "@/components/navbar/navbar";
import SignupForm from "@/components/landing/signupForm";

export default function Signup() {
  return (
    <Navbar>
      <div className="flex flex-wrap gap-16 justify-center mt-32 p-4">
        <div className="flex flex-col my-auto">
          <img
            src="/undraw-proud-coder.svg"
            alt="Proud Coder"
            className="w-96"
          />
          <span className="text-3xl font-bold max-w-md mb-2 mt-10">
            Sign up for Code AAI
          </span>
          <span className="text-md font-light max-w-md">
            Cosiva is dedicated to teaching kids coding through fun, hands-on
            projects, while preparing them for the future with concepts like AI
            and other emerging technologies.
          </span>
        </div>

        <SignupForm />
      </div>
    </Navbar>
  );
}
