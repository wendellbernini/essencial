import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// POST /api/admin/upload - Faz upload de uma imagem
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { message: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Apenas imagens são permitidas' },
        { status: 400 }
      )
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'O arquivo deve ter no máximo 5MB' },
        { status: 400 }
      )
    }

    // Gera um nome único para o arquivo
    const ext = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${ext}`

    // Cria o diretório de uploads se não existir
    const uploadDir = join(process.cwd(), 'public/uploads')
    try {
      await writeFile(join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Se o diretório não existe, cria ele
        const fs = require('fs')
        fs.mkdirSync(uploadDir, { recursive: true })
        // Tenta salvar o arquivo novamente
        await writeFile(join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()))
      } else {
        throw error
      }
    }

    return NextResponse.json({
      url: `/uploads/${fileName}`,
    })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 