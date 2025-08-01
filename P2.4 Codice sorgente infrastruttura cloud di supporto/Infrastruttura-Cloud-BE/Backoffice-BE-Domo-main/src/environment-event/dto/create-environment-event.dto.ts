import { EventTypeEnum, ICreateEnvironmentEvent } from "@visioscientiae/backoffice-packages-domo";
import { IsAlphanumeric, IsDateString, IsEnum, IsNotEmpty, Length } from "class-validator";

export class CreateEnvironmentEventDto implements ICreateEnvironmentEvent {
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
