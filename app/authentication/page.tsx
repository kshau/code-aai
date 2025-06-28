'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'

const Login = () => {
	const searchParams = useSearchParams();
	const [isLogin, setIsLogin] = useState(true)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const { status, signIn, signUp } = useAuth()
	const router = useRouter();


	useEffect(() => {
		if (searchParams.get('signup') === 'true') {
			setIsLogin(false)
			router.replace('/authentication', { scroll: false })
		}
	}, [searchParams])
	useEffect(() => {
		if (status == "authenticated") {
			router.push("/dashboard")
		}

	}, [status])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('') // reset error

		if (!isLogin && password !== confirmPassword) {
			setError("Passwords don't match.")
			return
		}

		try {
			if (isLogin) {
				await signIn(email, password)
			} else {
				await signUp(email, password)
			}

		} catch (err: unknown) {
			let errorMessage = 'Something went wrong. Please try again.'

			if (err instanceof Error) {
				const msg = err.message.toLowerCase()

				if (msg.includes('user not found')) {
					errorMessage = 'No account found with that email.'
				} else if (msg.includes('wrong password')) {
					errorMessage = 'Incorrect password. Try again.'
				} else if (msg.includes('email already')) {
					errorMessage = 'An account with this email already exists.'
				} else if (msg.includes('network')) {
					errorMessage = 'Network issue. Please check your connection.'
				} else {
					errorMessage = err.message
				}
			}

			setError(errorMessage)
		}
	}

	return (
		<div className="flex w-screen h-screen">
			<div className="w-screen lg:w-2/5 p-10 flex flex-col justify-between items-center">
				<Link href="/" className="flex items-center justify-center mb-6">
					<Image src={logo} alt="Logo" width={50} height={50} className="rounded-full" />
					<span className="font-bold text-2xl ml-2">CodeAAI</span>
				</Link>

				<div className="flex flex-col justify-center w-full items-center">
					<h2 className="text-2xl font-semibold">{isLogin ? 'Welcome Back' : 'Create an account'}</h2>
					<h3 className='text-sm text-muted-foreground mb-8'>
						{isLogin
							? 'Welcome back to CodeAAI. Enter your details below.'
							: 'Join CodeAAI and level up your CS skills'}
					</h3>

					<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
						<Input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{!isLogin && (
							<Input
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						)}

						<Button type="submit" className="w-full">
							{isLogin ? 'Login' : 'Sign Up'}
						</Button>
					</form>



					<p className="mt-4 text-sm text-gray-500">
						{isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
						<button
							type="button"
							className="text-blue-600 hover:underline ml-1"
							onClick={() => {
								setIsLogin(!isLogin)
								setError('')
							}}
						>
							{isLogin ? 'Sign up' : 'Login'}
						</button>
					</p>
				</div>
				<div>
					<div className="w-full min-h-10 max-w-sm mb-6 mt-4 bg-red-100 text-red-700 p-2 rounded text-sm border border-red-300 transition-all" style={{ opacity: error ? 100 : 0 }}>
						{error}
					</div>
					<h3 className='text-xs text-muted-foreground mb-8 max-w-64 text-center'>
						By using CodeAAI, you agree to the{' '}
						<Link className='underline' href="/privacy-policy">terms of service</Link> and{' '}
						<Link className='underline' href="/privacy-policy">privacy policy</Link>.
					</h3>
				</div>
			</div>

			<div className="lg:w-3/5 relative hidden lg:flex items-center justify-center bg-[url('/graphics/authentication-background.png')] overflow-hidden">
				<div className="bg-secondary aspect-square rounded-full flex justify-center p-20">
					<Image
						src={`/graphics/${isLogin ? "undraw_typing-code_6t2b.svg" : "undraw-proud-coder.svg"}`}
						className="w-[20rem]"
						alt="graphic 1"
						width={400}
						height={300}
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	)
}

export default Login
