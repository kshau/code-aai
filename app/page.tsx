"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Code, DollarSign, Info, Megaphone, PlayIcon, UserPlus } from "lucide-react"
import { useRef } from "react"
import Navbar from "@/components/navbar/Navbar"
import LandingSignupForm from "@/components/landing/LandingSignupForm"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import CurvedLinePattern from "@/components/ui/bg"

const sponsors = ["/sponsor1.png", "/sponsor2.png", "/sponsor3.png", "/sponsor4.png"]

const cardData = [
  { icon: UserPlus, title: "Sign up", description: "Sign up for a free account today!" },
  { icon: Megaphone, title: "Get Approved", description: "Parents get emailed with a link to activate your account." },
  { icon: Code, title: "Compete", description: "Solve coding challenges using Java, Python, or C." },
  { icon: DollarSign, title: "Earn Rewards", description: "Top 3 competitors receive cash prizes on March 21st." },
]

export default function Page() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <Navbar dynamic={true} footer={true}>
      <header className="flex flex-col justify-center items-center w-full min-h-[90vh] gap-6 px-4 sm:px-6 md:px-8 lg:px-16 text-center sm:text-left" id="about">
        <motion.div
          className="flex flex-col gap-12 lg:flex-row lg:gap-24 xl:gap-52 justify-center items-center z-40 mb-6 sm:mb-10 md:mt-32"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-primary font-medium mb-2 text-sm sm:text-base">Welcome to CodeAAI</p>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Compete to win <span className="text-primary">$$$</span>
            </p>
            <p className="max-w-xs sm:max-w-lg mt-2 text-xs sm:text-sm md:text-base">
              Compete in Alliance&apos;s very own coding competition and earn cash prizes while growing as a computer
              scientist. Brought to you by the AAI Coding Club!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-auto">
              <Link href="/#signup">
                <Button className="mt-2 p-3 sm:p-4 md:p-6 w-full sm:w-56" size="lg" asChild>
                  <span>
                    <PlayIcon className="mr-2" />
                    Join Now
                  </span>
                </Button>
              </Link>
              <Link href="/#howitworks">
                <Button className="mt-2 p-3 sm:p-4 md:p-6 w-full sm:w-56" size="lg" variant="outline" asChild>
                  <span>
                    <Info className="mr-2" />
                    Learn More
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src="/graphics/undraw_code-thinking_0vf2.svg"
            alt="graphic 1"
            width={250}
            height={96}
            className="w-48 sm:w-64 md:w-80 lg:w-[400px]"
            loading="lazy"
          />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-16 relative bottom-[-60px] sm:bottom-[-40px] md:bottom-[-100px]">
          {sponsors.map((logo) => (
            <p className="p-2 sm:p-4 md:p-8 overline text-xs sm:text-sm md:text-base" key={logo}>
              Your Logo Here
            </p>
          ))}
        </div>
        <div className="absolute z-10 opacity-70 inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </header>

      <section
        id="howitworks"
        ref={ref}
        className="w-full bg-blue-500 py-16 md:py-24 lg:py-64 px-4 md:px-8 lg:px-16 mt-16 md:mt-24 relative"
      >
        <motion.div
          className="flex justify-center items-center flex-col z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">How does it work?</p>
          <p className="text-white text-center max-w-xl mt-2 text-sm md:text-base">
            We provide a competitive and rewarding platform for coders of all skill levels. Here&apos;s how it works...
          </p>
          <div className="gap-4 flex flex-wrap justify-center mt-8 md:mt-16 z-50">
            {cardData.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05, boxShadow: "0px 4px 12px rgba(0, 0, 255, 0.3)", y: -10, transition: { delay: 0 },
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2, scale: { delay: 0 } }}
              >
                <Card className="z-50 w-72 aspect-square flex flex-col items-center justify-center shadow-2xl transition-all group hover:bg-blue-700 shadow-blue-400 cursor-pointer hover:shadow-[0_0_20px_rgba(0,30,205,0.9)]">
                  <Icon size={30} className="text-primary group-hover:text-white" />
                  <div className="flex flex-col items-center justify-start h-[50%]">
                    <p className="font-bold mt-4 md:mt-8 text-base md:text-lg group-hover:text-white">{title}</p>
                    <p className="text-muted-foreground group-hover:text-muted max-w-[80%] md:max-w-[60%] text-center text-sm md:text-base">
                      {description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <CurvedLinePattern />
      </section>

      <section
        id="signup"
        className="w-full flex flex-col lg:flex-row justify-center items-center py-16 md:py-24 lg:py-48 px-4 md:px-8 lg:px-16 gap-8 lg:gap-32"
      >
        <motion.div
          className="flex flex-col text-left max-w-lg  px-4 sm:px-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-primary font-bold">Start Today</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold">Sign up FOR FREE!</p>
          <p className="mt-2 mb-8 lg:mb-16 text-sm md:text-base">
            CodeAAI is completely free for high school students. Sign up with just your parent&apos;s email using the form on
            the right to register. You will be contacted if approved! Only appropriate usernames will be approved.
          </p>
          <Image
            alt="people"
            src="/graphics/undraw-proud-coder.svg"
            width={400}
            height={300}
            className="w-full max-w-[400px] h-auto mt-16 sm:mt-0"
            loading={"lazy"}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-md"
        >
          <LandingSignupForm />
        </motion.div>
      </section>
    </Navbar>
  )
}

