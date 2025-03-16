/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    // 依赖注入
    constructor(private readonly useService: UserService) {}

    async signIn(username: string, password: string) {
        const user = await this.useService.findOne(username, password);

        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        const { password: pwd, ...userInfo } = user.toObject();

        return userInfo;
    }
}
