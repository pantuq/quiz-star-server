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

    @Prop()
    js: string;

    @Prop()
    css: string;

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ default: false })
    isStar: boolean;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ required: true })
    author: string;

    @Prop()
    componentList: {
        fe_id: string; // 组件id,需要前端控制
        type: string;
        title: string;
        isHidden: boolean;
        isLocked: boolean;
        props: object;
    }[];

    // 待补充
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
