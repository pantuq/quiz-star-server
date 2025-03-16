/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        try {
            return await this.userService.create(userDto);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('info')
    @Redirect('/api/auth/profile', 302) //GET 301 永久重定向 302 临时重定向
    async info() {
        return;
    }

    @Public()
    @Post('login')
    @Redirect('/api/auth/login', 307)
    async login() {
        // 直接调用 authService 的 signIn 方法
        return;
    }
}
