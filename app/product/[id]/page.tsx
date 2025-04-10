import Image from "next/image"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"

// Mock data for a single product
const product = {
  id: "1",
  name: "Пижама из хлопка",
  price: 3990,
  description: "Пижама из 100% органического хлопка. Свободный крой, минималистичный дизайн без лишних деталей.",
  composition: "100% органический хлопок",
  care: "Машинная стирка при 30°, не отбеливать, гладить при низкой температуре",
  image: "/placeholder.svg?height=600&width=600",
  colors: ["Белый", "Бежевый", "Серый"],
  sizes: ["XS", "S", "M", "L", "XL"],
}

// Mock data for similar products
const similarProducts = [
  { id: "2", name: "Пижама с шортами", price: 3490, image: "/placeholder.svg?height=400&width=400" },
  { id: "3", name: "Пижама фланелевая", price: 4290, image: "/placeholder.svg?height=400&width=400" },
  { id: "4", name: "Пижама шелковая", price: 7990, image: "/placeholder.svg?height=400&width=400" },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="aspect-square relative bg-gray-50">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl mb-2">{product.name}</h1>
            <p className="text-2xl mb-6">{product.price} ₴</p>

            <div className="mb-6">
              <p className="mb-2">Размер</p>
              <div className="flex space-x-2 mb-6">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-[#c1b6ad]"
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="mb-2">Цвет</p>
              <div className="flex space-x-2 mb-6">
                {product.colors.map((color) => (
                  <button key={color} className="px-3 py-1 border border-gray-200 hover:border-[#c1b6ad]">
                    {color}
                  </button>
                ))}
              </div>

              <button className="w-full py-3 bg-[#c1b6ad] text-white mb-8">Добавить в корзину</button>

              <div className="border-t border-gray-100 pt-6">
                <p className="mb-4">{product.description}</p>
                <p className="mb-2">
                  <strong>Состав:</strong> {product.composition}
                </p>
                <p>
                  <strong>Уход:</strong> {product.care}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl mb-6">Похожие товары</h2>
          <div className="grid grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
