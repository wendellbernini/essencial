const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Primeiro, tenta encontrar o usuário
    let user = await prisma.user.findUnique({
      where: {
        email: "berniniwendell21@gmail.com",
      },
    });

    // Se o usuário não existir, cria um novo
    if (!user) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      user = await prisma.user.create({
        data: {
          email: "berniniwendell21@gmail.com",
          name: "Wendell Bernini",
          password: hashedPassword,
          emailVerified: new Date(),
          role: "USER",
        },
      });
      console.log("Usuário criado com sucesso:", user);
    }

    // Atualiza o papel do usuário para ADMIN
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "ADMIN",
      },
    });
    console.log("Papel do usuário atualizado com sucesso:", updatedUser);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
