import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

@Controller('auth')
export class AuthController {
  // POST /login
  @Post('login')
  async login(@Req() req: any, @Body() body: any, @Res() res: Response) {
    const { username, password } = body

    // TODO: Replace with real user validation
    if (username === 'admin' && password === 'password') {
      // Simulate user ID and permissions
      const userId = '12345'
      const permissions = ['api-criar-user', 'api-ler-user', 'api-atualizar-user', 'api-deletar-user'] // Example permissions
      const payload = {
        sub: userId,
        data: permissions,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
      return res.json({ token })
    }

    return res.status(401).json({ message: 'Invalid credentials' })
  }
}
