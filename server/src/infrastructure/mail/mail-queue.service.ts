import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import type { Queue } from 'bullmq'

import { EMAIL_QUEUE, WORKSPACE_INVITATION_JOB, WorkspaceInvitationEmail } from './mail.types.js'

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {}

  enqueueWorkspaceInvitation(payload: WorkspaceInvitationEmail): Promise<unknown> {
    return this.emailQueue.add(WORKSPACE_INVITATION_JOB, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
    })
  }
}
