import { Resend } from "resend";
import OrderConfirmationEmail from "@/emails/templates/OrderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationEmailParams {
  to: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderNumber,
  orderDate,
  items,
  total,
}: SendOrderConfirmationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Essencial <onboarding@resend.dev>",
      to,
      subject: `Confirmação do Pedido #${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName,
        orderNumber,
        orderDate,
        items,
        total,
      }),
    });

    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha ao enviar e-mail de confirmação");
    }

    return data;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Falha ao enviar e-mail de confirmação");
  }
}

interface SendEmailParams {
  to: string;
  subject: string;
  react: JSX.Element;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Essencial <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha ao enviar e-mail");
    }

    return data;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Falha ao enviar e-mail");
  }
}
