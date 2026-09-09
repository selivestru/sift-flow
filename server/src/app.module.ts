import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller.js'
import { PrismaModule } from './infrastructure/prisma/prisma.module.js'
import { RedisModule } from './infrastructure/redis/redis.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   graphiql: true,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   sortSchema: true,
    //   context: ({ req, res }: GraphQLContext) => ({ req, res }),
    // }),
    RedisModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
