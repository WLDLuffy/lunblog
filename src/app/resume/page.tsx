import { prisma } from '@/lib/prisma';
import { ResumeCard } from '@/components/resume/resume-card';
import { Divider, Empty } from 'antd';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';

export const dynamic = 'force-dynamic';

export default async function ResumePage() {
  const items = await prisma.resumeItem.findMany({
    orderBy: [{ displayOrder: 'desc' }, { startDate: 'desc' }],
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div style={{ marginBottom: 64, textAlign: 'center' }}>
        <Title style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '3.5rem' }}>
          Experience
        </Title>
        <Paragraph style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}>
          My professional journey
        </Paragraph>
      </div>

      <Divider />

      {items.length === 0 ? (
        <div style={{ padding: '96px 0', textAlign: 'center' }}>
          <Empty
            description={
              <span style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.45)' }}>
                No experience items yet.
              </span>
            }
          />
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <ResumeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
