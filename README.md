# Portfólio Profissional - Ariana de Abreu

Este repositório contém o código-fonte do meu **portfólio profissional**, desenvolvido com o objetivo de apresentar minha trajetória, habilidades técnicas e projetos de forma clara, organizada e acessível para recrutadores e profissionais das áreas de tecnologia e design.

Todo o conceito visual, arquitetura do site e estrutura de navegação foram idealizados e desenhados por mim no **Figma**, passando por diversas iterações ao longo do desenvolvimento. O projeto evoluiu tanto em identidade visual quanto em decisões técnicas, sempre com foco em **experiência do usuário, performance e legibilidade**.

O site foi **intencionalmente desenvolvido utilizando HTML, CSS e JavaScript puro**, priorizando controle total da estrutura, otimização de carregamento e domínio de cada camada da aplicação.

---

## 🔗 Link do Projeto

[https://portfolioariandeabreudesigndev.netlify.app/](https://portfolioariandeabreudesigndev.netlify.app/)

---

## 📁 Estrutura do Site

O portfólio é composto pelas seguintes seções principais:

- **Home**
- **About Me**
- **Projects**
- **Skills (Expertise)**
- **Contact**
- **Recommendations**
- **Footer**

Além das seções, o site conta com **dois sistemas de navegação complementares**:

- **Navbar superior**, presente em todos os dispositivos  
- **Sidebar lateral**, exibida em telas grandes, permitindo navegação rápida por âncoras entre todas as seções

Em dispositivos móveis e tablets, a navegação se adapta automaticamente para um **menu hambúrguer**, mantendo todas as funcionalidades acessíveis.

---

## 🌐 Internacionalização, Temas e Responsividade

- Suporte completo a **Português e Inglês**, com troca dinâmica de idioma  
- Todo o conteúdo textual e downloads se adaptam ao idioma selecionado  
- Alternância entre **tema claro e tema escuro**, disponível em todos os dispositivos  
- Layout **totalmente responsivo**, com versões específicas para:
  - Desktop (≥1400px)
  - Tablet (768px a 1399px)
  - Mobile (≤767px)

Cada breakpoint foi tratado individualmente para garantir conforto visual, boa hierarquia da informação e navegação fluida.

---

## 🏠 Seção Home

A Home apresenta uma visão direta do perfil, contendo:

- Foto de apresentação  
- Ícones de tecnologias  
- Botão para **download do currículo** (o arquivo é baixado dinamicamente de acordo com o idioma selecionado)

Há também uma **âncora de acesso rápido** que leva diretamente à seção de projetos, permitindo que o visitante chegue rapidamente ao conteúdo técnico.

---

## 👤 About Me

A seção **About Me** é estruturada em artigos independentes, especialmente pensados para diferentes tamanhos de tela.

Ela inclui:

- Apresentação pessoal e trajetória profissional  
- Certificações e cursos (em constante atualização)  
- Experiências profissionais  
- Hobbies e interesses pessoais  
- Apresentação de um **blog em desenvolvimento**, que aborda minha trajetória com hipotireoidismo de Hashimoto e mudanças de estilo de vida

Cada artigo possui imagens próprias e layout adaptado conforme o dispositivo. Além disso, foram adicionados **hyperlinks** nos textos para referências externas (como certificações e o blog), com destaque visual e sem sublinhado.

---

## 💻 Projects

A seção de projetos é **totalmente dinâmica**, integrada à **API do GitHub**.

### Como funciona:
- É realizada uma requisição única à API  
- Os projetos são carregados diretamente do GitHub  
- Apenas repositórios marcados com a **tag `portfolio`** são exibidos  

### Cada projeto apresenta:
- Nome  
- Tecnologias utilizadas (agora personalizadas via campo `technologies:` no README)  
- Descrição curta  
- Descrição longa, personalizada  

### Funcionalidades:
- **Filtro por tecnologia** (baseado nas tecnologias informadas no README)  
- Opção de **aplicar ou limpar filtros**  
- Navegação por setas e rolagem interna  
- Limitador visual de linhas para evitar excesso de conteúdo na tela  
- **Imagem de fallback** para projetos sem preview (exibe uma imagem personalizada indicando "em construção")  
- **Botão "Live Demo" oculto** quando o projeto não possui link de demonstração  

### Funcionalidades futuras planejadas:
- Filtro por status do projeto (finalizado ou em andamento)  
- Filtro por data  

---

## 🛠️ Skills (Expertise)

A seção **Skills** apresenta minha experiência técnica de forma interativa.

O usuário pode alternar entre dois conjuntos de habilidades:

- **Desenvolvedora**
- **Design**

Cada skill é representada por um **ícone clicável**, que exibe:

- Tempo de experiência  
- Forma de aprendizado  
- Aplicações práticas  
- Cursos e leituras  
- Contexto de uso em projetos  

Essa separação permite uma leitura clara e direcionada para diferentes perfis de recrutadores.

---

## 📬 Contact

A seção de contato reúne:

- Foto  
- E-mail profissional  
- Telefone  
- Links diretos para:
  - [LinkedIn](https://www.linkedin.com/in/arianadeabreudev)
  - [WhatsApp](https://tinyurl.com/AriWhatssap)
  - [Instagram](https://www.instagram.com/arianadeabreudesigner)
  - [YouTube](https://www.youtube.com/@ArianaDeAbreuDev)

Além disso, há um **formulário funcional** (integrado com EmailJS) onde o visitante pode enviar:

- Nome  
- E-mail  
- Assunto  
- Mensagem  

As mensagens são encaminhadas diretamente para meu e-mail profissional.

---

## 🌟 Recommendations

A seção de recomendações reúne feedbacks profissionais de pessoas com quem já trabalhei.

Atualmente inclui:

- **Rosana Gildo Vieira**, Diretora de Estatística e Gestão do Sistema Educacional de Saquarema  
  - Recomendação apresentada em papel timbrado oficial da Secretaria de Educação, com assinatura formal  

- **Flávio Macedo**, ex-Assessor de Políticas Públicas da Educação de Saquarema  

Essa seção reforça minha atuação profissional e a percepção externa sobre meu trabalho.

---

## 🦶 Footer

O footer contém:

- Navegação rápida para o topo  
- Links para redes sociais  
- Informação de copyright  

O ano exibido no copyright é **gerado dinamicamente via JavaScript**, sendo atualizado automaticamente a cada novo ano.

---

## ⚡ Performance e Decisões Técnicas

Performance foi um dos pilares do projeto.

### Principais decisões:
- Todas as imagens do site são **SVG** (exceto fotos de perfil e recomendações, que são otimizadas)  
- Arquivos extremamente leves, mantendo boa qualidade visual  
- Carregamento rápido, sem atrasos perceptíveis  
- Organização do código por **seções independentes**, facilitando manutenção, leitura e evolução futura  

### Tecnologias utilizadas:
- HTML5 semântico  
- CSS3 (Flexbox, Grid, Variáveis CSS, Animações)  
- JavaScript (ES6+)  
- Netlify Functions (para integração com a API do GitHub)  
- EmailJS (para o formulário de contato)  

---

## 🚀 Evolução Futura

Este projeto está em constante evolução. Algumas ideias para o futuro incluem:

- Refinamento tipográfico  
- Melhoria do modo claro  
- Recursos de acessibilidade, como ajuste de tamanho de fonte  
- Destaques textuais e hyperlinks adicionais  
- Novas seções (ex: linha do tempo profissional)  
- Maior dinamicidade de conteúdo  
- Possível integração com redes sociais ou sistema de comentários  

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📬 Contato

Sugestões, críticas construtivas e feedbacks, especialmente de profissionais de TI, são **muito bem-vindos**. Toda troca de conhecimento é valorizada e contribui diretamente para minha evolução profissional.

- **E-mail:** arianadeabreudesigndev@gmail.com  
- **LinkedIn:** [linkedin.com/in/arianadeabreudev](https://www.linkedin.com/in/arianadeabreudev)  
- **Portfólio online:** [https://portfolioariandeabreudesigndev.netlify.app/](https://portfolioariandeabreudesigndev.netlify.app/)