/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    Request,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('question')
export class QuestionController {
    // 依赖注入
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Request() req) {
        const { username } = req.user;
        return this.questionService.create(username);
    }

    @Get() // GET /question 就是get请求
    async findAll(
        @Query('keyword') keyword: string,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
        @Query('isDeleted') isDeleted: boolean = false,
        @Query('isStar') isStar: boolean = false,
        @Request() req,
    ) {
        const { username } = req.user;

        const list = await this.questionService.findAllList({
            keyword,
            page,
            pageSize,
            isDeleted,
            isStar,
            author: username,
        });

        const count = await this.questionService.countAll({
            keyword,
            author: username,
            isDeleted,
            isStar,
        });
        return {
            list,
            count,
        };
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(id);
    }

    @Patch(':id')
    updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
        // console.log(questionDto);
        return this.questionService.update(id, questionDto);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string, @Request() req) {
        const { username } = req.user;
        return this.questionService.delete(id, username);
    }

    @Delete()
    deleteMany(@Body() body, @Request() req) {
        const { username } = req.user;
        const { ids = [] } = body;
        return this.questionService.deleteMany(ids, username);
    }

    @Post('duplicate/:id')
    duplicate(@Param('id') id: string, @Request() req) {
        const { username } = req.user;
        return this.questionService.duplicate(id, username);
    }
}
