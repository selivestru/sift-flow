import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

import type { EnvConfig } from '~/config/env.config.js'

import type { WorkspaceInvitationEmail } from './mail.types.js'
import { workspaceInvitationEmail } from './templates/workspace-invite.template.js'

@Injectable()
export class MailService {
  private readonly resend: Resend

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    const apiKey = this.configService.get('RESEND_API_KEY', { infer: true })
    this.resend = new Resend(apiKey)
  }

  async sendWorkspaceInvitation(payload: WorkspaceInvitationEmail): Promise<void> {
    const { subject, html } = workspaceInvitationEmail(payload)

    const { error } = await this.resend.emails.send({
      from: this.configService.get('RESEND_FROM_EMAIL', { infer: true }),
      to: [payload.email],
      subject,
      html,
    })

    if (error) {
      throw new Error(`Resend refused the workspace invitation email: ${error.message}`)
    }
  }
}
