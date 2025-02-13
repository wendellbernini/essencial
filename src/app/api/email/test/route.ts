import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Verifica se o email é o mesmo que está cadastrado no Resend
    if (email !== "berniniwendell21@gmail.com") {
      return NextResponse.json(
        {
          error:
            "Durante o período de teste, você só pode enviar emails para berniniwendell21@gmail.com",
        },
        { status: 403 }
      );
    }

    const testOrder = {
      customerName: "Cliente Teste",
      orderNumber: "123456",
      orderDate: new Date().toLocaleDateString("pt-BR"),
      items: [
        {
          name: "Produto Teste 1",
          quantity: 2,
          price: 99.9,
        },
        {
          name: "Produto Teste 2",
          quantity: 1,
          price: 149.9,
        },
      ],
      total: 349.7,
    };

    await sendOrderConfirmationEmail({
      to: email,
      ...testOrder,
    });

    return NextResponse.json({
      message: "E-mail de teste enviado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de teste:", error);
    return NextResponse.json(
      {
        error: "Falha ao enviar e-mail de teste",
      },
      { status: 500 }
    );
  }
}
