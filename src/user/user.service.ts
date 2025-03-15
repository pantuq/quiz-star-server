/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';

@Injectable()
export class UserService {
    // 依赖注入
    constructor(@InjectModel(User.name) private readonly userModel) {}

    async create(userData) {
        const createdUser = new this.userModel(userData);
        return await createdUser.save();
    }

    async findOne(username: string, password: string) {
        return await this.userModel.findOne({ username, password });
    }
}
