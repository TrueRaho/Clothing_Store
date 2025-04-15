import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Header } from "@/components/header"

export default function Cart() {
  return (
    <div className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl mb-8">Корзина</h1>

        <div className="text-center py-12">
          <p className="mb-6">Ваша корзина пуста</p>
          <Link href="/catalog" className="px-8 py-3 bg-[#c1b6ad] text-white">
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  )
}
