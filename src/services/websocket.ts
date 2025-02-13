import { Server } from 'ws'
import { createServer } from 'http'
import { parse } from 'url'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

export function createWebSocketServer() {
  const server = createServer()
  const wss = new Server({ server })

  const clients = new Map<string, WebSocket>()

  wss.on('connection', async (ws, req) => {
    try {
      const url = req.url ? parse(req.url, true) : null
      const token = url?.query?.token as string

      if (!token) {
        ws.close(1008, 'Token não fornecido')
        return
      }

      const session = await getToken({ req, secret })

      if (!session) {
        ws.close(1008, 'Não autorizado')
        return
      }

      const userId = session.sub as string
      clients.set(userId, ws)

      ws.on('close', () => {
        clients.delete(userId)
      })

      ws.on('error', (error) => {
        console.error(`[WebSocket Error] ${error.message}`)
        clients.delete(userId)
      })
    } catch (error) {
      console.error('[WebSocket Connection Error]', error)
      ws.close(1011, 'Erro interno')
    }
  })

  server.listen(process.env.WS_PORT || 3001)

  return {
    broadcast: (userId: string, data: any) => {
      const client = clients.get(userId)
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    },
    broadcastToAll: (data: any) => {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data))
        }
      })
    },
    getConnectedUsers: () => Array.from(clients.keys()),
  }
} 