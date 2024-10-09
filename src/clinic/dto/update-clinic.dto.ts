import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsObject, IsString, Min } from "class-validator";
import { Address } from "src/common/models/address.model";
import { EachDayInfo } from "src/common/models/eachDayInfo.model";

export class UpdateClinicDto {
    @IsString()
    @IsNotEmpty()
    readonly docId: string;

    @IsObject()
    @IsNotEmpty()
    readonly clinicAddress: Address;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly appointmentFee: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly followupFee: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly followupDays: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(5)
    readonly slotDuration: number;

    @IsArray()
    @ArrayNotEmpty()
    clinicTimings: EachDayInfo[];

}