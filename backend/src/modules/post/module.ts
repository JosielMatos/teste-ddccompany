import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from 'src/infra/database/database.module'
import { GraphQLController } from './controller'
import { HttpController } from './http-controller'
import { Service } from './service'

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), DatabaseModule],
  controllers: [HttpController],
  providers: [GraphQLController, Service],
  exports: [],
})
export class PostModule {}
