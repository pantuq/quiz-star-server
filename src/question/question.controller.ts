/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
    // 依赖注入
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create() {
        return this.questionService.create();
    }

    @Get() // GET /question 就是get请求
    async findAll(
        @Query('keyword') keyword: string,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ) {
        const list = await this.questionService.findAllList({
            keyword,
            page,
            pageSize,
        });

        const count = await this.questionService.countAll({
            keyword,
        });
        return {
            list,
            count,
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(id);
    }

    @Patch(':id')
    updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
        return this.questionService.update(id, questionDto);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string) {
        return this.questionService.delete(id);
    }
}
