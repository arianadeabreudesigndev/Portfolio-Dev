const BREAKPOINT_DESKTOP = 1400;
let skillsUIInitialized = false;
let currentSkillsGroup = 'developer';

function getGroupLabel(group) {
  const key = group === 'design' ? 'skills-group-design' : 'skills-group-developer';
  if (window.languageManager) {
    const translation = window.languageManager.getTranslation(key);
    if (translation) return translation;
  }
  return group === 'design' ? 'Design' : 'Developer';
}

function getDefaultText() {
  if (window.languageManager) {
    const translation = window.languageManager.getTranslation('skills-default-text');
    return translation || "Passe o mouse ou clique em uma das habilidades para ver mais detalhes sobre minha jornada com essa tecnologia.";
  }
  return "Passe o mouse ou clique em uma das habilidades para ver mais detalhes sobre minha jornada com essa tecnologia.";
}

const skillTranslationKeys = {
  "Figma": "skill-desc-figma",
  "GitHub": "skill-desc-github", 
  "HTML": "skill-desc-html",
  "CSS": "skill-desc-css",
  "Java": "skill-desc-java",
  "SQL": "skill-desc-sql",
  "PHP": "skill-desc-php",
  "JavaScript": "skill-desc-javascript",
  "React": "skill-desc-react",
  "Python": "skill-desc-python",
  "Django": "skill-desc-django",
  "Typescript": "skill-desc-typescript",
  "Node": "skill-desc-node",
  "Illustrator": "skill-desc-illustrator"
};

const isDesktop = () => window.innerWidth >= BREAKPOINT_DESKTOP;

const getElements = () => ({
  skillText: document.getElementById('skillText'),
  skillIcons: document.querySelectorAll('.skillIcon'),
  skillPanel: document.getElementById('skillSidePanel'),
  panelName: document.getElementById('panelSkillName'),
  panelDescription: document.getElementById('panelSkillDescription'),
  skillsDropdownToggle: document.getElementById('skills-dropdown-toggle'),
  skillsDropdownMenu: document.getElementById('skills-dropdown-menu'),
  skillsDropdownLabel: document.getElementById('skills-dropdown-label'),
  skillsGroupDeveloper: document.getElementById('skills-scroll-developer'),
  skillsGroupDesign: document.getElementById('skills-scroll-design')
});

function initializeSkillsSection() {
  const { skillText, skillIcons } = getElements();
  if (!skillText) return;
  
  if (isDesktop()) {
    skillText.textContent = getDefaultText();
    skillText.classList.add('default-text');
    skillText.classList.remove('hidden');
  } else {
    skillText.textContent = "";
    skillText.classList.remove('default-text');
  }
  
  skillIcons.forEach(icon => icon.classList.remove('active'));
}

function resetToDefaultText() {
  if (!isDesktop()) return;
  
  const { skillText, skillIcons } = getElements();
  if (!skillText) return;
  skillText.textContent = getDefaultText();
  skillText.classList.add('default-text');
  skillText.classList.remove('hidden');
  skillIcons.forEach(icon => icon.classList.remove('active'));
}

function updateSkillText(skill) {
  if (!isDesktop()) return;
  
  const { skillText } = getElements();
  if (!skillText) return;
  const translationKey = skillTranslationKeys[skill];
  
  if (translationKey && window.languageManager) {
    const translation = window.languageManager.getTranslation(translationKey);
    skillText.textContent = translation || getDefaultText();
  } else {
    skillText.textContent = getDefaultText();
  }
  
  skillText.classList.remove('default-text');
  skillText.classList.remove('hidden');
}

function openSkillPanel(skill) {
  const { skillPanel, panelName, panelDescription } = getElements();
  if (!skillPanel || !panelName || !panelDescription) return;
  
  panelName.textContent = skill;
  
  const translationKey = skillTranslationKeys[skill];
  if (translationKey && window.languageManager) {
    const translation = window.languageManager.getTranslation(translationKey);
    panelDescription.textContent = translation || '';
  } else {
    panelDescription.textContent = '';
  }
  
  skillPanel.classList.add('active');
  
  setupSwipeToClose(skillPanel);
}

function closeSkillPanel() {
  const { skillPanel } = getElements();
  if (!skillPanel) return;
  skillPanel.classList.remove('active');
}

function setupSwipeToClose(panel) {
  let startX = 0;
  
  const handleTouchStart = (e) => startX = e.touches[0].clientX;
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) closeSkillPanel();
  };
  
  panel.addEventListener('touchstart', handleTouchStart, { passive: true });
  panel.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleSkillClick(skill, event) {
  event.stopPropagation();

  if (isDesktop()) {
    updateSkillText(skill);
    const { skillIcons } = getElements();
    skillIcons.forEach(icon => icon.classList.remove('active'));
    event.currentTarget.classList.add('active');
  } else {
    openSkillPanel(skill);
  }
}

function setSkillsGroup(group) {
  const {
    skillsGroupDeveloper,
    skillsGroupDesign,
    skillsDropdownMenu,
    skillsDropdownToggle,
    skillsDropdownLabel,
    skillIcons
  } = getElements();

  if (!skillsGroupDeveloper || !skillsGroupDesign) return;

  const groups = {
    developer: skillsGroupDeveloper,
    design: skillsGroupDesign
  };

  Object.entries(groups).forEach(([key, el]) => {
    if (!el) return;
    if (key === group) {
      el.classList.remove('hidden-group');
    } else {
      el.classList.add('hidden-group');
    }
  });

  if (skillsDropdownLabel) {
    skillsDropdownLabel.textContent = getGroupLabel(group);
  }

  if (skillsDropdownMenu) skillsDropdownMenu.classList.remove('show');
  if (skillsDropdownToggle) skillsDropdownToggle.classList.remove('open');

  skillIcons?.forEach(icon => icon.classList.remove('active'));
  resetToDefaultText();
  closeSkillPanel();

  currentSkillsGroup = group;

  updateDropdownOptionsVisibility(group);
}

function setupDropdown() {
  const {
    skillsDropdownToggle,
    skillsDropdownMenu
  } = getElements();

  if (skillsDropdownToggle) {
    skillsDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      skillsDropdownToggle.classList.toggle('open');
      skillsDropdownMenu?.classList.toggle('show');
    });
  }

  if (skillsDropdownMenu) {
    skillsDropdownMenu.addEventListener('click', (e) => {
      const option = e.target.closest('a[data-group]');
      if (!option) return;
      e.preventDefault();
      const group = option.getAttribute('data-group');
      if (group) setSkillsGroup(group);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.skillsDropdownContainer')) return;
    skillsDropdownMenu?.classList.remove('show');
    skillsDropdownToggle?.classList.remove('open');
  });
}

function updateDropdownOptionsVisibility(selectedGroup) {
  const { skillsDropdownMenu } = getElements();
  if (!skillsDropdownMenu) return;

  const options = skillsDropdownMenu.querySelectorAll('a[data-group]');
  options.forEach((opt) => {
    const group = opt.getAttribute('data-group');
    if (!group) return;
    opt.parentElement.style.display = group === selectedGroup ? 'none' : 'block';
    opt.textContent = getGroupLabel(group);
  });
}

function setupEventListeners() {
  const { skillText } = getElements();
  if (!skillText) return;

  document.addEventListener('click', (event) => {
    if (isDesktop() && !event.target.closest('.skillIcon') && !event.target.closest('#skillText')) {
      resetToDefaultText();
    }
  });
  
  window.addEventListener('resize', initializeSkillsSection);
  
  const closeBtn = document.querySelector('.close-panel');
  if (closeBtn) closeBtn.addEventListener('click', closeSkillPanel);
}

function tryInitSkillsUI() {
  if (skillsUIInitialized) return true;
  const {
    skillText,
    skillsDropdownToggle,
    skillsGroupDeveloper,
    skillsGroupDesign
  } = getElements();

  if (!skillText || !skillsDropdownToggle || !skillsGroupDeveloper || !skillsGroupDesign) {
    return false;
  }

  initializeSkillsSection();
  setupEventListeners();
  setupDropdown();
  setSkillsGroup('developer');
  updateDropdownOptionsVisibility(currentSkillsGroup);

  if (window.languageManager) {
    window.addEventListener('languageChanged', () => {
      resetToDefaultText();
      updateDropdownOptionsVisibility(currentSkillsGroup);
      const { skillsDropdownLabel } = getElements();
      if (skillsDropdownLabel) {
        skillsDropdownLabel.textContent = getGroupLabel(currentSkillsGroup);
      }
    });
  }

  skillsUIInitialized = true;
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (tryInitSkillsUI()) return;

  const observer = new MutationObserver(() => {
    if (tryInitSkillsUI()) observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => observer.disconnect(), 6000);
});

window.addEventListener('load', initializeSkillsSection);