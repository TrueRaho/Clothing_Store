import { Header } from "@/components/header"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Contacts() {
  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <h1 className="text-2xl mb-8">Контакти</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="grid gap-6">
              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Телефон</h3>
                  <p>+(380)67-123-45-67</p>
                  <p className="text-sm text-gray-500 mt-1">Пн-Пт с 10:00 до 19:00</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p>info@dom-odezhda.ua</p>
                  <p className="text-sm text-gray-500 mt-1">Ми відповідаємо протягом 24 годин</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Адреса шоуруму</h3>
                  <p>м. Київ, вул. Березнева, буд. 12</p>
                  <p className="text-sm text-gray-500 mt-1">Пн-Нд з 12:00 до 20:00</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl mb-6">Напишіть нам</h2>
              <form className="grid gap-4">
                <div>
                  <label className="block mb-2">Ім'я</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Повідомлення</label>
                  <textarea
                    className="w-full border border-gray-200 p-2 h-32 focus:outline-none focus:border-[#c1b6ad]"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="px-8 py-3 bg-[#c1b6ad] text-white mt-2 w-fit">
                  Відправити
                </button>
              </form>
            </div>
          </div>

          <div className="bg-gray-50 h-[500px] flex items-center justify-center">
            <p className="text-gray-400">Карта</p>
          </div>
        </div>
      </div>
    </main>
  )
}
