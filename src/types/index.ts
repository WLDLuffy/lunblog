import { BlogPost, ResumeItem, User } from '@prisma/client';

export type { BlogPost, ResumeItem, User };

export type PublicBlogPost = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'metadata'
>;

export type BlogPostWithContent = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'content' | 'publishedAt' | 'metadata'
>;

export type PublicResumeItem = Omit<ResumeItem, 'createdAt' | 'updatedAt'>;

export type PublicUser = Pick<User, 'id' | 'email' | 'name'>;
