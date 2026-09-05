import { join } from 'node:path'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller.js'
import { GraphQLContext } from './common/types/graphql.types.js'
import { RedisModule } from './infrastructure/redis/redis.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: GraphQLContext) => ({ req, res }),
    }),
    RedisModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
