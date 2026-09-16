import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

import type { EnvConfig } from '~/config/env.config.js'

import { MailQueueService } from './mail-queue.service.js'
import { MailProcessor } from './mail.processor.js'
import { MailService } from './mail.service.js'
import { EMAIL_QUEUE } from './mail.types.js'

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        connection: new Redis(configService.get('REDIS_URL', { infer: true }), {
          maxRetriesPerRequest: null,
        }),
      }),
    }),
    BullModule.registerQueue({ name: EMAIL_QUEUE }),
  ],
  providers: [MailService, MailProcessor, MailQueueService],
  exports: [MailQueueService],
})
export class MailModule {}
