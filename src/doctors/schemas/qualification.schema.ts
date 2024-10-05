import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { QualificationType, Specialization } from "src/common/enums";


@Schema()
export class Qualification extends Document {
    @Prop({ type: String })
    college: string;

    @Prop({ type: String })
    degree: string;

    @Prop({ type: Date })
    yearOfPassing: Date;

    @Prop({ type: String, enum: Object.values(QualificationType)})
    qualificationType: QualificationType;

    @Prop({ type: String, enum: Object.values(Specialization)})
    specialization: Specialization;
}

export const QualificationSchema = SchemaFactory.createForClass(Qualification);