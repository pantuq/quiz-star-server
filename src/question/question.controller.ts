import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
    @Get() // GET /question 就是get请求
    findAll(
        @Query('keyword') keyword: string,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ) {
        console.log(keyword, page, pageSize);
        return {
            list: ['a', 'b', 'c'],
            count: 10,
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return {
            id,
            title: 'test',
            content: 'test content',
        };
    }

    @Patch(':id')
    updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
        console.log('questionDto', questionDto);
        return {
            id,
            title: 'aaa',
            content: 'bbb',
        };
    }
}
