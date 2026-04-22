import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '@/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  imports: [
    JwtModule.register({
      secret:'SECRET_KEY',
      signOptions: {expiresIn: '1d'}
    })
  ]
})
export class AuthModule {}
