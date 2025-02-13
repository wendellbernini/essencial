import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface OrderConfirmationEmailProps {
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

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  orderDate,
  items,
  total,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirmação do seu pedido {orderNumber}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto p-8 max-w-2xl">
            <Section className="bg-white rounded-lg p-8 shadow-lg">
              <Heading className="text-2xl font-bold text-gray-800 mb-4">
                Obrigado pela sua compra, {customerName}!
              </Heading>

              <Text className="text-gray-600 mb-6">
                Seu pedido #{orderNumber} foi confirmado em {orderDate}.
              </Text>

              <Section className="border-t border-b border-gray-200 py-4 mb-6">
                <Heading className="text-lg font-semibold text-gray-800 mb-4">
                  Detalhes do Pedido
                </Heading>

                {items.map((item, index) => (
                  <Row key={index} className="mb-2">
                    <Column className="text-gray-700">
                      {item.quantity}x {item.name}
                    </Column>
                    <Column className="text-right text-gray-700">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </Column>
                  </Row>
                ))}

                <Row className="mt-4 pt-4 border-t border-gray-200">
                  <Column className="font-semibold text-gray-800">Total</Column>
                  <Column className="text-right font-semibold text-gray-800">
                    R$ {total.toFixed(2)}
                  </Column>
                </Row>
              </Section>

              <Text className="text-gray-600">
                Você receberá atualizações sobre o status do seu pedido neste
                e-mail.
              </Text>

              <Text className="text-gray-600 mt-6">
                Atenciosamente,
                <br />
                Equipe Essencial
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
