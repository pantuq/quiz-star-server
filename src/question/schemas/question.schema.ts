import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
    timestamps: true, // 创建时间戳和修改时间戳
})
export class Question {
    @Prop({ required: true })
    title: string;

    @Prop()
    desc: string;

    // 待补充
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
