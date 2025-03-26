import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async getMessages(senderId: number, receiverId: number) {
    return await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
  async getDifferentProfiles(userId:number){
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        senderProfile: {
          select: { id: true, name: true, username: true, profileImg: true, email: true, created: true }
        },
        receiverProfile: {
          select: { id: true, name: true, username: true, profileImg: true, email: true, created: true }
        }
      },
    });
    const profiles = [...messages.map(msg => msg.senderProfile), ...messages.map(msg => msg.receiverProfile)];

    const uniqueProfiles = Array.from(new Map(profiles.filter(profile => profile.id !== userId).map(profile => [profile.id, profile])).values());

    const profilesWithLastMessage = uniqueProfiles.map(profile => {
      const profileMessages = messages.filter(
        msg => msg.senderId === profile.id || msg.receiverId === profile.id
      );

      const lastMessage = profileMessages[profileMessages.length - 1];

      return {
        ...profile, 
        lastMessage: lastMessage ? lastMessage.content : null,
        lastMessageDate: lastMessage ? lastMessage.createdAt : null
      };
    });
    return profilesWithLastMessage;
  }
  async createMessage(createChatDto : CreateChatDto){
    return await this.prisma.message.create({
      data : {...createChatDto,createdAt : new Date()}
    })
  }
}
