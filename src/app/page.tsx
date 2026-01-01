import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <Badge variant="secondary" className="mb-6 text-sm">Welcome to LunBlog</Badge>
        <h1 className="text-7xl font-bold mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          Stay curious.
        </h1>
        <p className="text-2xl mb-12 leading-relaxed text-muted-foreground">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="text-base px-8 rounded-full">
            <Link href="/blog">Start reading</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base px-8 rounded-full">
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </div>

      <div className="mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Featured Topics</h2>
          <p className="text-muted-foreground">Explore our most popular categories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Technology', desc: 'Latest tech trends and innovations', icon: '💻' },
            { name: 'Programming', desc: 'Code tutorials and best practices', icon: '⚡' },
            { name: 'Career', desc: 'Professional growth and insights', icon: '🚀' }
          ].map((topic) => (
            <Card key={topic.name} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-border">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                <p className="text-sm text-muted-foreground">{topic.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
