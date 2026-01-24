import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

// If used as type in Decorated Parameter, use 'import type' or just ignore if valid.
// The error says "must be imported with 'import type'".

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Public()
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Req() req: Request) {
        const user = req.user as any;
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user as any;
        return this.authService.logout(user.sub);
    }

    @Public()
    @Post('forgot-password')
    forgotPassword() {
        // Mock implementation
        return { message: 'Password recovery email sent (mock)' };
    }

    @Public()
    @Post('reset-password')
    resetPassword() {
        // Mock implementation
        return { message: 'Password reset successful (mock)' };
    }
}
