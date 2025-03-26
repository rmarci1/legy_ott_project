import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateChatDto {

    @ApiProperty({
        description: 'The id of who sends the message',
        type: 'number'
    })
    @IsNumber()
    senderId  : number;

    @ApiProperty({
        description: 'The id of who receives the message',
        type: 'number'
    })
    @IsNumber()
    receiverId : number;

    @ApiProperty({
        description: 'The content of the message',
        type: 'string'
    })
    @IsString()
    content : string;
}
