import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const GARDEN_PATH = '/Users/jackfan/Documents/obby/Garden';
const GRAPH_CONFIG_PATH = join(GARDEN_PATH, '.obsidian/graph.json');
const OUTPUT_PATH = join(process.cwd(), 'data', 'graph-data.json');

interface GraphConfig {
  colorGroups: Array<{
    query: string;
    color: {
      a: number;
      rgb: number;
    };
  }>;
}

interface GraphNode {
  id: string;
  label: string;
  tags: string[];
  color: string;
  path: string;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  legend: Array<{ tag: string; color: string }>;
}

// Convert RGB integer to hex color
function rgbToHex(rgb: number): string {
  return `#${((rgb >> 16) & 255).toString(16).padStart(2, '0')}${((rgb >> 8) & 255).toString(16).padStart(2, '0')}${(rgb & 255).toString(16).padStart(2, '0')}`;
}

// Extract tag name from query (e.g., "tag:#behaviour  " -> "behaviour")
function extractTagFromQuery(query: string): string | null {
  const match = query.match(/tag:#(\w+)\s*/);
  return match ? match[1] : null;
}

// Parse graph.json and create tag-to-color mapping
async function getTagColorMap(): Promise<Map<string, string>> {
  try {
    const configContent = await fs.readFile(GRAPH_CONFIG_PATH, 'utf-8');
    const config: GraphConfig = JSON.parse(configContent);
    const tagColorMap = new Map<string, string>();
    
    for (const group of config.colorGroups) {
      const tag = extractTagFromQuery(group.query);
      if (tag) {
        tagColorMap.set(tag.toLowerCase(), rgbToHex(group.color.rgb));
      }
    }
    
    return tagColorMap;
  } catch (error) {
    console.error('Error reading graph.json:', error);
    return new Map();
  }
}

// Normalize file path to match link format (remove .md extension, handle subdirectories)
function normalizeFilePath(filePath: string, basePath: string): string {
  const relativePath = filePath.replace(basePath, '').replace(/^\//, '');
  return relativePath.replace(/\.md$/, '');
}

// Get node ID from file path (relative path without .md)
function getNodeId(filePath: string, basePath: string): string {
  return normalizeFilePath(filePath, basePath);
}

// Get display label from file path (filename without extension)
function getLabel(filePath: string): string {
  const basename = filePath.split('/').pop() || '';
  return basename.replace(/\.md$/, '');
}

// Extract all [[...]] links from markdown content
function extractLinks(content: string): string[] {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  
  return links;
}

// Find file path for a given link name
function findFileForLink(linkName: string, allFiles: string[], basePath: string): string | null {
  // Try exact match first (with .md extension)
  const exactMatch = allFiles.find(file => {
    const normalized = normalizeFilePath(file, basePath);
    return normalized === linkName || normalized === `${linkName}.md`;
  });
  
  if (exactMatch) return exactMatch;
  
  // Try case-insensitive match
  const lowerLinkName = linkName.toLowerCase();
  const caseMatch = allFiles.find(file => {
    const normalized = normalizeFilePath(file, basePath).toLowerCase();
    return normalized === lowerLinkName || normalized === `${lowerLinkName}.md`;
  });
  
  if (caseMatch) return caseMatch;
  
  // Try matching just the filename (ignoring subdirectory)
  const linkBasename = linkName.split('/').pop() || linkName;
  const basenameMatch = allFiles.find(file => {
    const filename = file.split('/').pop() || '';
    return filename === `${linkBasename}.md` || filename === linkBasename;
  });
  
  return basenameMatch || null;
}

// Recursively find all .md files
async function findAllMarkdownFiles(dir: string, fileList: string[] = []): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== '.obsidian' && entry.name !== 'node_modules') {
        await findAllMarkdownFiles(fullPath, fileList);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        fileList.push(fullPath);
      }
    }
    
    return fileList;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return fileList;
  }
}

async function exportGraphData() {
  try {
    console.log('Starting graph data export...');
    
    // Get all markdown files
    const allFiles = await findAllMarkdownFiles(GARDEN_PATH);
    console.log(`Found ${allFiles.length} markdown files`);
    
    // Get tag-to-color mapping
    const tagColorMap = await getTagColorMap();
    console.log(`Found ${tagColorMap.size} tag color mappings`);
    
    // Default color for nodes without matching tags
    const defaultColor = '#888888';
    
    // Build nodes map
    const nodesMap = new Map<string, GraphNode>();
    
    for (const filePath of allFiles) {
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const nodeId = getNodeId(filePath, GARDEN_PATH);
        const label = getLabel(filePath);
        const tags: string[] = Array.isArray(data.tags) ? data.tags : [];
        
        // Find first matching tag color, or use default
        let color = defaultColor;
        for (const tag of tags) {
          const tagColor = tagColorMap.get(tag.toLowerCase());
          if (tagColor) {
            color = tagColor;
            break;
          }
        }
        
        nodesMap.set(nodeId, {
          id: nodeId,
          label,
          tags,
          color,
          path: normalizeFilePath(filePath, GARDEN_PATH),
        });
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
    
    console.log(`Processed ${nodesMap.size} nodes`);
    
    // Build links
    const links: GraphLink[] = [];
    const linkSet = new Set<string>(); // Track unique links to avoid duplicates
    
    for (const filePath of allFiles) {
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { content } = matter(fileContent);
        const sourceNodeId = getNodeId(filePath, GARDEN_PATH);
        
        if (!nodesMap.has(sourceNodeId)) continue;
        
        const extractedLinks = extractLinks(content);
        
        for (const linkName of extractedLinks) {
          const targetFile = findFileForLink(linkName, allFiles, GARDEN_PATH);
          
          if (targetFile) {
            const targetNodeId = getNodeId(targetFile, GARDEN_PATH);
            
            // Only add link if target node exists and link doesn't exist yet
            if (nodesMap.has(targetNodeId)) {
              const linkKey = `${sourceNodeId}->${targetNodeId}`;
              if (!linkSet.has(linkKey)) {
                links.push({
                  source: sourceNodeId,
                  target: targetNodeId,
                });
                linkSet.add(linkKey);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing links for file ${filePath}:`, error);
      }
    }
    
    console.log(`Found ${links.length} links`);
    
    // Build legend from tag color map
    const legend: Array<{ tag: string; color: string }> = Array.from(tagColorMap.entries()).map(
      ([tag, color]) => ({ tag, color })
    );
    // Sort alphabetically for consistent display
    legend.sort((a, b) => a.tag.localeCompare(b.tag));
    
    const graphData: GraphData = {
      nodes: Array.from(nodesMap.values()),
      links,
      legend,
    };
    
    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Write to JSON file
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(graphData, null, 2), 'utf-8');
    
    console.log(`✅ Graph data exported successfully to ${OUTPUT_PATH}`);
    console.log(`   - Nodes: ${graphData.nodes.length}`);
    console.log(`   - Links: ${graphData.links.length}`);
    console.log(`   - Legend entries: ${graphData.legend.length}`);
  } catch (error) {
    console.error('Error exporting graph data:', error);
    process.exit(1);
  }
}

// Run the export
exportGraphData();

