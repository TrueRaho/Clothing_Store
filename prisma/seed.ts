import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Очищаем существующие данные
  await prisma.product.deleteMany()

  // Добавляем товары
  const products = [
    // Пижамы
    {
      name: "Пижама 'Уют'",
      price: 1200,
      description: "Мягкая пижама из хлопка",
      composition: "100% хлопок",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["белый", "серый"],
      sizes: ["S", "M", "L"],
      category: "pajamas"
    },
    {
      name: "Пижама 'Мечта'",
      price: 1500,
      description: "Шелковая пижама",
      composition: "100% шелк",
      care: "Ручная стирка",
      image: "/placeholder.svg",
      colors: ["бежевый", "черный"],
      sizes: ["XS", "S", "M"],
      category: "pajamas"
    },
    {
      name: "Пижама 'Комфорт'",
      price: 1300,
      description: "Фланелевая пижама",
      composition: "100% хлопок",
      care: "Стирка при 40°C",
      image: "/placeholder.svg",
      colors: ["красный", "синий"],
      sizes: ["M", "L", "XL"],
      category: "pajamas"
    },
    {
      name: "Пижама 'Нежность'",
      price: 1400,
      description: "Шелковая пижама с кружевом",
      composition: "100% шелк",
      care: "Ручная стирка",
      image: "/placeholder.svg",
      colors: ["розовый", "белый"],
      sizes: ["S", "M", "L"],
      category: "pajamas"
    },
    // Халаты
    {
      name: "Халат 'Комфорт'",
      price: 2500,
      description: "Махровый халат",
      composition: "100% хлопок",
      care: "Стирка при 40°C",
      image: "/placeholder.svg",
      colors: ["белый", "голубой"],
      sizes: ["M", "L", "XL"],
      category: "robes"
    },
    {
      name: "Халат 'Шелковый'",
      price: 3000,
      description: "Шелковый халат",
      composition: "100% шелк",
      care: "Ручная стирка",
      image: "/placeholder.svg",
      colors: ["розовый", "черный"],
      sizes: ["S", "M", "L"],
      category: "robes"
    },
    {
      name: "Халат 'Уютный'",
      price: 2800,
      description: "Флисовый халат",
      composition: "100% полиэстер",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["серый", "бежевый"],
      sizes: ["S", "M", "L", "XL"],
      category: "robes"
    },
    {
      name: "Халат 'Элегант'",
      price: 3200,
      description: "Шелковый халат с поясом",
      composition: "100% шелк",
      care: "Ручная стирка",
      image: "/placeholder.svg",
      colors: ["бордовый", "черный"],
      sizes: ["M", "L"],
      category: "robes"
    },
    // Костюмы
    {
      name: "Костюм 'Домашний'",
      price: 2000,
      description: "Трикотажный костюм",
      composition: "100% хлопок",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["серый", "черный"],
      sizes: ["S", "M", "L"],
      category: "suits"
    },
    {
      name: "Костюм 'Спортивный'",
      price: 1800,
      description: "Спортивный костюм",
      composition: "95% хлопок, 5% эластан",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["синий", "черный"],
      sizes: ["M", "L", "XL"],
      category: "suits"
    },
    {
      name: "Костюм 'Классика'",
      price: 2200,
      description: "Классический домашний костюм",
      composition: "100% хлопок",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["бежевый", "белый"],
      sizes: ["S", "M", "L"],
      category: "suits"
    },
    {
      name: "Костюм 'Уют'",
      price: 1900,
      description: "Мягкий домашний костюм",
      composition: "100% хлопок",
      care: "Стирка при 30°C",
      image: "/placeholder.svg",
      colors: ["розовый", "серый"],
      sizes: ["XS", "S", "M"],
      category: "suits"
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 