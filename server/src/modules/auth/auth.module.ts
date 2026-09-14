import { Module } from '@nestjs/common'

import { SessionAuthGuard } from '../../common/guards/session-auth.guard.js'
import { AuthResolver } from './auth.resolver.js'
import { AuthService } from './auth.service.js'

@Module({
  providers: [AuthResolver, AuthService, SessionAuthGuard],
  exports: [SessionAuthGuard],
})
export class AuthModule {}
