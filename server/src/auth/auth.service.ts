import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterInput } from './dto/register.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Payload } from './types/payload.type';
import { Roles } from '../common/enum/roles.enum';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}
    async register(registerInput: RegisterInput) {
        const { email, password, username } = registerInput;
        const hashedPassword = await this.hashData(password);
        const foundUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (foundUser) {
            throw new HttpException(
                'Email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });
        const role = await this.prisma.role.findUnique({
            where: {
                title: Roles.USER,
            },
        });
        await this.prisma.hasRole.create({
            data: {
                userId: user.userId,
                roleId: role.roleId,
            },
        });
        const payload: Payload = {
            userId: user.userId,
            username: user.username,
            email: user.email,
            roles: [Roles.USER],
        };
        const tokens = await this.generateTokens(payload);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                roles: [Roles.USER],
            },
        };
    }
    async login(loginInput: LoginInput) {
        const { email, password } = loginInput;
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
                userId: true,
                password: true,
                username: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new HttpException(
                'Email or password is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }
        const isPasswordValid = await this.verifyHash(user.password, password);
        if (!isPasswordValid) {
            throw new HttpException(
                'Email or password is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }
        const payload: Payload = {
            userId: user.userId,
            username: user.username,
            email: user.email,
            roles: user.roles.map((role) => role.role.title) as Roles[],
        };
        const tokens = await this.generateTokens(payload);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                roles: user.roles.map((role) => role.role.title) as Roles[],
            },
        };
    }

    async hashData(data: string) {
        return await argon2.hash(data);
    }

    async verifyHash(hashedData: string, plainData: string) {
        return await argon2.verify(hashedData, plainData);
    }

    async generateTokens(payload: Payload) {
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: process.env.ACCESS_TOKEN_TTL,
            privateKey: process.env.PRIVATE_KEY,
            secret: process.env.JWT_SECRET,
        });
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: process.env.REFRESH_TOKEN_TTL,
            privateKey: process.env.PRIVATE_KEY,
            secret: process.env.JWT_SECRET,
        });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.prisma.user.update({
            where: {
                userId: userId,
            },
            data: {
                refreshToken: refreshToken,
            },
        });
    }
}
