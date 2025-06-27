"use client"
import { Button } from "@/components/ui/button"
import { Code2, DollarSign, Info, Medal, UserPlus } from "lucide-react"
import Navbar from "@/components/navbar/Navbar"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <Navbar dynamic={true} footer={true}>
      <header className="bg-gray-50 flex flex-col justify-center items-center w-full h-screen gap-6 px-4 sm:px-6 md:px-8 lg:px-16 text-center sm:text-left" id="about">
        <motion.div
          className="flex flex-col gap-12 lg:flex-row lg:gap-24 xl:gap-52 justify-center items-center z-40 mb-6 sm:mb-10 "
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
                    Register Now
                    <UserPlus className="mr-2" />
                  </span>
                </Button>
              </Link>
              <Link href="/#howitworks">
                <Button className="mt-2 p-3 sm:p-4 md:p-6 w-full sm:w-56" size="lg" variant="outline" asChild>
                  <span>
                    Learn More
                    <Info className="mr-2" />
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
      </header>
      <section
        id="benefits"
        className="w-full flex flex-col lg:flex-row justify-center items-center py-12 md:py-36 px-4 md:px-8 lg:px-16 gap-8 lg:gap-24"
      >
        <motion.div
          className="flex flex-col px-4 sm:px-0 text-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-base text-primary font-semibold mb-2">Why us?</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
            How CodeAAI helps YOU!
          </p>
          <p className="text-muted-foreground leading-relaxed">
            CodeAAI is designed to help beginners get better at competitive coding in a way thats FUN!
          </p>
          <div className="flex flex-col md:flex-row items-start justify-center gap-12 mt-8">
            {/* Benefit 1 */}
            <div className="flex flex-col text-center items-center w-full max-w-xs">
              <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <p className="text-lg font-semibold text-black mb-1">Earn Cash Prizes</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Win real money just by doing what you already love — coding! Compete and cash out.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col text-center items-center w-full max-w-xs">
              <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                <Medal size={20} />
              </div>
              <p className="text-lg font-semibold text-black mb-1">Get Better at USACO</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We train you with problem sets modeled on real USACO questions. It's grind time, but smarter.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col text-center items-center w-full max-w-xs">
              <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                <Code2 size={20} />
              </div>
              <p className="text-lg font-semibold text-black mb-1">Improve Your Coding Skills</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Practice makes progress. Build confidence, speed, and style — one challenge at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      {/* Features Section */}
      <section className="w-full flex flex-col items-center px-4 md:px-16 py-48 gap-24 bg-gray-50" id="features">
        {/* Feature 1 */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/graphics/undraw-proud-coder.svg"
            alt="Pair programming"
            width={500}
            height={400}
            className="w-full max-w-md lg:max-w-xl"
          />
          <div className="flex flex-col text-left">
            <p className="text-primary font-semibold mb-2 text-sm">Feature 1</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Real-Time Collaboration</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              Work together with your teammates in real time. Built-in code sharing and problem-solving sessions make it easy to learn as a group.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          className="flex flex-col lg:flex-row-reverse items-center gap-12 max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/graphics/undraw-proud-coder.svg"
            alt="Progress tracking"
            width={500}
            height={400}
            className="w-full max-w-md lg:max-w-xl"
          />
          <div className="flex flex-col text-left">
            <p className="text-primary font-semibold mb-2 text-sm">Feature 2</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              See how you improve over time with visual progress tracking, XP points, and rank badges. Every challenge counts.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Image
            src="/graphics/undraw-proud-coder.svg"
            alt="Custom challenges"
            width={500}
            height={400}
            className="w-full max-w-md lg:max-w-xl"
          />
          <div className="flex flex-col text-left">
            <p className="text-primary font-semibold mb-2 text-sm">Feature 3</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Custom Challenges</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              Solve personalized challenges tailored to your skill level and goals. Whether you're a beginner or a USACO gold contestant, there's a path for you.
            </p>
          </div>
        </motion.div>
      </section>

      <section
        className="w-full flex flex-col lg:flex-row justify-center items-center py-16 md:py-24 lg:pb-48 px-4 md:px-8 lg:px-16 gap-8 lg:gap-32"
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
          <p className="mt-2 mb-12 text-sm md:text-base">
            CodeAAI is completely free for high school students. Sign up with just your parent&apos;s email using the form on
            the right to register. You will be contacted if approved! Only appropriate usernames will be approved.
          </p>
          <div className="relative inline-block rounded-lg p-[1px] bg-[length:300%_300%] animate-gradient border border-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            <Button className="bg-blue-50 text-blue-800 font-semibold hover:bg-gray-50 rounded-md px-6 py-3 w-full" asChild>
              <Link href={"/authentication?signup=true"} >

                Try it free TODAY
                <UserPlus className="ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <Image
          alt="people"
          src="/graphics/undraw-proud-coder.svg"
          width={400}
          height={300}
          className="w-full max-w-[500px] h-auto mt-16 sm:mt-0"
          loading={"lazy"}
        />
      </section>
    </Navbar>
  )
}

