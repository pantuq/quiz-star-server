import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
    @Prop({ required: true })
    questionId: string; //对应问卷的_id

    @Prop({
        type: [
            {
                componentFeId: { type: String },
                value: { type: [String] },
            },
        ],
    })
    answerList: {
        componentFeId: string; //组件的feId
        value: string[];
    }[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
