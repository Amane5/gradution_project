import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { prisma } from '@/lib/prisma';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    //register
    @Post('register')
    register(@Body() dto:RegisterDto){
    return this.authService.register(dto)
    }

    @Post('verify-email')
    verify(@Body() dto:VerifyEmailDto){
        return this.authService.verifyEmail(dto)
    }

    @Post('resend-otp')
    resendOtp(@Body() dto:ResendOtpDto){
        return this.authService.resendOtp(dto)
    }

    //Login
    @Post('login')
    login(@Body() dto:LoginDto){
    return this.authService.login(dto)
    }

    //Forgot password
    @Post('forgot-password')
    forgotPassword(@Body() dto:ForgotPasswordDto){
        return this.authService.forgotPassword(dto)
    }
    
    @Post('reset-password')
    resetPassword(@Body() dto:ResetPasswordDto){
        return this.authService.resetPassword(dto)
    }

    @Get("test")
    test(){
        return prisma.user.count();
    }
}
