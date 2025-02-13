import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "berniniwendell21@gmail.com";

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`Usuário ${user.email} atualizado para ADMIN`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
