"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("Неверный email или пароль")
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl mb-8 text-center">Вход в аккаунт</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 bg-[#c1b6ad] text-white">
              Войти
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Нет аккаунта?{" "}
              <Link href="/register" className="text-[#c1b6ad] hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
