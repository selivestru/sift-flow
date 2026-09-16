import { Processor, WorkerHost } from '@nestjs/bullmq'
import type { Job } from 'bullmq'

import { MailService } from './mail.service.js'
import { EMAIL_QUEUE, WORKSPACE_INVITATION_JOB, WorkspaceInvitationEmail } from './mail.types.js'

@Processor(EMAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super()
  }

  override async process(job: Job<WorkspaceInvitationEmail>): Promise<void> {
    if (job.name !== WORKSPACE_INVITATION_JOB) {
      return
    }

    await this.mailService.sendWorkspaceInvitation(job.data)
  }
}
