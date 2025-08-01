import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello()
  }

  @Get('analytics')
  async getAnalytics(): Promise<any> {
    return await this.appService.getComplexAnalytics()
  }
}
