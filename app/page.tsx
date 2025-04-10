import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <section className="container mx-auto py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="aspect-[3/2] relative mb-8">
            <Image
              src="/placeholder.svg?height=800&width=1200"
              alt="Человек в домашней одежде"
              fill
              className="object-cover"
              priority
            />
          </div>
          // check
          <h1 className="text-3xl mb-4">Дом. Ты. И ничего лишнего.</h1>
          <Link
            href="/catalog"
            className="inline-block px-8 py-3 bg-[#c1b6ad] text-white"
          >
            Перейти в каталог
          </Link>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-3 gap-8">
          <Link href="/catalog?category=pajamas" className="block">
            <div className="aspect-square relative mb-3 bg-gray-50">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Пижамы"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl text-center">Пижамы</h2>
          </Link>

          <Link href="/catalog?category=robes" className="block">
            <div className="aspect-square relative mb-3 bg-gray-50">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Халаты"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl text-center">Халаты</h2>
          </Link>

          <Link href="/catalog?category=suits" className="block">
            <div className="aspect-square relative mb-3 bg-gray-50">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Костюмы"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl text-center">Костюмы</h2>
          </Link>
        </div>
      </section>
    </main>
  );
}
