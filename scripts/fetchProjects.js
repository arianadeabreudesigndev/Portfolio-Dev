/**
 * Script para gerar projects.json a partir dos repositórios públicos do GitHub.
 * Fluxo:
 *  1) Busca lista de repositórios do usuário.
 *  2) Para cada repositório, busca linguagens e README.md bruto.
 *  3) Lê o cabeçalho padronizado do README (title, short_description, description).
 *  4) Monta o objeto final e grava em ../projects.json.
 *
 * Use Node 18+ (fetch nativo). Opcional: definir GITHUB_TOKEN para ampliar o rate limit.
 */

const fs = require('fs/promises');
const path = require('path');

const OWNER = 'arianadeabreudesigndev';
const API_BASE = 'https://api.github.com';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-projects-fetcher'
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn(`Requisição falhou (${res.status}) em ${url}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Erro de rede em ${url}:`, error.message);
    return null;
  }
}

async function fetchRepos() {
  return fetchJson(`${API_BASE}/users/${OWNER}/repos?per_page=100`);
}

async function fetchLanguages(repo) {
  return (await fetchJson(`${API_BASE}/repos/${OWNER}/${repo}/languages`)) || {};
}

async function fetchReadme(repo) {
  const data = await fetchJson(`${API_BASE}/repos/${OWNER}/${repo}/readme`);
  if (!data?.content) return null;

  try {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.warn(`Falha ao decodificar README de ${repo}:`, error.message);
    return null;
  }
}

function parseReadme(readme) {
  if (!readme) return null;

  const lines = readme.split(/\r?\n/);
  const topLines = lines.slice(0, 12); // metadados ficam no topo

  const rawTitle = topLines.find(line => line.trim());
  const title = rawTitle
    ? rawTitle.trim().replace(/^#+\s*/, '') // remove markdown heading
    : null;

  let shortDescription;
  let description;

  for (const line of topLines) {
    if (!shortDescription) {
      const matchShort = line.match(/^\s*['"]?short_description:\s*(.+?)\s*;\s*$/i);
      if (matchShort) {
        shortDescription = matchShort[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }

    if (!description) {
      const matchDescription = line.match(/^\s*['"]?(full_description|description):\s*(.+?)\s*;\s*$/i);
      if (matchDescription) {
        description = matchDescription[2].trim().replace(/^['"]|['"]$/g, '');
      }
    }

    if (shortDescription && description) break;
  }

  if (!title || !shortDescription || !description) return null;

  return {
    title,
    shortDescription,
    description
  };
}

function buildProject(repo, parsedReadme, languages) {
  const languageList = Object.keys(languages || {});

  return {
    name: repo.name,
    fullName: repo.full_name,
    repoUrl: repo.html_url,
    homepage: repo.homepage || null,
    defaultBranch: repo.default_branch,
    githubDescription: repo.description,
    topics: repo.topics || [],
    readmeTitle: parsedReadme.title,
    short_description: parsedReadme.shortDescription,
    description: parsedReadme.description,
    languages,
    languageList,
    archived: repo.archived,
    disabled: repo.disabled,
    visibility: repo.visibility,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at
  };
}

async function main() {
  const repos = await fetchRepos();
  if (!Array.isArray(repos)) {
    console.error('Não foi possível obter a lista de repositórios.');
    process.exit(1);
  }

  const projects = [];

  for (const repo of repos) {
    const [languages, readmeContent] = await Promise.all([
      fetchLanguages(repo.name),
      fetchReadme(repo.name)
    ]);

    if (!readmeContent) {
      console.warn(`Ignorando ${repo.name}: README não encontrado.`);
      continue;
    }

    const parsed = parseReadme(readmeContent);
    if (!parsed) {
      console.warn(`Ignorando ${repo.name}: padrão de metadados não encontrado.`);
      continue;
    }

    projects.push(buildProject(repo, parsed, languages));
  }

  const output = {
    owner: OWNER,
    generatedAt: new Date().toISOString(),
    projectsCount: projects.length,
    projects
  };

  const outputPath = path.join(__dirname, '..', 'projects.json');
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`projects.json atualizado com ${projects.length} projeto(s).`);
}

main().catch(error => {
  console.error('Erro inesperado:', error);
  process.exit(1);
});

