/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { AnswerService } from 'src/answer/answer.service';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class StatService {
    constructor(
        private readonly questionService: QuestionService,
        private readonly answerService: AnswerService,
    ) {}
    private _getRadioOptText(value, props: any = {}) {
        const { options = [] } = props;
        const length = options.length;

        for (let i = 0; i < length; i++) {
            const item = options[i];
            if (item.value === value) {
                return item.text;
                break;
            }
        }
        return '';
    }

    private _getCheckboxOptText(value, props: any = {}) {
        const { list = [] } = props;
        const length = list.length;

        // value是问卷的答案， props是问卷的配置
        const val = value.split(',');
        const res: string[] = [];

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < val.length; j++) {
                if (list[i].value === val[j]) {
                    res.push(val[j]);
                }
            }
        }
        return res.toString();
    }

    /**
     * 生成答案信息，格式如{componentFeId: value1, componentFeId2: value2}
     * @param question
     * @param answerList
     * @returns
     */
    private _genAnswersInfo(question, answerList = []) {
        const res: Record<string, string> = {};
        const { componentList = [] } = question;

        answerList.forEach((a) => {
            const { componentFeId, value = [] } = a;

            // 获取组件信息
            const comp = componentList.filter(
                (c) => c.fe_id === componentFeId,
            )[0];

            const { type, props = [] } = comp;
            if (type === 'questionRadio') {
                // 单选
                res[componentFeId] = value
                    .map((v) => this._getRadioOptText(v, props))
                    .toString();
            } else if (type === 'questionCheckbox') {
                // 多选
                res[componentFeId] = value
                    .map((v) => this._getCheckboxOptText(v, props))
                    .toString();
            } else {
                // 其他
                res[componentFeId] = value.toString();
            }
        });
        return res;
    }

    // 获取单个问卷的案卷列表（分页）和数量
    async getQuestionStatListAndCount(
        questionId: string,
        opt: { page: number; pageSize: number },
    ) {
        const noData = { list: [], count: 0 };
        if (!questionId) return noData;

        // q：问卷
        const q = await this.questionService.findOne(questionId);
        if (q == null) return noData;

        const total = await this.answerService.count(questionId);
        if (total === 0) return noData;

        const answers = await this.answerService.findAll(questionId, opt);

        const list = answers.map((a) => {
            return {
                _id: a._id,
                ...this._genAnswersInfo(q, a.answerList),
            };
        });

        return {
            list,
            total,
        };
    }

    // 获取单个组件的统计数据
    async getComponentStat(questionId: string, componentFeId: string) {
        if (!questionId || !componentFeId) return [];

        // 获取问卷
        const q = await this.questionService.findOne(questionId); //问卷
        if (q == null) return [];

        // 获取组件
        const { componentList = [] } = q;
        const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
        if (comp == null) return [];

        console.log('comp', comp);

        const { type, props } = comp;
        console.log('props', props);

        if (type !== 'questionRadio' && type !== 'questionCheckbox') {
            // 单组件的，只能统计单选和多选,其他不统计
            return [];
        }

        // 获取答卷列表
        const total = await this.answerService.count(questionId);
        // console.log('total', total);
        if (total === 0) return []; //答卷总数量
        const answers = await this.answerService.findAll(questionId, {
            page: 1,
            pageSize: total,
        });

        // 累加各个value数量
        const countInfo = {};
        answers.forEach((answer) => {
            answer.answerList.forEach((answerItem) => {
                // console.log('answerItem', answerItem);
                if (answerItem.componentFeId == componentFeId) {
                    console.log('answerItem.value', answerItem.value);
                    const value = answerItem.value;
                    if (countInfo[value]) {
                        countInfo[value] += 1;
                    } else {
                        countInfo[value] = 1;
                    }
                }
            });
        });

        // 整理数据
        const list: { name: string; count: number }[] = [];
        for (const val in countInfo) {
            // 根据val计算text
            let text = '';
            if (type === 'questionRadio') {
                text = this._getRadioOptText(val, props);
            }
            if (type === 'questionCheckbox') {
                text = this._getCheckboxOptText(val, props);
            }

            list.push({ name: text, count: countInfo[val] });
        }
        return list;
    }
}
