import { Header } from "@/components/header"

export default function Checkout() {
  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <h1 className="text-2xl mb-8">Оформление заказа</h1>

        <div className="max-w-2xl">
          <form>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <label className="block mb-2">Имя</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Телефон</label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 p-2 focus:outline-none focus:border-[#c1b6ad]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Адрес доставки</label>
                <textarea
                  className="w-full border border-gray-200 p-2 h-24 focus:outline-none focus:border-[#c1b6ad]"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block mb-2">Способ доставки</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="delivery1" name="delivery" className="mr-2" defaultChecked />
                    <label htmlFor="delivery1">Курьер (500 ₴)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="delivery2" name="delivery" className="mr-2" />
                    <label htmlFor="delivery2">Самовывоз (бесплатно)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="delivery3" name="delivery" className="mr-2" />
                    <label htmlFor="delivery3">Почта России (300 ₴)</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2">Способ оплаты</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" id="payment1" name="payment" className="mr-2" defaultChecked />
                    <label htmlFor="payment1">Онлайн картой</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="payment2" name="payment" className="mr-2" />
                    <label htmlFor="payment2">При получении</label>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="px-8 py-3 bg-[#c1b6ad] text-white">
              Подтвердить заказ
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
