function buildCard(project) {
  const card = document.createElement('div');
  card.className = 'projectItem';
  card.dataset.tech = project.languageList.join(' ').toLowerCase();
  card.dataset.category = project.topics[0] || 'uncategorized';
  card.dataset.status = 'completed';
  card.dataset.date = project.pushedAt?.replace(/-/g, '').slice(0, 6) || '';

  const tagsHtml = project.languageList
    .slice(0, 4)
    .map(tag => `<span class="tag">${tag}</span>`)
    .join('');

  const imageSrc = project.previewUrl || '/src/img/project-Images/Portfolio.svg';

  card.innerHTML = `
    <a href="${project.repoUrl}" class="project-image-link" target="_blank" rel="noopener">
        <img class="projectImage" src="${imageSrc}" alt="${project.name}">
    </a>
    <div class="projectDescriptionContainer">
        <article>
            <h2>${project.readmeTitle}</h2>
            <p>${project.short_description}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
        </article>
    </div>
    <div class="project-details" style="display: none;">
        <div class="detailed-description">${project.description}</div>
        <div class="github-url">${project.repoUrl}</div>
        <div class="demo-url">${project.homepage || ''}</div>
    </div>
  `;

  return card;
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!projects.length) {
    grid.innerHTML = '<p class="loading-projects">Nenhum projeto encontrado.</p>';
    return;
  }

  projects.forEach(project => {
    const card = buildCard(project);
    grid.appendChild(card);
  });
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  // garante que os eventos do filtro estejam prontos mesmo antes de popular as techs
  const filterManagerInstance = (typeof window !== 'undefined' && (window.ensureFilterManager?.() || window.filterManager)) || null;

  grid.innerHTML = '<p class="loading-projects">Carregando projetos...</p>';

  let response;
  try {
    response = await fetch('/.netlify/functions/github');
  } catch (error) {
    grid.innerHTML = '<p class="loading-projects">Falha de rede ao carregar projetos.</p>';
    return;
  }

  if (!response.ok) {
    grid.innerHTML = `
      <p class="loading-projects">
        Não foi possível carregar os projetos (erro ${response.status}).<br>
        Verifique a função Netlify e a variável GITHUB_TOKEN.
      </p>`;
    return;
  }

  const data = await response.json();
  const repos = data?.projects;
  if (!Array.isArray(repos)) {
    grid.innerHTML = '<p class="loading-projects">Resposta inválida da função.</p>';
    return;
  }

  const projects = repos.map(repo => {
    const languageList =
      (Array.isArray(repo.languageList) && repo.languageList.length)
        ? repo.languageList
        : Object.keys(repo.languages || {});

    const longDescription = repo.description || repo.github_description || '';
    const shortDescription = repo.short_description || repo.github_description || longDescription || '';
    const readmeTitle = repo.readmeTitle || repo.readme_title || repo.name;

    return {
      name: repo.name,
      repoUrl: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      defaultBranch: repo.default_branch,
      readmeTitle,
      short_description: shortDescription,
      description: longDescription,
      languages: repo.languages || {},
      languageList,
      previewUrl: repo.preview,
      pushedAt: repo.updated_at
    };
  });

  projects.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

  renderProjects(projects);

  const techs = projects.flatMap(p => p.languageList);
  const fm = filterManagerInstance || window.filterManager || window.ensureFilterManager?.() || null;
  if (fm?.setAvailableTechs) {
    fm.setAvailableTechs(techs);
  }
}

function waitForProjectsSection() {
  const section = document.getElementById('projectsGrid');
  if (section) {
    loadProjects();
    return;
  }

  const observer = new MutationObserver(() => {
    const found = document.getElementById('projectsGrid');
    if (found) {
      observer.disconnect();
      loadProjects();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForProjectsSection);
} else {
  waitForProjectsSection();
}

