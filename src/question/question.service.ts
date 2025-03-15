/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';

@Injectable()
export class QuestionService {
    constructor(
        // 依赖注入
        @InjectModel(Question.name) private readonly questionModel,
    ) {}

    async create() {
        const question = new this.questionModel({
            title: 'title' + Date.now(),
            desc: 'desc',
        });

        return await question.save();
    }

    async delete(id: string) {
        return await this.questionModel.findByIdAndDelete(id);
    }

    async update(id: string, updateData) {
        return await this.questionModel.updateOne({ _id: id }, updateData);
    }

    async findOne(id: string) {
        return await this.questionModel.findById(id);
    }
}
