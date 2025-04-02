import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../profiles/dto/update-profile.dto';

@Injectable()
export class AdminService {
  constructor(private readonly db: PrismaService) {}

  async findAllJobs() {
    return this.db.job.findMany();
  }
  async findAllProfiles() {
    return this.db.profile.findMany({
      select: {
        created: true,
        description: true,
        email: true,
        id: true,
        isAdmin: true,
        name: true,
        username: true,
        profileImg: true,
      },
    });
  }

  async deleteOne(jobId: number) {
    return this.db.job.delete({
      where: {
        id: jobId,
      },
    });
  }

  async getDashBoardData() {
    try {
      const currentDate = new Date();

      const pastWeek = new Date();
      pastWeek.setDate(currentDate.getDate() - 7);

      const userCount = await this.db.profile.count();
      const jobCount = await this.db.job.count();

      const jobCountPastWeek = await this.db.job.count({
        where: {
          created: { gt: pastWeek },
        },
      });
      currentDate.setHours(0, 0, 0, 0);

      const weekdailyCounts = [];
      let thisWeekUserCount = 0;
      let pastWeekUserCount = 0;

      // checking this month
      const monthCheck = new Date();
      monthCheck.setDate(currentDate.getDate() - 30);
      const thisMonthUserCount = await this.db.profile.count({
        where: {
          created: { lte: currentDate, gte: monthCheck },
        },
      });
      const thisMonthJobCount = await this.db.job.count({
        where: {
          created: { lte: currentDate, gte: monthCheck },
        },
      });
      const thisMonthClosedJobs = await this.db.job.count({
        where: {
          date: { lte: currentDate, gte: monthCheck },
        },
      });
      // checking past month
      const pastMonthCheck = new Date();
      pastMonthCheck.setDate(currentDate.getDate() - 30);
      monthCheck.setDate(monthCheck.getDate() - 30);
      const pastMonthUserCount = await this.db.profile.count({
        where: {
          created: { gte: monthCheck, lt: pastMonthCheck },
        },
      });
      const pastMonthJobCount = await this.db.job.count({
        where: {
          created: { gte: monthCheck, lt: pastMonthCheck },
        },
      });
      const pastMonthClosedJobs = await this.db.job.count({
        where: {
          date: { gte: monthCheck, lt: pastMonthCheck },
        },
      });
      const daysOfTheWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      for (let index = 0; index < 7; index++) {
        // this week
        const startOfDay = new Date(currentDate);
        startOfDay.setDate(currentDate.getDate() - index);

        let endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const count = await this.db.profile.count({
          where: {
            created: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
        thisWeekUserCount += count;
        startOfDay.setDate(currentDate.getDate() - 5 - index);

        endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const pastDayCount = await this.db.profile.count({
          where: {
            created: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
        pastWeekUserCount += pastDayCount;
        weekdailyCounts.push({
          day: daysOfTheWeek[6 - startOfDay.getDay()],
          thisWeek: count,
          pastWeek: pastDayCount,
        });
      }

      return {
        jobCount,
        jobCountPastWeek,
        userCount,
        pastMonthJobCount,
        thisMonthJobCount,
        thisMonthClosedJobs,
        pastMonthClosedJobs,
        thisWeekUserCount,
        pastWeekUserCount,
        thisMonthUserCount,
        pastMonthUserCount: pastMonthUserCount > 0 ? pastMonthUserCount : 1,
        weekDailyCounts: weekdailyCounts,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(username: string) {
    try {
      return await this.db.profile.delete({
        where: {
          username,
        },
      });
    } catch {
      throw new Error('Nem létezik ilyen profil');
    }
  }

  async update(username, updateProfileDto: UpdateProfileDto) {
    const profile = await this.db.profile.findFirst({
      where: {
        OR: [
          { username: updateProfileDto.username },
          { email: updateProfileDto.email },
        ],
      },
    });
    if (profile != null) {
      throw new HttpException(
        'Már foglalt email cím vagy felhasználónév!',
        HttpStatus.CONFLICT,
      );
    }

    return this.db.profile.update({
      where: {
        username,
      },
      data: updateProfileDto,
    });
  }
}
