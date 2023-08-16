import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/enum/roles.enum';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                email: true,
                userId: true,
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
        return users.map((user) => {
            return {
                ...user,
                roles: user.roles.map((role) => role.role.title as Role),
            };
        });
    }
}
