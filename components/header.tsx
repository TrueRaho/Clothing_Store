import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="py-6 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          дом.одежда
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="/catalog" className="text-gray-800 hover:text-[#c1b6ad]">
            Каталог
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-[#c1b6ad]">
            О нас
          </Link>
          <Link href="/contacts" className="text-gray-800 hover:text-[#c1b6ad]">
            Контакты
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              className="pl-3 pr-8 py-1 border border-gray-200 focus:outline-none focus:border-[#c1b6ad]"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <Link href="/" className="text-gray-800 hover:text-[#c1b6ad]">
            Войти
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-[#c1b6ad] text-white text-xs w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
