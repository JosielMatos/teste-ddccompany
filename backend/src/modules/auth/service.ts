import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  execute(body: any) {
    const { username, password } = body
    if (username === 'admin' && password === 'password') {
      // Simulate user ID and permissions
      const userId = '1'
      const permissions = ['api-criar-user', 'api-ler-user', 'api-atualizar-user', 'api-deletar-user']
      const payload = {
        sub: userId,
        data: permissions,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })

      return token
    }

    return null
  }
}
