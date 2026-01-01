import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('Admin123!@#SecurePassword', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lunblog.com' },
    update: {},
    create: {
      email: 'admin@lunblog.com',
      passwordHash,
      name: 'Blog Admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);
  console.log('   Default password: Admin123!@#SecurePassword');
  console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');

  // Create sample blog posts
  const post1 = await prisma.blogPost.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-with-nextjs',
      content: `# Getting Started with Next.js 15

Next.js 15 introduces several groundbreaking features that make building modern web applications easier than ever.

## App Router

The App Router is now stable and provides a more intuitive way to structure your application. With Server Components by default, you get better performance out of the box.

## Key Features

- **Server Components**: Reduce client-side JavaScript automatically
- **Streaming**: Improve perceived performance with progressive rendering
- **Data Fetching**: Simplified patterns with async/await in components

## Conclusion

Next.js 15 represents a significant step forward in React development. Give it a try in your next project!`,
      excerpt:
        'Explore the new features in Next.js 15 and learn how the App Router can improve your development experience.',
      status: 'published',
      publishedAt: new Date('2025-12-15'),
      metadata: {
        tags: ['Next.js', 'React', 'Web Development'],
        category: 'Tutorial',
        readingTime: 5,
      },
    },
  });
  console.log('✅ Blog post created:', post1.title);

  const post2 = await prisma.blogPost.upsert({
    where: { slug: 'typescript-best-practices' },
    update: {},
    create: {
      title: 'TypeScript Best Practices for 2026',
      slug: 'typescript-best-practices',
      content: `# TypeScript Best Practices for 2026

As TypeScript continues to evolve, staying up-to-date with best practices is crucial for maintaining high-quality codebases.

## Use Strict Mode

Always enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Avoid \`any\`

The \`any\` type defeats the purpose of TypeScript. Use \`unknown\` for truly unknown types.

## Leverage Type Inference

TypeScript's type inference is powerful. Let it do the work when possible.

## Conclusion

Following these practices will help you write more maintainable TypeScript code.`,
      excerpt:
        'Learn the essential TypeScript best practices that will help you write better, more maintainable code in 2026.',
      status: 'draft',
      metadata: {
        tags: ['TypeScript', 'Best Practices', 'Programming'],
        category: 'Tutorial',
        readingTime: 7,
      },
    },
  });
  console.log('✅ Blog post created (draft):', post2.title);

  // Create sample resume items
  const resume1 = await prisma.resumeItem.create({
    data: {
      company: 'Tech Innovations Inc.',
      position: 'Senior Software Engineer',
      description: `Led development of microservices architecture using Next.js, Node.js, and PostgreSQL. Mentored junior developers and established coding standards. Improved application performance by 40% through optimization efforts.`,
      startDate: new Date('2023-01-01'),
      endDate: null, // Current position
      displayOrder: 100,
    },
  });
  console.log('✅ Resume item created:', resume1.company);

  const resume2 = await prisma.resumeItem.create({
    data: {
      company: 'Digital Solutions Ltd.',
      position: 'Software Engineer',
      description: `Developed RESTful APIs and responsive web applications using React and Express. Collaborated with cross-functional teams to deliver high-quality features. Implemented automated testing with 85% code coverage.`,
      startDate: new Date('2020-06-01'),
      endDate: new Date('2022-12-31'),
      displayOrder: 90,
    },
  });
  console.log('✅ Resume item created:', resume2.company);

  const resume3 = await prisma.resumeItem.create({
    data: {
      company: 'Startup Ventures',
      position: 'Junior Developer',
      description: `Built frontend components and contributed to backend services. Participated in agile development process and code reviews. Gained experience with modern web technologies and best practices.`,
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-05-31'),
      displayOrder: 80,
    },
  });
  console.log('✅ Resume item created:', resume3.company);

  console.log('🎉 Seeding complete!');
  console.log('\n📝 Summary:');
  console.log(`   - ${1} admin user created`);
  console.log(`   - ${2} blog posts created (1 published, 1 draft)`);
  console.log(`   - ${3} resume items created`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
