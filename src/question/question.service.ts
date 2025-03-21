/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

@Injectable()
export class QuestionService {
    constructor(
        // 依赖注入
        @InjectModel(Question.name) private readonly questionModel,
    ) {}

    async create(username: string) {
        const question = new this.questionModel({
            title: '问卷标题' + Date.now(),
            desc: '问卷描述',
            author: username,
            componentList: [
                {
                    fe_id: nanoid(),
                    type: 'questionInfo',
                    title: '问卷信息',
                    props: { title: '问卷标题', desc: '问卷描述' },
                },
            ],
        });

        return await question.save();
    }

    async delete(id: string, author: string) {
        const res = await this.questionModel.findOneAndDelete({
            _id: id,
            author,
        });
        return res;
    }

    async deleteMany(ids: string[], author: string) {
        const res = await this.questionModel.deleteMany({
            _id: { $in: ids },
            author,
        });

        return res;
    }

    async update(id: string, updateData) {
        return await this.questionModel.updateOne({ _id: id }, updateData);
    }

    async findOne(id: string) {
        return await this.questionModel.findById(id);
    }

    async findAllList({
        keyword = '',
        page = 1,
        pageSize = 10,
        isDeleted = false,
        isStar,
        author = '',
    }) {
        const whereOpt: any = {
            author,
            isDeleted,
        };
        if (isStar != null) whereOpt.isStar = isStar;
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

    async countAll({ keyword = '', isDeleted = false, author = '', isStar }) {
        const whereOpt: any = {
            author,
            isDeleted,
        };
        if (isStar != null) whereOpt.isStar = isStar;
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            whereOpt.title = { $regex: reg };
        }
        return await this.questionModel.countDocuments(whereOpt);
    }

    async duplicate(id: string, author: string) {
        const question = await this.questionModel.findById(id);
        const newQuestion = new this.questionModel({
            ...question.toObject(),
            _id: new mongoose.Types.ObjectId(),
            title: question.title + '副本',
            author,
            isStar: false,
            isPublished: false,
            componentList: question.componentList.map((item) => {
                return {
                    ...item,
                    fe_id: nanoid(),
                };
            }),
        });
        return await newQuestion.save();
    }
}
