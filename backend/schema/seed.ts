import { PrismaClient } from '@prisma/client'
import { fakerHU as faker } from "@faker-js/faker";
import { defaultProfilePicUrl } from '../src/constants'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()
const main = async () => {

    const profiles = await Promise.all(
        Array.from({ length: 30 }).map(async () =>
          prisma.profile.create({
            data: {
              name: faker.person.fullName(),
              username: faker.internet.username(),
              email: faker.internet.email(),
              password: await bcrypt.hash('Asd1234@', 10),
              description: faker.lorem.lines(10),
              profileImg: defaultProfilePicUrl,
              isAdmin: faker.datatype.boolean()
            }
          }, )
        )
    );
    const citys = ["Budapest","Debrecen","Szeged","Győr","Nyíregyháza","Veszprém","Nógrád","Fejér"];
    const names = ["Közösségi Segítő Önkéntes","Idősgondozási Önkéntes","Állatmenhelyi Önkéntes","Környezetvédelmi Önkéntes","Kórházi Önkéntes",
        "Rendezvényszervező Önkéntes", "Katasztrófaelhárítási Önkéntes", "Oktatási és Mentorálási Önkéntes", "Étel- és Ruhaosztó Önkéntes", "Sport és Ifjúsági Önkéntes"
    ]
    const jobs = await Promise.all(
        Array.from({ length: 50 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + (faker.number.int({min: -5, max: 20})));
            const max_attending = faker.number.int({min: 5, max: 30});
            return prisma.job.create({
                data: {
                    name: names[faker.number.int({min: 0, max: names.length-1})],
                    address: citys[faker.number.int({min: 0, max: citys.length-1})],
                    current_attending: faker.number.int({ min: 0, max: max_attending }),
                    max_attending: max_attending,
                    date: date,
                    description: faker.lorem.paragraphs(10),
                    from: profiles[index % profiles.length].username,
                    img: defaultProfilePicUrl
                }
            });
        })
    );

    await Promise.all(
        jobs.map(async (job, index) => {
            const isSaved = faker.datatype.boolean();
            await prisma.jobProfile.create({
                data: {
                    profileId: profiles[faker.number.int({min:0, max:profiles.length-1})].id,
                    jobId: job.id,
                    saveForLater: isSaved,
                    isApplied : isSaved ? faker.datatype.boolean() : true
                }
            })
        }
        )
    );
    const res = await Promise.all(
        Array.from({length : 50}).map(async () => {
            await prisma.review.create({
                data: {
                    reviewer_un : profiles[faker.number.int({min:0, max:29})].username,
                    reviewed_un : profiles[faker.number.int({min:0, max:29})].username,
                    review: faker.number.int({min: 1, max: 5}),
                    desc: faker.lorem.paragraph(10),
                }
            }) 
        })
    )
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
