import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { AuthService } from './service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: any, @Res() res: any) {
    const token = this.authService.execute(body)

    if (token) {
      return res.json({ token })
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' })
    }
  }
}
