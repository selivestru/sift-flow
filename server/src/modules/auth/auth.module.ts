import { Module } from '@nestjs/common'

import { AuthResolver } from './auth.resolver.js'
import { AuthService } from './auth.service.js'
import { SessionAuthGuard } from './session-auth.guard.js'

@Module({
  providers: [AuthResolver, AuthService, SessionAuthGuard],
  exports: [SessionAuthGuard],
})
export class AuthModule {}
