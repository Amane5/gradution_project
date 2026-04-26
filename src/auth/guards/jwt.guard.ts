import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { prisma } from '@/lib/prisma';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      console.log('🔥 AUTH HEADER:', authHeader);
      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'No token provided',
          error: 'NO_TOKEN',
        });
      }
  
      const token = authHeader.split(' ')[1];
      console.log('🔥 TOKEN:', token)
      //  check blacklist
      const isBlacklisted = await prisma.blacklistedToken.findUnique({
        where: { token },
      });
  
      if (isBlacklisted) {
        throw new UnauthorizedException({
          message: 'Token is blacklisted',
          error: 'TOKEN_BLACKLISTED',
        });
      }
  
      try {
        const payload = this.jwtService.verify(token);
        console.log('🔥 JWT PAYLOAD:', payload)
        request.user = payload;

  
        return true;
      } catch {
        throw new UnauthorizedException({
          message: 'Invalid or expired token',
          error: 'INVALID_TOKEN',
        });
      }
    }
  }