import { PrismaClient } from '@prisma/client'
import { fakerHU as faker } from "@faker-js/faker";
import { defaultProfilePicUrl } from '../src/constants'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

const main = async () => {
    const generatedUsernames: Set<string> = new Set();
    const generatedEmails: Set<string> = new Set();

  const profiles = await Promise.all(
    Array.from({ length: 500 }).map(async () => {
      let username: string;
      let email: string;
      do {
        username = faker.internet.username();
      } while (generatedUsernames.has(username));
      do {
        email = faker.internet.email();
      } while (generatedEmails.has(email));

      generatedEmails.add(email);
      generatedUsernames.add(username);

      const existingProfile = await prisma.profile.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingProfile) {
        console.warn(`conflict: username: ${username} or email ${email} already exists. Skipping`);
        return null;
      }

      const date = new Date();
      date.setDate(date.getDate() + faker.number.int({ min: -60, max: 0 }));

      return prisma.profile.create({
        data: {
          name: faker.person.fullName(),
          username,
          email: faker.internet.email(),
          password: await bcrypt.hash('Asd1234@', 10),
          description: faker.lorem.lines(10),
          profileImg: defaultProfilePicUrl,
          created: date,
          isAdmin: faker.datatype.boolean()
        }
      });
    })
  );

  const validProfiles = profiles.filter(profile => profile !== null);
  console.log(`Successfully created ${validProfiles.length} profiles.`);

    const citys = ["Budapest", "Debrecen", "Szeged", "Győr", "Nyíregyháza", "Veszprém", "Nógrád", "Fejér"];
    const names = ["Közösségi Segítő Önkéntes", "Idősgondozási Önkéntes", "Állatmenhelyi Önkéntes", "Környezetvédelmi Önkéntes", "Kórházi Önkéntes",
        "Rendezvényszervező Önkéntes", "Katasztrófaelhárítási Önkéntes", "Oktatási és Mentorálási Önkéntes", "Étel- és Ruhaosztó Önkéntes", "Sport és Ifjúsági Önkéntes"
    ];

  if (validProfiles.length === 0) {
    console.error("No valid profiles found. Skipping job creation.");
    return;
  }

  const jobs = await Promise.all(
    Array.from({ length: 564 }).map(async (_, index) => {
      try {
        const date = new Date();
        const create = new Date();
        create.setDate(create.getDate() + faker.number.int({ min: -60, max: 0 }));
        date.setDate(date.getDate() + faker.number.int({ min: -60, max: 60 }));
        const max_attending = faker.number.int({ min: 5, max: 30 });

        const job = await prisma.job.create({
          data: {
            name: names[faker.number.int({ min: 0, max: names.length - 1 })],
            address: citys[faker.number.int({ min: 0, max: citys.length - 1 })],
            current_attending: faker.number.int({ min: 0, max: max_attending }),
            max_attending,
            date,
            description: faker.lorem.paragraphs(10),
            from: profiles[index % profiles.length]?.username || "fallback_username",
            created: create,
            img: defaultProfilePicUrl
          }
        });

        return job;
      } catch (error) {
        console.error(`Job creation failed at index ${index}:`, error);
        return null;
      }
    })
  );

  const validJobs = jobs.filter(job => job !== null);
  console.log(`Successfully created jobs: ${validJobs.length}`);

  await Promise.all(
    jobs.map(async (job) => {
      const profileIndex = faker.number.int({ min: 0, max: validProfiles.length - 1 });

      const selectedProfile = validProfiles[profileIndex];
      if (!selectedProfile) {
        console.warn(`Skipping jobProfile creation due to missing profile at index ${profileIndex}`);
        return null;
      }

      const isSaved = faker.datatype.boolean();
      await prisma.jobProfile.create({
        data: {
          profileId: selectedProfile.id,
          jobId: job.id,
          saveForLater: isSaved,
          isApplied: isSaved ? faker.datatype.boolean() : true
        }
      });
    })
  );


  const res = await Promise.all(
        Array.from({ length: 50 }).map(async () => {
            await prisma.review.create({
                data: {
                    reviewer_un: profiles[faker.number.int({ min: 0, max: 29 })].username,
                    reviewed_un: profiles[faker.number.int({ min: 0, max: 29 })].username,
                    review: faker.number.int({ min: 1, max: 5 }),
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
