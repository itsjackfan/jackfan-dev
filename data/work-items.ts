export type WorkCategory = 'role' | 'project' | 'paper' | 'event' | 'news' | 'book';

export type WorkItem = {
  id: string;
  title: string;
  category: WorkCategory;
  date: string;
  link?: string;
};

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  role: 'Role',
  project: 'Project',
  paper: 'Paper',
  book: 'Book',
  event: 'Event',
  news: 'News',
};

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function parseDateKey(date: string): number {
  const match = date.match(/([A-Z][a-z]{2})\s+(\d{4})/);
  if (match) return parseInt(match[2]) * 100 + MONTHS[match[1]];
  const yearMatch = date.match(/(\d{4})/);
  if (yearMatch) return parseInt(yearMatch[1]) * 100;
  return 0;
}

export const WORK_ITEMS: WorkItem[] = [
  // --- Roles ---
  {
    id: 'thirdlayer-blog',
    title: 'Transitioned off engineering work into blogging for ThirdLayer instead.',
    category: 'role',
    date: 'Jan 2026',
    link: 'https://jackfan.dev/blog'
  },
  {
    id: 'kempner',
    title: 'Took CS2821r with Prof. Yilun Du. Found it really interesting, so I joined his lab (Embodied Minds Lab).',
    category: 'role',
    date: 'Dec 2025',
  },
  {
    id: 'thirdlayer',
    title: 'Cold-DM\'d Regina and started as a forward-deployed and engineer at ThirdLayer (YC W25).',
    category: 'role',
    date: 'Sep 2025',
  },
  {
    id: 'series',
    title: 'Solo / founding engineer @ Series. Learned 80% of what I know about full-stack and product engineering (and vibe coding).',
    category: 'role',
    date: 'Apr 2025',
  },
  {
    id: 't4sg-dopf',
    title: 'First board position as director of partnerships and funding for T4SG. Met a TON of cool people / companies, learned how to sell and outreach, and made $9k+ in sponsorships.',
    category: 'role',
    date: 'Dec 2024',
  },
  {
    id: 't4sg',
    title: 'Became a project lead for Harvard T4SG\'s Ersilia project.',
    category: 'role',
    date: 'Oct 2024',
  },
  {
    id: 'htsg',
    title: 'Joined Harvard T4SG. First exposure to proper full-stack engineering, webdev, applied AI work, and collaborative software engineering.',
    category: 'role',
    date: 'Sep 2024',
  },
  {
    id: 'columbia',
    title: 'First research experience (computational neuroscience) @ Columbia University Medical Centre. Genetic causal factors for schizophrenia and psychiatric conditions.',
    category: 'role',
    date: 'Sep 2022',
    link: 'https://www.biorxiv.org/content/10.1101/2025.03.26.645419v1.full.pdf',
  },

  // --- Papers & publications ---
  {
    id: 'icml-2026',
    title: 'First ML paper submitted (ICML; Scaling Agentic Intelligence with Principled Multi-agent Decentralisation).',
    category: 'paper',
    date: 'Jan 2026',
    link: '/ICML_FINAL.pdf',
  },
  {
    id: 'setd1a',
    title: 'First paper publication w/ CUMC (biorxiv; Genomic and transcriptomic signatures of SETD1A disruption...)',
    category: 'paper',
    date: 'Mar 2025',
    link: 'https://www.biorxiv.org/content/10.1101/2025.03.26.645419v1.full.pdf',
  },
  {
    id: 'quantum-leap',
    title: 'First book publication: A Quantum Leap Forward, a simple quantum computing explainer intended for other high schoolers interested in the field.',
    category: 'book',
    date: 'Mar 2023',
  },

  // --- Events ---
  {
    id: 'gates-workshop',
    title: 'Attended Gates Foundation workshop on LLM-based agent memory in Seattle.',
    category: 'event',
    date: 'Mar 2026',
    link: 'https://jackfan.dev/blog/memory'
  },

  // --- Projects ---
  {
    id: 'autodiff',
    title: 'Started getting interested in ML and foundations. Built a custom autodiff + backprop engine a la Karpathy micrograd.',
    category: 'project',
    date: 'Dec 2025',
    link: 'https://github.com/itsjackfan/fpu/blob/main/ml/backprop_pytorch.ipynb',
  },
  {
    id: 'graphene',
    title: 'Graphene: class project for Harvard CS1060 (a final foray into proper full-stack eng).',
    category: 'project',
    date: 'Nov 2025',
    link: 'https://github.com/cs1060f25/graph-project',
  },
  {
    id: 'sero',
    title: 'Sero: class project for Harvard ES239 (also part of a final foray into proper full-stack eng).',
    category: 'project',
    date: 'Nov 2025',
    link: 'https://github.com/itsjackfan/sero',
  },
  {
    id: 'knowledger',
    title: 'Where it all started (full-stack, knowledge graphs, applied AI, hating on embeddings, etc.). Built Knowledger, a notetaking app focussed on self-organisation and quick capture.',
    category: 'project',
    date: 'Nov 2024',
    link: 'https://github.com/knowledger-dev/knowledger',
  },
];

export function getAllWorkItems(): WorkItem[] {
  const indexed = WORK_ITEMS.map((item, i) => ({ item, i }));
  indexed.sort((a, b) => {
    const diff = parseDateKey(b.item.date) - parseDateKey(a.item.date);
    return diff !== 0 ? diff : a.i - b.i;
  });
  return indexed.map(({ item }) => item);
}
