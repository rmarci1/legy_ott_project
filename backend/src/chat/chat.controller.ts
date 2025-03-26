import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:senderId/:receiverId')
  async getMessages(@Param('senderId') senderId : string, @Param('receiverId') receiverId: string){
    return this.chatService.getMessages(+senderId,+receiverId);
  }
  @Get('different/:userId')
  async getDifferentProfiles(@Param('userId') userId : string){
    return this.chatService.getDifferentProfiles(+userId);
  }
  @Post('send')
  async createMessage(@Body() createChatDto : CreateChatDto){
    return this.chatService.createMessage(createChatDto);
  } 
}
