import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    problem: z.string().optional(),
    approach: z.string().optional(),
    technologies: z.array(z.string()),
    contributions: z.array(z.string()).optional(),
    results: z.string().optional(),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    featured: z.boolean().default(false),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()),
    technologies: z.array(z.string()).optional(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    honors: z.array(z.string()).optional(),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/skills' }),
  schema: z.object({
    category: z.string(),
    summary: z.string().optional(),
    evidence: z.string().optional(),
    items: z.array(z.string()),
  }),
});

const achievements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/achievements' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    issuer: z.string().optional(),
    url: z.url().optional(),
    type: z.enum(['certification', 'award', 'publication', 'hackathon', 'other']).default('other'),
  }),
});

export const collections = { projects, experience, education, skills, achievements };