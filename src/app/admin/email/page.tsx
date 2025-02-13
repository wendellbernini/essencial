"use client";

import { EmailTest } from "@/components/admin/EmailTest";

export default function EmailTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Teste de E-mail</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Enviar E-mail de Confirmação de Pedido
        </h2>
        <p className="text-gray-600 mb-6">
          Use este formulário para testar o envio de e-mails de confirmação de
          pedido. Um e-mail de teste será enviado com dados fictícios.
        </p>
        <EmailTest />
      </div>
    </div>
  );
}
