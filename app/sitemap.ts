/* eslint-disable prettier/prettier */
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://demonlord.pp.ua';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/movie`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/tv`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/anime`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/manga`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/list`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];
}
