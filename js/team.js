import { loadJSON } from "./utils.js";

const teamGrid = document.querySelector("[data-team-grid]");

const renderTeam = (teamMembers = []) => {
  if (!teamGrid) return;
  teamGrid.innerHTML = teamMembers
    .map(
      (member) => `
        <article class="vehicle-card">
          <img src="${member.photo || './assets/vehicles/placeholder-1.svg'}" alt="Portrait of ${member.name}" loading="lazy" />
          <div class="content">
            <h3>${member.name}</h3>
            <p>${member.title}</p>
            <p>${member.bio}</p>
            <p><strong>Experience:</strong> ${member.experience}</p>
            <p><strong>Languages:</strong> ${member.languages}</p>
          </div>
        </article>`
    )
    .join("");
};

const init = async () => {
  try {
    const data = await loadJSON("./data/team.json");
    renderTeam(data.team);
  } catch (error) {
    console.error(error);
  }
};

init();
