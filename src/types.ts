export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram';

export type ContentType = 'post' | 'thread' | 'article';

export interface GeneratedContent {
  platform: Platform;
  type: ContentType;
  content: string;
}