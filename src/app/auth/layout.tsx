import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>

      {/* Lado direito - Imagem decorativa */}
      <div className="hidden lg:flex lg:flex-1 bg-primary relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Essencial</h1>
          <p className="text-lg text-center max-w-md">
            Sua loja de produtos de beleza e cosméticos com as melhores marcas e preços do mercado.
          </p>
        </div>
        <Image
          src="/images/auth-background.jpg"
          alt="Produtos de beleza"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
} 