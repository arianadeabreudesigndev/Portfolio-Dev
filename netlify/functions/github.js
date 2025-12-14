const GH_OWNER = 'arianadeabreudesigndev';
const API_BASE = 'https://api.github.com';

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

async function handler() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'GITHUB_TOKEN não configurado no Netlify.'
      })
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
      Array.isArray(repo.topics) &&
      repo.topics.map(t => t.toLowerCase()).includes('portfolio')
    );

    const projects = [];

    for (const repo of portfolioRepos) {
      const languages = await fetchJson(fetchImpl, repo.languages_url, headers);
      const defaultBranch = repo.default_branch || 'main';

      const previewUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${repo.name}/${defaultBranch}/assets/preview.svg`;

      let finalPreview = previewUrl;
      const headRes = await fetchImpl(previewUrl, {
        method: 'HEAD',
        headers
      });

      if (!headRes.ok) {
        finalPreview = null;
      }

      projects.push({
        name: repo.name,
        html_url: repo.html_url,
        homepage: repo.homepage || null,

        github_description: repo.description || null,

        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        preview: finalPreview,
        languages,
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
      body: JSON.stringify({
        error: 'Falha ao consultar GitHub',
        detail: error.message
      })
    };
  }
}

module.exports = { handler };
