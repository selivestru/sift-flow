import { WorkspaceInvitationEmail } from '../mail.types.js'

export const workspaceInvitationEmail = ({
  workspaceName,
  role,
  invitationUrl,
}: WorkspaceInvitationEmail): { subject: string; html: string } => ({
  subject: `You are invited to ${workspaceName} on SiftFlow`,
  html: `<div style="background:#f4f5f6;padding:32px;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#181819">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #dddedf">
    <div style="padding:24px;border-bottom:1px solid #e4e4e5">
      <span style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#717274">SiftFlow</span>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 16px;font-size:16px;font-weight:600">You are invited to ${workspaceName}</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#717274">
        You were invited to join the <strong style="color:#181819">${workspaceName}</strong> workspace as
        <strong style="color:#181819">${role}</strong>. Accept the invitation to get access to its boards and members.
      </p>
      <a href="${invitationUrl}" style="display:inline-block;background:#0485f7;color:#fcfcfc;font-size:14px;font-weight:600;text-decoration:none;padding:12px 20px">Accept invitation</a>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#717274">
        If the button does not work, open this link:<br />
        <a href="${invitationUrl}" style="color:#0485f7;word-break:break-all">${invitationUrl}</a>
      </p>
    </div>
  </div>
</div>`,
})
