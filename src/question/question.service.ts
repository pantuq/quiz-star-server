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

    async findAllList({ keyword = '', page = 1, pageSize = 10 }) {
        const whereOpt: any = {};
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            whereOpt.title = { $regex: reg };
        }
        return await this.questionModel
            .find(whereOpt)
            .sort({ _id: -1 }) // 根据id倒序排列
            .skip((page - 1) * pageSize) // 跳过多少条数据
            .limit(pageSize);
    }

    async countAll({ keyword = '' }) {
        const whereOpt: any = {};
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            whereOpt.title = { $regex: reg };
        }
        return await this.questionModel.countDocuments(whereOpt);
    }
}
