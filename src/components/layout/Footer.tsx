import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Sobre
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/sobre"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/trabalhe-conosco"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Suporte
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/faq"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/trocas"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/rastreamento"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Rastreamento
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Categorias
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/categorias/maquiagem"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Maquiagem
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/skincare"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Skincare
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/cabelos"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Cabelos
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias/perfumes"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Perfumes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Receba novidades e promoções exclusivas.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
                >
                  Assinar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Essencial. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 