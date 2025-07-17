"use client"
import { Button } from "@/components/ui/button"
import { Code2, DollarSign, Info, Medal, UserPlus } from "lucide-react"
import Navbar from "@/components/navbar/Navbar"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <Navbar dynamic={true} footer={true}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-10 filter blur-lg">
          <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400 to-blue-200 opacity-60"></div>
          <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 opacity-50"></div>
          <div className="absolute bottom-72 left-1/3 w-56 h-56 rounded-full bg-gradient-to-l from-purple-600 to-blue-400 opacity-40"></div>
          <div className="absolute bottom-56 right-10 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-500 to-purple-400 opacity-30"></div>

          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 opacity-40"></div>
          <div className="absolute top-80 left-60 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-300 opacity-30"></div>
          <div className="absolute bottom-52 left-0 w-28 h-28 rounded-full bg-gradient-to-tl from-blue-400 to-purple-500 opacity-35"></div>
          <div className="absolute bottom-64 right-0 w-20 h-20 rounded-full bg-gradient-to-bl from-blue-300 to-blue-100 opacity-25"></div>
        </div>
        <header
          id="about"
          className="
        backdrop-blur-3xl z-50
        relative flex flex-col justify-center items-center w-full h-[80vh] pt-20 gap-6 px-4 sm:px-6 md:px-8 lg:px-16 text-center sm:text-left overflow-hidden"
        >

          <motion.div
            className="relative z-10 flex flex-col-reverse lg:flex-row gap-24 xl:gap-52
      rounded-xl p-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-primary font-medium mb-2 text-sm sm:text-base">Welcome to CodeAAI</p>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Compete and <span className="text-primary">Code</span>
              </p>
              <p className="max-w-xs sm:max-w-lg mt-2 text-xs sm:text-sm md:text-base">
                Compete in Alliance&apos;s very own USACO / Competitive Coding practice site! Brought to you by the AAI Coding Club (not directly affiliated with Alliance Acadamy for Innovation as of now)!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-auto">
                <Link href="/authentication?signup=true">
                  <Button className="mt-2 p-3 sm:p-4 md:p-6 w-full sm:w-56" size="lg" asChild>
                    <span>
                      Register Now
                      <UserPlus className="mr-2" />
                    </span>
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button className="mt-2 p-3 sm:p-4 md:p-6 w-full sm:w-56" size="lg" variant="outline" asChild>
                    <span>
                      Learn More
                      <Info className="mr-2" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="self-center relative w-48 sm:w-64 md:w-80 lg:w-[400px]">
              <Image
                src="/graphics/undraw_code-thinking_0vf2.svg"
                alt="graphic 1"
                width={400}
                height={300}
                className="w-full h-auto"
                loading="lazy"
              />

              {/* Scattered icons */}
              <div className="absolute -top-20 left-36 bg-blue-700 rounded-full p-3 shadow-lg">
                <DollarSign size={24} className="text-white" />
              </div>

              <div className="absolute -top-10 -right-10 bg-blue-500 rounded-full p-3 shadow-lg">
                <Medal size={24} className="text-white" />
              </div>

              <div className="absolute -bottom-14 -left-14 bg-blue-600 rounded-full p-3 shadow-lg">
                <Code2 size={24} className="text-white" />
              </div>

              <div className="absolute -bottom-8 -right-6 bg-blue-800 rounded-full p-3 shadow-lg">
                <Info size={24} className="text-white" />
              </div>

              <div className="absolute top-20 -left-20 bg-blue-500 rounded-full p-3 shadow-lg">
                <UserPlus size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        </header>

        <section
          id="benefits"
          className="relative w-full flex justify-center px-4 md:px-8 lg:px-16 z-50"
          style={{ marginBottom: '-10rem' }} // pull the card up to overlap previous section
        >
          <motion.div
            className="max-w-screen-xl w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-16 rounded-3xl shadow-xl border border-gray-300">
              {/* content inside card */}
              <p className="text-base text-primary font-semibold mb-2">Why us?</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                How CodeAAI helps YOU!
              </p>
              <p className="text-muted-foreground leading-relaxed">
                CodeAAI is designed to help beginners get better at competitive coding in a way thats FUN!
              </p>
              <div className="flex flex-col md:flex-row items-start justify-center gap-12 mt-8">
                <div className="flex flex-col text-center items-center w-full max-w-xs">
                  <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white mb-1">Earn Cash Prizes</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Win real money just by doing what you already love — coding! Compete and cash out.
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="flex flex-col text-center items-center w-full max-w-xs">
                  <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                    <Medal size={20} />
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white mb-1">Get Better at USACO</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We train you with problem sets modeled on real USACO questions. It&apos;s grind time, but smarter.
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="flex flex-col text-center items-center w-full max-w-xs">
                  <div className="p-3 mb-4 w-14 h-14 bg-gray-100 border border-gray-200 rounded-full text-blue-500 flex items-center justify-center">
                    <Code2 size={20} />
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white mb-1">Improve Your Coding Skills</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Practice makes progress. Build confidence, speed, and style — one challenge at a time.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>

      {/* Features Section with gray background */}
      <section
        className="w-full flex flex-col items-center px-4 md:px-16 py-56 gap-24 bg-gray-50"
        id="features"
      >
        {/* Feature 1 */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 max-w-screen-xl w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/graphics/landing/dashboard.png"
            alt="Progress Tracking Dashboard"
            width={500}
            height={400}
            className="w-full max-w-md lg:max-w-xl rounded-md"
          />
          <div className="flex flex-col text-left">
            <span className="text-primary font-semibold mb-2 text-lg">Progress Tracking Dashboard</span>
            <span className="text-muted-foreground text-base md:text-md max-w-xl">
              See how you improve over time with visual progress tracking, XP points, and rank badges. Every challenge counts.
            </span>
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
            src="/graphics/landing/challenge.png"
            alt="Challenges that help you learn"
            width={500}
            height={400}
            className="w-full max-w-md lg:max-w-xl rounded-md"
          />
          <div className="flex flex-col text-left">
            <p className="text-primary font-semibold mb-2 text-lg">Challenges That Help You Learn</p>
            <p className="text-muted-foreground text-base md:text-md max-w-xl">
              Solve personalized challenges tailored to your skill level and goals. Whether you&apos;re a beginner or a USACO gold contestant, there&apos;s a path for you.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Call to action section */}
      <section
        className="relative w-full flex flex-col lg:flex-row justify-center items-center py-16 md:py-24 lg:py-56 px-4 md:px-8 lg:px-16 gap-8 lg:gap-32 overflow-hidden"
      >
        {/* Decorative gradient circles background */}
        <div className="pointer-events-none absolute inset-0 z-0 filter blur-lg">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 opacity-30"></div>
          <div className="absolute top-1/4 right-20 w-52 h-52 rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 opacity-25"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full bg-gradient-to-l from-blue-300 to-purple-300 opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-gradient-to-tr from-pink-400 to-blue-300 opacity-20"></div>
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-gradient-to-bl from-purple-400 to-blue-400 opacity-15"></div>
        </div>

        <motion.div
          className="flex flex-col text-left max-w-lg px-4 sm:px-0 relative z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-primary font-bold">Start Today</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold">Sign up FOR FREE!</p>
          <p className="mt-2 mb-12 text-sm md:text-base">
            CodeAAI is completely free for high school students. Sign up with just your parent&apos;s email using the form on the right to register. You will be contacted if approved! Only appropriate usernames will be approved.
          </p>
          <div className="relative inline-block rounded-lg p-[1px] bg-[length:300%_300%] animate-gradient border border-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            <Button className="bg-blue-50 text-blue-800 font-semibold hover:bg-gray-50 rounded-md px-6 py-3 w-full" asChild>
              <Link href={"/authentication?signup=true"}>
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
          className="w-full max-w-[500px] h-auto mt-16 sm:mt-0 relative z-10"
          loading={"lazy"}
        />
      </section>
    </Navbar>
  )
}
