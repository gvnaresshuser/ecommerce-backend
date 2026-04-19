import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { db } from '../../db/drizzle';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService,
        private databaseService: DatabaseService, // ✅ injected

    ) { }

    // ✅ REGISTER
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        //INSTEAD OF db USE --> this.databaseService.db

        //const result = await db.insert(users).values({
        const result = await this.databaseService.db.insert(users).values({
            ...data,
            password: hashedPassword,
        }).returning();

        return result[0];
    }

    // ✅ LOGIN
    async login(data: LoginDto) {

        // 1️⃣ Find user
        //https://orm.drizzle.team/docs/rqb-v2#find-first

        //INSTEAD OF db USE --> this.databaseService.db

        ////const user = await db.query.users.findFirst({
        const user = await this.databaseService.db.query.users.findFirst({
            where: eq(users.username, data.username),
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(
            data.password,
            user.password!
        );

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3️⃣ Generate JWT
        const token = this.jwtService.sign({
            sub: user.userId,
            username: user.username,
        });

        return {
            access_token: token,
        };
    }
}
//---------------------------------------------------------------------
/* import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '../../db/drizzle';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) { }

    // ✅ REGISTER
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const result = await db.insert(users).values({
            ...data,
            password: hashedPassword,
        }).returning();

        return result[0];
    }

    // ✅ LOGIN
    async login(data: LoginDto) {

        // 1️⃣ Find user
        //https://orm.drizzle.team/docs/rqb-v2#find-first
        const user = await db.query.users.findFirst({
            where: eq(users.username, data.username),
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(
            data.password,
            user.password!
        );

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3️⃣ Generate JWT
        const token = this.jwtService.sign({
            sub: user.userId,
            username: user.username,
        });

        return {
            access_token: token,
        };
    }
} */