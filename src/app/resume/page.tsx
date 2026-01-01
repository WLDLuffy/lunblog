import { prisma } from '@/lib/prisma';
import { ResumeCard } from '@/components/resume/resume-card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function ResumePage() {
  const items = await prisma.resumeItem.findMany({
    orderBy: [{ displayOrder: 'desc' }, { startDate: 'desc' }],
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Experience</h1>
        <p className="text-lg text-muted-foreground">My professional journey</p>
      </div>

      <Separator className="mb-12" />

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-muted-foreground">
            No experience items yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <ResumeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
