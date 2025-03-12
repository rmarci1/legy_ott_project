import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {

  constructor(private readonly db: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.db.review.create({
      data: createReviewDto
    });
  }

  findAll() {
    return this.db.review.findMany();
  }

  async findAllByUsername(username: string) {
    try{
      return await this.db.review.findMany({
        where: {
          reviewed_un: username
        }
      });
    }
    catch{
      throw new Error("Nincsenek értékelések ehhez a profilhoz!")
    }
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
  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try{
      return await this.db.review.update({
        where: {
          id
        },
        data: updateReviewDto
      });
    }
    catch {
      throw new Error("Nem létezik ilyen értékelés");
    }
  }

  async remove(id: number) {
    try{
      return await this.db.review.delete({
        where: {
          id: id,
        },
      });
    }
    catch {
      throw new Error("Nem létezik ilyen értékelés");
    }
  }
}
