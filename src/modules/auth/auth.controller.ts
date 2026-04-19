import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import type { Response } from 'express';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';

import { Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt.guard';
import { getCookieConfigWithExpiry, getCookieConfig } from 'src/common/utils/cookie.config';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // ✅ REGISTER API
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    // ✅ LOGIN API
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto);

        //------------------- DEVELOPMENT --------------------------
        /* res.cookie('jwt', result.access_token, {//manually set cookie
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        }); */
        //------------------- DEVELOPMENT --------------------------
        //------------------- PRODUCTION --------------------------
        /* res.cookie('jwt', result.access_token, {//manually set cookie
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        }); */
        //------------------- PRODUCTION --------------------------
        //----------------------- FROM ENV FILE -----------------------------------
        const cookieConfig = {
            httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
            maxAge: Number(process.env.COOKIE_MAX_AGE),
        };
        console.log('COOKIE CONFIG DEBUG 👉');
        console.log('httpOnly:', process.env.COOKIE_HTTP_ONLY);
        console.log('secure:', process.env.COOKIE_SECURE);
        console.log('sameSite:', process.env.COOKIE_SAME_SITE);
        console.log('maxAge:', process.env.COOKIE_MAX_AGE);
        console.log('PARSED CONFIG:', cookieConfig);

        /////res.cookie('jwt', result.access_token, cookieConfig);
        res.cookie('jwt', result.access_token, getCookieConfigWithExpiry());

        //----------------------- FROM ENV FILE -----------------------------------


        return { message: 'Login successful', token: result.access_token, };// Nest handles this
    }
    //---------------------------
    /*    @Post('logout')
       logout(@Res({ passthrough: true }) res: Response) {
           res.clearCookie('jwt', {
               httpOnly: true,
               secure: false,
               sameSite: 'lax',
           });
           return { message: 'Logged out' };
       } */
    //----------------------------
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {

        const cookieConfig = {
            httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
        };

        ////res.clearCookie('jwt', cookieConfig);
        res.clearCookie('jwt', getCookieConfig());

        return { message: 'Logged out' };
    }
    //---------------------------

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user: any) {
        return user;
    }
}
/*
🧠 What is @Res() in NestJS?
👉 @Res() = Response object (from Express)
@Res() res: Response

👉 Gives you direct access to the raw Express response

🔧 Example
res.cookie('jwt', token);
res.send({ message: "done" });

👉 You are manually controlling response

⚠️ Problem with plain @Res()

If you use:

@Res() res: Response

👉 NestJS stops automatic response handling

So this WON’T work:

return { message: "Login success" }; ❌

👉 Because you took full control

✅ Solution → passthrough: true
🔥 What is passthrough: true?
@Res({ passthrough: true }) res: Response

👉 Means:

“Let me MODIFY response (cookies, headers)
BUT NestJS still sends the response automatically”
*/