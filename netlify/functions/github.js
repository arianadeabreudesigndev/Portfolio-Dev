const GH_OWNER = 'arianadeabreudesigndev';
const API_BASE = 'https://api.github.com';
const README_LINES_WINDOW = 12; // metadados ficam no topo do README

async function ensureFetch() {
  if (typeof fetch === 'function') return fetch;
  const { default: nodeFetch } = await import('node-fetch');
  return nodeFetch;
}

function buildHeaders(token) {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    Authorization: `Bearer ${token}`
  };
}

async function fetchJson(fetchImpl, url, headers) {
  const res = await fetchImpl(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub erro ${res.status} em ${url}: ${text}`);
  }
  return res.json();
}

async function fetchReadmeContent(fetchImpl, repoName, headers) {
  try {
    const res = await fetchImpl(
      `${API_BASE}/repos/${GH_OWNER}/${repoName}/readme`,
      { headers }
    );

    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro ${res.status} ao buscar README: ${text}`);
    }

    const data = await res.json();
    if (!data?.content) return null;

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.warn(`Falha ao obter README de ${repoName}:`, error.message);
    return null;
  }
}

function parseReadmeMeta(readmeContent) {
  if (!readmeContent) return null;

  const lines = readmeContent.split(/\r?\n/);
  const windowLines = lines.slice(0, README_LINES_WINDOW);

  const rawTitle = windowLines.find(line => line.trim());
  const title = rawTitle ? rawTitle.trim().replace(/^#+\s*/, '') : null;

  let shortDescription;
  let fullDescription;

  for (const line of windowLines) {
    if (!shortDescription) {
      const matchShort = line.match(/^\s*['"]?short_description:\s*(.+?)\s*;\s*$/i);
      if (matchShort) {
        shortDescription = matchShort[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }

    if (!fullDescription) {
      const matchFull = line.match(/^\s*['"]?(full_description|description):\s*(.+?)\s*;\s*$/i);
      if (matchFull) {
        fullDescription = matchFull[2].trim().replace(/^['"]|['"]$/g, '');
      }
    }

    if (shortDescription && fullDescription) break;
  }

  if (!title && !shortDescription && !fullDescription) return null;

  return { title, shortDescription, fullDescription };
}

async function handler() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GITHUB_TOKEN não configurado no Netlify.' })
    };
  }

  try {
    const fetchImpl = await ensureFetch();
    const headers = buildHeaders(token);

    const repos = await fetchJson(
      fetchImpl,
      `${API_BASE}/users/${GH_OWNER}/repos?per_page=100`,
      headers
    );

    const portfolioRepos = (repos || []).filter(repo =>
      Array.isArray(repo.topics) && repo.topics.map(t => t.toLowerCase()).includes('portfolio')
    );

    const projects = [];

    for (const repo of portfolioRepos) {
      const languages = await fetchJson(fetchImpl, repo.languages_url, headers);
      const languageList = Object.keys(languages || {});

      let readmeMeta = null;
      try {
        const readmeContent = await fetchReadmeContent(fetchImpl, repo.name, headers);
        readmeMeta = parseReadmeMeta(readmeContent);
      } catch (err) {
        console.warn(`Falha ao obter README de ${repo.name}:`, err.message);
      }

      const defaultBranch = repo.default_branch || 'main';
      const previewUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${repo.name}/${defaultBranch}/assets/preview.svg`;

      let finalPreview = previewUrl;
      const headRes = await fetchImpl(previewUrl, { method: 'HEAD', headers });
      if (!headRes.ok) finalPreview = null;

      projects.push({
        name: repo.name,
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        github_description: repo.description,
        description: readmeMeta?.fullDescription || repo.description || '',
        short_description: readmeMeta?.shortDescription || repo.short_description || repo.description || '',
        readmeTitle: readmeMeta?.title || repo.name,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        preview: finalPreview,
        languages,
        languageList,
        default_branch: defaultBranch
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        owner: GH_OWNER,
        count: projects.length,
        fetchedAt: new Date().toISOString(),
        projects
      })
    };
  } catch (error) {
    console.error('Erro na função github:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Falha ao consultar GitHub', detail: error.message })
    };
  }
}

module.exports = { handler };

