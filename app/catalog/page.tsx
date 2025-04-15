import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { prisma } from '@/lib/prisma'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany()
  return products
}

export default async function Catalog() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl mb-8">Каталог</h1>

        <div className="border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center space-x-8">
            <div>
              <label className="block mb-1 text-sm">Размер</label>
              <select className="border border-gray-200 p-1 w-32">
                <option>Все размеры</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Материал</label>
              <select className="border border-gray-200 p-1 w-32">
                <option>Все материалы</option>
                <option>Хлопок</option>
                <option>Лен</option>
                <option>Шелк</option>
                <option>Фланель</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Цвет</label>
              <select className="border border-gray-200 p-1 w-32">
                <option>Все цвета</option>
                <option>Белый</option>
                <option>Бежевый</option>
                <option>Серый</option>
                <option>Черный</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Цена</label>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="от" className="border border-gray-200 p-1 w-20" />
                <span>—</span>
                <input type="number" placeholder="до" className="border border-gray-200 p-1 w-20" />
              </div>
            </div>

            <div className="flex items-center mt-5">
              <input type="checkbox" id="inStock" className="mr-2" />
              <label htmlFor="inStock">В наличии</label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
