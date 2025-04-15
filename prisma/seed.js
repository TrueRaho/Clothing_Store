const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: "Пижама из хлопка",
      price: 3990,
      description: "Пижама из 100% органического хлопка. Свободный крой, минималистичный дизайн без лишних деталей.",
      composition: "100% органический хлопок",
      care: "Машинная стирка при 30°, не отбеливать, гладить при низкой температуре",
      image: "/placeholder.svg?height=400&width=400",
      colors: ["Белый", "Бежевый", "Серый"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Пижама с шортами",
      price: 3490,
      description: "Легкая пижама с шортами из натурального хлопка. Идеальна для жарких летних ночей.",
      composition: "100% хлопок",
      care: "Машинная стирка при 30°, не отбеливать",
      image: "/placeholder.svg?height=400&width=400",
      colors: ["Голубой", "Розовый", "Серый"],
      sizes: ["S", "M", "L"],
    },
    {
      name: "Пижама фланелевая",
      price: 4290,
      description: "Теплая фланелевая пижама для холодных зимних вечеров.",
      composition: "100% фланель",
      care: "Машинная стирка при 40°, не отбеливать",
      image: "/placeholder.svg?height=400&width=400",
      colors: ["Красный", "Синий", "Зеленый"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Пижама шелковая",
      price: 7990,
      description: "Роскошная шелковая пижама для особых случаев.",
      composition: "100% шелк",
      care: "Ручная стирка, не отбеливать",
      image: "/placeholder.svg?height=400&width=400",
      colors: ["Черный", "Бордовый", "Золотой"],
      sizes: ["XS", "S", "M", "L"],
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
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