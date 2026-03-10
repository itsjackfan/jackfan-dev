import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { externalPosts } from "./external-posts";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  isDraft: boolean;
  tags?: string[];
  externalUrl?: string;
}

const blogDirectory = join(process.cwd(), "content", "blog");
const draftsDirectory = join(blogDirectory, "drafts");

const isMarkdownFile = (name: string) => name.endsWith(".mdx");
const getSlug = (name: string) => name.replace(/\.mdx$/, "");

export function getBlogPosts(): BlogPost[] {
  try {
    // Only read from the main blog directory, not drafts
    const fileNames = readdirSync(blogDirectory, { withFileTypes: true });
    const posts = fileNames
      .filter((dirent) => dirent.isFile() && isMarkdownFile(dirent.name))
      .map((dirent) => {
        const fileName = dirent.name;
        const slug = getSlug(fileName);
        const fullPath = join(blogDirectory, fileName);
        const fileContents = readFileSync(fullPath, "utf-8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date || "",
          author: data.author || "",
          content,
          isDraft: false,
          tags: data.tags || [],
        };
      });

    const external = externalPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      author: p.author,
      content: "",
      isDraft: false,
      tags: p.tags,
      externalUrl: p.externalUrl,
    }));

    const now = new Date();
    now.setHours(23, 59, 59, 999); // include posts dated today

    return [...posts, ...external]
      .filter((p) => !p.date || new Date(p.date).getTime() <= now.getTime())
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  } catch (error) {
    // Directory doesn't exist yet, return empty array
    return [];
  }
}

export function getInternalBlogPosts(): BlogPost[] {
  return getBlogPosts().filter((p) => !p.externalUrl);
}

export function getBlogPost(slug: string): BlogPost | null {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  try {
    // First check published posts
    const publishedPath = join(blogDirectory, `${slug}.mdx`);
    if (existsSync(publishedPath)) {
      const fileContents = readFileSync(publishedPath, "utf-8");
      const { data, content } = matter(fileContents);

      // Treat future-dated posts as not yet published
      if (data.date && new Date(data.date).getTime() > now.getTime()) {
        return null;
      }

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        author: data.author || "",
        content,
        isDraft: false,
        tags: data.tags || [],
      };
    }

    // Then check drafts
    const draftPath = join(draftsDirectory, `${slug}.mdx`);
    if (existsSync(draftPath)) {
      const fileContents = readFileSync(draftPath, "utf-8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        author: data.author || "",
        content,
        isDraft: true,
        tags: data.tags || [],
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
    }
  });
  return Array.from(tagSet).sort();
}

