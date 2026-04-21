import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export const users:any[] = []
export const otps:any[] = []

@Injectable()
export class AuthService {
    //register
    async register(dto: RegisterDto){
        const {email , password , confirmPassword ,username, firstName , lastName} = dto
        const normalizedEmail = email.toLowerCase()
        const existingUser = users.find(u => u.email === normalizedEmail)
        if(existingUser){
            throw new BadRequestException('Email already exists')
        }

        //Hash password
        console.log("BODY:", dto);
        console.log("PASSWORD:", password);
        const hashedPassword = await bcrypt.hash(password, 10)

        //Create user
        const newUser = {
            id:users.length +1,
            email:normalizedEmail,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            isVerified: false,
            type: 'parent',
            createdAt: new Date()
        }
        users.push(newUser)

        //Generate otp
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpRecord ={
            userId:newUser.id,
            otp:otpCode,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        }
        otps.push(otpRecord)
        console.log("otp:" , otpCode)
        return {
            message: "check your email"
        }
    }

    async verifyEmail(dto:VerifyEmailDto){
        const {email , otp} = dto
        const user= users.find(u=> u.email === email.toLowerCase())
        if(!user){
            throw new BadRequestException('User not found')
        }
        const otpRecord = otps.find(o => o.userId === user.id)
        if(!otpRecord){
            throw new BadRequestException('otp not found')
        }
        if(otpRecord.otp !== otp){
            throw new BadRequestException('invalid otp')
        }
        if(otpRecord.expiresAt < Date.now()){
            throw new BadRequestException('Otp expired')
        }
        user.isVerified = true
        const index = otps.indexOf(otpRecord)
        otps.splice(index, 1)
        
        return{
            message: 'Email Verifyed successfuly',
            userId : user.id
        }
    }

    async resendOtp(dto:ResendOtpDto){
        const {email} = dto
        const user = users.find(u=> u.email === email.toLowerCase())
        if(!user){
            throw new BadRequestException('User not found')
        }
        const existingOtp = otps.find(o=> o.userId === user.id)
        if(existingOtp){
            const index = otps.indexOf(existingOtp)
            otps.splice(index, 1 )
        }
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otps.push({
            userId: user.id,
            otp: newOtp,
            expiresAt: Date.now() + 5 * 60 * 1000
        })
        console.log("New otp:", newOtp)
        return{
            message: "otp resent"
        }
    }

    //Login
    async login(dto:any){
        const {username, password} = dto
        const user = users.find(u=>u.username === username)
        if(!user){
            throw new BadRequestException('Invalid username or password')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            throw new BadRequestException('Invalid username or password')
        }

        if(user.type === 'parent' && !user.isVerified){
            throw new BadRequestException('Please verify your email first')
        }
        return {
            message: 'Login successful',
            userId: user.id,
            type:user.type
        }
    }

    //Forgot password
    async forgotPassword(dto:ForgotPasswordDto){
        const {email} = dto
        const user = users.find(u=> u.email === email.toLowerCase())
        if(!user){
            throw new BadRequestException('User not found')
        }

        //delete old otp if exists
        const existingOtp = otps.find(o => o.userId === user.id)
        if(existingOtp)
        {
            const index= otps.indexOf(existingOtp)
            otps.splice(index,1)
        }

        //generate new otp 
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        otps.push({
            userId:user.id,
            otp: otpCode,
            expiresAt: Date.now()+ 5*60 *1000
        })
        console.log("Reset Otp:", otpCode)
        return {
            message: 'Reset otp sent'
        }
    }

    async resetPassword(dto : ResetPasswordDto) {
        const { email, otp , newPassword} = dto
        const user = users.find(u=> u.email === email.toLowerCase())
        if(!user){
            throw new BadRequestException('User not found')
        }
        const otpRecord = otps.find(o=>o.userId === user.id)
        if(!otpRecord){
            throw new BadRequestException('Otp not found')
        }
        if(otpRecord.otp !== otp){
            throw new BadRequestException('Invalid otp')
        }
        if(otpRecord.expired < Date.now()) {
            throw new BadRequestException('OTP expired')
        }

        //hash new password
        const hashedPassword = await bcrypt.hash(newPassword , 10)
        user.password = hashedPassword

        const index = otps.indexOf(otpRecord)
        otps.splice(index,1)

        return{
            message: 'Password reset successful'
        }
    }
}
