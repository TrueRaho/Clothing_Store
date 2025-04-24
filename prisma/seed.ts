import { PrismaClient } from '../lib/generated/prisma'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

async function processImage(imagePath: string): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public')
  const inputPath = path.join(publicDir, imagePath)
  const outputPath = path.join(publicDir, 'processed', imagePath)

  // Создаем директорию для обработанных изображений, если она не существует
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Получаем метаданные изображения
  const metadata = await sharp(inputPath).metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Не вдалося отримати розміри зображення')
  }

  // Находим минимальный размер
  const minSize = Math.min(metadata.width, metadata.height)
  
  // Вычисляем координаты для обрезки
  const left = 0
  const top = 0
  const width = minSize
  const height = minSize

  // Обрабатываем изображение
  await sharp(inputPath)
    .extract({ left, top, width, height })
    .resize(minSize, minSize)
    .toFile(outputPath)

  // Возвращаем путь к обработанному изображению
  return `/processed${imagePath}`
}

async function main() {
  // Очищаем существующие данные
  await prisma.product.deleteMany()

  // Добавляем товары
  const products = [
    // Піжами
    {
      name: "Піжама 'Затишок'",
      price: 1200,
      description: "М'яка піжама з бавовни",
      composition: "100% бавовна",
      care: "Прання при 30°C",
      image: "/Pyjama1.webp",
      colors: ["білий", "сірий"],
      sizes: ["S", "M", "L"],
      category: "pajamas"
    },
    {
      name: "Піжама 'Мрія'",
      price: 1500,
      description: "Шовкова піжама",
      composition: "100% шовк",
      care: "Ручне прання",
      image: "/Pyjama2.webp",
      colors: ["бежевий", "чорний"],
      sizes: ["XS", "S", "M"],
      category: "pajamas"
    },
    {
      name: "Піжама 'Комфорт'",
      price: 1300,
      description: "Фланелева піжама",
      composition: "100% бавовна",
      care: "Прання при 40°C",
      image: "/Pyjama3.webp",
      colors: ["червоний", "синій"],
      sizes: ["M", "L", "XL"],
      category: "pajamas"
    },
    {
      name: "Піжама 'Ніжність'",
      price: 1400,
      description: "Шовкова піжама з мереживом",
      composition: "100% шовк",
      care: "Ручне прання",
      image: "/Pyjama4.webp",
      colors: ["рожевий", "білий"],
      sizes: ["S", "M", "L"],
      category: "pajamas"
    },
    // Халати
    {
      name: "Халат 'Комфорт'",
      price: 2500,
      description: "Махровий халат",
      composition: "100% бавовна",
      care: "Прання при 40°C",
      image: "/Bathrobe1.webp",
      colors: ["білий", "блакитний"],
      sizes: ["M", "L", "XL"],
      category: "robes"
    },
    {
      name: "Халат 'Шовковий'",
      price: 3000,
      description: "Шовковий халат",
      composition: "100% шовк",
      care: "Ручне прання",
      image: "/Bathrobe2.webp",
      colors: ["рожевий", "чорний"],
      sizes: ["S", "M", "L"],
      category: "robes"
    },
    {
      name: "Халат 'Затишний'",
      price: 2800,
      description: "Флісовий халат",
      composition: "100% поліестер",
      care: "Прання при 30°C",
      image: "/Bathrobe3.webp",
      colors: ["сірий", "бежевий"],
      sizes: ["S", "M", "L", "XL"],
      category: "robes"
    },
    {
      name: "Халат 'Елегант'",
      price: 3200,
      description: "Шовковий халат з поясом",
      composition: "100% шовк",
      care: "Ручне прання",
      image: "/Bathrobe4.webp",
      colors: ["бордовий", "чорний"],
      sizes: ["M", "L"],
      category: "robes"
    },
    // Костюми
    {
      name: "Костюм 'Домашній'",
      price: 2000,
      description: "Трикотажний костюм",
      composition: "100% бавовна",
      care: "Прання при 30°C",
      image: "/Suit1.webp",
      colors: ["сірий", "чорний"],
      sizes: ["S", "M", "L"],
      category: "suits"
    },
    {
      name: "Костюм 'Спортивний'",
      price: 1800,
      description: "Спортивний костюм",
      composition: "95% бавовна, 5% еластан",
      care: "Прання при 30°C",
      image: "/Suit2.webp",
      colors: ["синій", "чорний"],
      sizes: ["M", "L", "XL"],
      category: "suits"
    },
    {
      name: "Костюм 'Класика'",
      price: 2200,
      description: "Класичний домашній костюм",
      composition: "100% бавовна",
      care: "Прання при 30°C",
      image: "/Suit3.webp",
      colors: ["бежевий", "білий"],
      sizes: ["S", "M", "L"],
      category: "suits"
    },
    {
      name: "Костюм 'Затишок'",
      price: 1900,
      description: "М'який домашній костюм",
      composition: "100% бавовна",
      care: "Прання при 30°C",
      image: "/Suit4.webp",
      colors: ["рожевий", "сірий"],
      sizes: ["XS", "S", "M"],
      category: "suits"
    }
  ]

  for (const product of products) {
    // Обрабатываем изображение перед созданием продукта
    const processedImagePath = await processImage(product.image)
    
    await prisma.product.create({
      data: {
        ...product,
        image: processedImagePath
      }
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