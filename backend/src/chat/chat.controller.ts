import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: "Get messages for chat"
  })
  @Get('messages/:senderId/:receiverId')
  async getMessages(@Param('senderId') senderId : string, @Param('receiverId') receiverId: string){
    return this.chatService.getMessages(+senderId,+receiverId);
  }

  @ApiOperation({
    summary: "Get profiles that the user chatted with"
  })
  @Get('different/:userId')
  async getDifferentProfiles(@Param('userId') userId : string){
    return this.chatService.getDifferentProfiles(+userId);
  }

  @ApiOperation({
    summary: "Create a message"
  })
  @Post('send')
  async createMessage(@Body() createChatDto : CreateChatDto){
    return this.chatService.createMessage(createChatDto);
  } 
}
