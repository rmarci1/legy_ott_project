import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {

  constructor(private readonly db: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const rev = this.db.review.create({
      data: createReviewDto
    });

    console.log(rev)

    return rev;
  }

  findAll() {
    return this.db.review.findMany();
  }

  async findAllByUsername(username: string) {
    const user = await this.db.profile.findUnique({
      where: {
        username
      }
    })
    if(user != null){
      return this.db.review.findMany({
        where: {
          reviewed_un: username
        }
      });
    }
    throw new NotFoundException("Nem létezik ilyen profil!")
  }
  async findAverageRating(username : string){
    try{
      return await this.db.review.aggregate({
        where: {
          reviewed_un: username
        },
        _avg: {
          review: true
        }
      });
    }
    catch{
      throw new Error("Nincsenek értékelések ehhez a profilhoz!")
    }
  }
  async update(id: number, updateReviewDto: UpdateReviewDto, req: Request) {
    const rev = await this.db.review.findUnique({
      where: {
        id
      }
    })

    if(rev != null){
      if(rev.reviewer_un == req['profile']['username']){
        return this.db.review.update({
          where: {
            id
          },
          data: updateReviewDto
        });
      }

      throw new UnauthorizedException('Csak a saját maga által készített értékeléseket módosíthatja!')
    }

    throw new NotFoundException("Nem létezik ilyen értékelés");
  }

  async remove(id: number, req: Request) {
    const rev = await this.db.review.findUnique({
      where: {
        id
      }
    })

    if(rev != null){
      if(rev.reviewer_un == req['profile']['username']){
        return this.db.review.delete({
          where: {
            id: id,
          },
        });
      }

      throw new UnauthorizedException('Csak a saját maga által készített értékeléseket módosíthatja!')
    }

    throw new NotFoundException("Nem létezik ilyen értékelés");
  }
}
