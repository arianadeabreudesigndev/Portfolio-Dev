const BREAKPOINT_DESKTOP = 1200;

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
  panelDescription: document.getElementById('panelSkillDescription')
});

function initializeSkillsSection() {
  const { skillText, skillIcons } = getElements();
  
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
  skillText.textContent = getDefaultText();
  skillText.classList.add('default-text');
  skillText.classList.remove('hidden');
  skillIcons.forEach(icon => icon.classList.remove('active'));
}

function updateSkillText(skill) {
  if (!isDesktop()) return;
  
  const { skillText } = getElements();
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

function setupEventListeners() {
  document.addEventListener('click', (event) => {
    if (isDesktop() && !event.target.closest('.skillIcon') && !event.target.closest('#skillText')) {
      resetToDefaultText();
    }
  });
  
  window.addEventListener('resize', initializeSkillsSection);
  
  const closeBtn = document.querySelector('.close-panel');
  if (closeBtn) closeBtn.addEventListener('click', closeSkillPanel);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSkillsSection();
  setupEventListeners();
  
  if (window.languageManager) {
    window.addEventListener('languageChanged', () => {
      resetToDefaultText();
    });
  }
});

window.addEventListener('load', initializeSkillsSection);