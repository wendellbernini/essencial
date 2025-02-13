import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/format";
import { Prisma } from "@prisma/client";

// GET /api/admin/products - Lista todos os produtos
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const orderBy = searchParams.get("orderBy") || "createdAt";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    // Construir query de busca
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          {
            name: { contains: search, mode: "insensitive" as Prisma.QueryMode },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }),
      ...(category && { categoryId: category }),
      ...(brand && { brand }),
    };

    // Buscar produtos com paginação
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          [orderBy]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular metadados da paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products,
      total,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json(
      { message: "Erro ao listar produtos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Cria um novo produto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();

    // Validação básica
    if (!data.name || !data.price || !data.categoryId) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }

    // Cria o slug a partir do nome
    const slug = slugify(data.name);

    // Verifica se já existe um produto com este slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Já existe um produto com este nome" },
        { status: 400 }
      );
    }

    // Cria o produto
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        images: data.images || [],
        stock: Number(data.stock) || 0,
        brand: data.brand,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
