/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schema/answer.schema';
import { Public } from 'src/auth/decorator/public.decorator';

@Injectable()
export class AnswerService {
    // 依赖注入
    constructor(@InjectModel(Answer.name) private readonly answerModel) {}

    @Public()
    async create(answerInfo) {
        if (answerInfo.questionId == null) {
            throw new HttpException('缺少问卷id', HttpStatus.BAD_REQUEST);
        }

        const answer = new this.answerModel(answerInfo);
        return await answer.save();
    }
}
