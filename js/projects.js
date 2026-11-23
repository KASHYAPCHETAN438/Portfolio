document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-project-grid]");
  const filterBar = document.querySelector("[data-project-filters]");
  if (!container) return;

  const jsonPath = container.dataset.projectsUrl || "data/projects.json";
  const fallbackProjects = [
    {
      title: "House Price Prediction",
      category: "machine-learning",
      description: "A machine learning-based web application that predicts house prices using property-related features.",
      technologies: ["Python", "FastAPI", "Machine Learning", "HTML", "CSS"],
      liveUrl: "https://house-prediction-model-sfe6.onrender.com/",
      githubUrl: "https://github.com/KASHYAPCHETAN438/House-Prediction-Model-",
      image: "assets/images/projects/house-price.png"
    },
    {
      title: "Water Pollution Prediction System",
      category: "machine-learning",
      description: "A machine learning-based system designed to analyze water quality parameters and predict water pollution levels.",
      technologies: ["Python", "Flask", "React", "MySQL", "Machine Learning"],
      liveUrl: "https://water-pollution-prediction.onrender.com",
      githubUrl: "https://github.com/KASHYAPCHETAN438/Water-Pollution-Prediction",
      image: "assets/images/projects/Water_Polloution.png"
    },
    {
      title: "Corporate Financial Performance Dashboard",
      category: "data",
      description: "An interactive dashboard developed to analyze business sales, profitability and financial performance.",
      technologies: ["Python", "Pandas", "SQL", "Power BI", "Streamlit", "Excel"],
      liveUrl: "https://datascienceworkspace-nsazmoh5appka4wzaji6gr6.streamlit.app/",
      githubUrl: "https://github.com/KASHYAPCHETAN438/DataScienceWorkspace",
      image: "assets/images/projects/financial-dashboard.png"
    }
  ];

  const renderProjects = (projects) => {
    container.innerHTML = projects.map((project) => `
      <article class="card project-card" data-category="${project.category}" data-project="${project.title.includes("House Price") ? "house-price" : project.title.includes("Water") ? "water-pollution" : "financial-dashboard"}">
        <img class="project-image" src="${location.pathname.includes("/pages/") ? "../" + project.image : project.image}" alt="${project.title} screenshot" loading="lazy">
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tech-row">${project.technologies.map((item) => `<span class="tech-badge">${item}</span>`).join("")}</div>
          <div class="project-actions">
            ${project.liveUrl ? `<a class="button button-primary" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">View live <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : ""}
            ${project.githubUrl ? `<a class="button button-secondary" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> GitHub</a>` : ""}
          </div>
        </div>
      </article>`).join("");

    container.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.removeAttribute("src");
        image.classList.add("image-fallback");
        image.setAttribute("alt", "Project screenshot unavailable");
      });
    });
  };

  fetch(jsonPath)
    .then((response) => {
      if (!response.ok) throw new Error("Unable to load projects");
      return response.json();
    })
    .then(renderProjects)
    .catch(() => renderProjects(fallbackProjects));

  filterBar?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filterBar.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    container.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});