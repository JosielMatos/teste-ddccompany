import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from '../app.controller'
import { AppService } from '../app.service'
import { PrismaService } from 'src/infra/database/prisma.service'

describe('AppController', () => {
  let appController: AppController
  let appService: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PrismaService],
    }).compile()

    appController = app.get<AppController>(AppController)
    appService = app.get<AppService>(AppService)
  })

  describe('root', () => {
    it('should return the correct message', () => {
      const expectedMessage = 'Hello World!!! ✈️✈️'
      jest.spyOn(appService, 'getHello').mockReturnValueOnce({ returnMessage: expectedMessage })

      expect(appController.getHello()).toEqual({ returnMessage: expectedMessage })
    })
  })
})
