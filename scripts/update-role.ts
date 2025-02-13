import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: "berniniwendell21@gmail.com",
      },
      data: {
        role: "ADMIN",
      },
    });
    console.log("Usuário atualizado com sucesso:", updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
