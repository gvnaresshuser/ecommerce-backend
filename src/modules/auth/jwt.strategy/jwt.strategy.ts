import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.jwt, // ✅ cookie - // ✅ FIRST priority
                ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ header - // fallback
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!,
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role, // 🔥 MUST
        };
    }
}
//--------------------------------------------------------------------
/*
🧠 How It Works Internally

ExtractJwt.fromExtractors([...]) works like this:

🔍 Try first extractor
If token found → ✅ STOP
If not → try next extractor
🎯 So In Your Case:
🥇 Priority 1 → Cookie
(req) => req?.cookies?.jwt
🥈 Priority 2 → Header
Authorization: Bearer <token>
-----------------------------
🔥 Example Flow
Case 1: Cookie present
Cookie: jwt=abc123

👉 ✅ Used immediately
👉 ❌ Header ignored

Case 2: No cookie, but header present
Authorization: Bearer xyz456

👉 ✅ Header used

Case 3: Both present

👉 Cookie wins 🏆
*/
/* @Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.jwt, // ✅ cookie extractor
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!, // ✅ FIXED
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
        };
    }
} */