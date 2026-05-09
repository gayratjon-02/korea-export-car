import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@koreacarimport.com' },
    update: {},
    create: {
      email: 'admin@koreacarimport.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create countries
  const countriesData = [
    { name: "O'zbekiston", nameUz: "O'zbekiston", code: 'UZ' },
    { name: 'Qozog\'iston', nameUz: 'Qozog\'iston', code: 'KZ' },
    { name: 'Qirg\'iziston', nameUz: 'Qirg\'iziston', code: 'KG' },
    { name: 'Tojikiston', nameUz: 'Tojikiston', code: 'TJ' },
    { name: 'Rossiya', nameUz: 'Rossiya', code: 'RU' },
    { name: 'Dubay (BAA)', nameUz: 'Dubay (BAA)', code: 'AE' },
  ];

  for (const c of countriesData) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log('✅ Countries created');

  // Create cities
  const citiesMap: Record<string, string[]> = {
    UZ: ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona', 'Nukus', 'Qarshi'],
    KZ: ['Almati', 'Nur-Sulton (Astana)', 'Shymkent', 'Aqtobe', 'Qaragandy'],
    KG: ['Bishkek', 'Osh', 'Jalol-Obod', 'Karakol'],
    TJ: ['Dushanbe', 'Xo\'jand', 'Qo\'rg\'onteppa'],
    RU: ['Moskva', 'Sankt-Peterburg', 'Vladivostok', 'Novosibirsk', 'Yekaterinburg'],
    AE: ['Dubay', 'Abu Dabi', 'Sharjah'],
  };

  for (const [code, cities] of Object.entries(citiesMap)) {
    const country = await prisma.country.findFirst({ where: { code } });
    if (!country) continue;

    for (const cityName of cities) {
      await prisma.city.upsert({
        where: { id: `${code}-${cityName}` },
        update: {},
        create: {
          countryId: country.id,
          name: cityName,
          nameUz: cityName,
        },
      });
    }
  }
  console.log('✅ Cities created');

  // Create sample shipping rates
  const uzCountry = await prisma.country.findFirst({ where: { code: 'UZ' } });
  if (uzCountry) {
    const tashkent = await prisma.city.findFirst({
      where: { countryId: uzCountry.id, name: 'Toshkent' },
    });
    if (tashkent) {
      await prisma.shippingRate.upsert({
        where: { cityId_originPort: { cityId: tashkent.id, originPort: 'Pyeongtaek' } },
        update: { priceUsd: 2500 },
        create: { cityId: tashkent.id, originPort: 'Pyeongtaek', priceUsd: 2500 },
      });
    }
  }
  console.log('✅ Sample shipping rates created');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
