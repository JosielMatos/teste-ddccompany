// // Add authentication service to handle user login and JWT token generation
// import { Injectable } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'
// // import { UserService } from '../user/user.service'
// import { PrismaService } from 'src/infra/database/prisma.service'

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly userService: UserService,
//     private readonly jwtService: JwtService,
//     private readonly prismaService: PrismaService,
//   ) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     const user = await this.userService.findByUsername(username)
//     if (user && user.password === password) {
//       const { password, ...result } = user
//       return result
//     }
//     return null
//   }

//   async login(user: any) {
//     const payload = { username: user.username, sub: user.userId }
//     return {
//       access_token: this.jwtService.sign(payload),
//     }
//   }

//   async getUser(email: string) {
//     return this.prismaService.user.findUnique({
//       where: { email },
//     })
//   }
// }
