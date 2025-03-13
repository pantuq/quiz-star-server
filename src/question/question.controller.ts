import { Controller, Get } from '@nestjs/common';

@Controller('question')
export class QuestionController {
    @Get() // GET /question 就是get请求
    findAll() {
        return {
            list: ['a', 'b', 'c'],
            count: 10,
        };
    }

    @Get('test')
    getTest(): string {
        return 'question test';
    }
}
