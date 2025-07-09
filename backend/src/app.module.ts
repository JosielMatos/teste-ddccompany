import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { NotificationModule } from './@shared/socket/socket-module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './infra/database/database.module'
import { CategoryModule } from './modules/category/module'
import { LargeTableModule } from './modules/large-table/module'
import { PokemonModule } from './modules/pokemon/module'
import { PostModule } from './modules/post/module'
import { ProfileModule } from './modules/profile/module'
import { UserModule } from './modules/user/module'
import { AuthModule } from './modules/auth/module'
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    PokemonModule,
    UserModule,
    ProfileModule,
    PostModule,
    CategoryModule,
    LargeTableModule,
    NotificationModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join('./src/static'),
      serveRoot: '/static',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // TODO: verificar de passar essas exportações para dentro do módulo.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer) {}
}
