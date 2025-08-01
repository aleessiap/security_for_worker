import { EventTypeEnum, ICreateOperatorEvent } from "@visioscientiae/backoffice-packages-domo";
import { IsAlphanumeric, IsDate, IsDateString, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateOperatorEventDto implements ICreateOperatorEvent {
    @IsNotEmpty()
    @IsAlphanumeric()
    token: string;

    @IsNotEmpty()
    @IsDateString()
    timestamp: Date;
    
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(8, 8)
    sensorId: string;

    @IsNotEmpty()
    @IsEnum(EventTypeEnum)
    eventType: EventTypeEnum;
}
