export interface ExternalPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  externalUrl: string;
}

// Add your external writing here. The slug is only used as a React key.
export const externalPosts: ExternalPost[] = [
  // Example:
  // {
  //   slug: "my-post-on-other-blog",
  //   title: "My Post on Other Blog",
  //   date: "10 Mar 2026",
  //   author: "Jack Fan",
  //   tags: ["external"],
  //   externalUrl: "https://example.com/my-post",
  // },
  {
    slug: "dex-openclaw",
    title: "On the OpenClaw wave and AI agents vs. assistants",
    date: "26 Feb 2026",
    author: "Jack Fan",
    tags: ["external"],
    externalUrl: "https://www.joindex.com/blog/openclaw"
  },
  // {
  //   slug: "dex-context-graphs",
  //   title: "The world in context graphs",
  //   date: "03 Mar 2026",
  //   author: "Jack Fan",
  //   tags: ["external"],
  //   externalUrl: "https://www.joindex.com/blog/context-graphs"
  // },
  // {
  //   slug: "dex-write-things-down",
  //   title: "Write This Down: Notetaking Relieves Stress and Mental Clutter",
  //   date: "08 Mar 2026",
  //   author: "Jack Fan",
  //   tags: ["external"],
  //   externalUrl: "https://www.joindex.com/blog/write-things-down"
  // },
  {
    slug: "thirdlayer-weight-token-memory",
    title: "Memory in the weight space and the token space",
    date: "10 Mar 2026",
    author: "Jack Fan",
    tags: ["external"],
    externalUrl: "https://www.thirdlayer.inc/blog/weight-space-vs-token-space"
  }
];
