import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Clinic, ClinicSchema } from './schemas/clinic.schema';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Clinic.name, schema: ClinicSchema }]),
    ],
    exports: [ClinicService],
    providers: [ClinicService],
    controllers: [ClinicController]
})
export class ClinicModule {}
