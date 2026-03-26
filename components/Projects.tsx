
export default function Projects() {
  const projects = [
    {
      title: "Application React/Node.js",
      description: "API REST + interface utilisateur moderne.",
      github: "https://github.com/CL-KRMA/Galerie-en-ligne-fullstack",
      demo: "https://ton-projet-demo.com"
    },
    {
      title: "Site WordPress optimisé",
      description: "Performance et SEO améliorés.",
      github: "https://github.com/ton-site-wordpress",
      demo: "https://ton-site.com"
    },
    {
      title: "Déploiement serveur Linux",
      description: "Configuration Nginx + SSL/TLS.",
      github: "https://github.com/ton-projet-linux",
      demo: null
    }
  ];

  return (
    <div className="projects">
      <h2>Mes projets</h2>
      <div className="project-list">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  🔗 Voir le code
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  🌐 Voir la démo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
