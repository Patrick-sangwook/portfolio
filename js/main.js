const githubUsername = "Patrick-sangwook";

const fetchProjects = async () => {
  const projectsContainer =
    document.querySelector("#projects-container");

  // 1. 로딩 상태
  projectsContainer.innerHTML =
    "<p>GitHub 프로젝트를 불러오는 중...</p>";

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos`
    );

    // GitHub API 요청 한도 초과
    if (response.status === 403) {
       throw new Error("RATE_LIMIT");
    }

    // 그 밖의 HTTP 오류
    if (!response.ok) {
       throw new Error("GitHub API 요청에 실패했습니다.");
    }

    const projects = await response.json();

    // 2. 빈 상태
    if (projects.length === 0) {
      projectsContainer.innerHTML =
        "<p>표시할 프로젝트가 없습니다.</p>";
      return;
    }

    // 3. 성공 상태
    projectsContainer.innerHTML = projects
    .map(({ name, description, language, html_url }) => {
      return `
        <article class="project-card">
           <h3>${name}</h3>

            <p>
              ${description || "프로젝트 설명이 없습니다."}
            </p>

            <p>
              사용 언어: ${language || "정보 없음"}
            </p>

            <a href="${html_url}"
              target="_blank">
               GitHub에서 보기
            </a>
        </article>
      `;
    })
      .join("");

  } catch (error) {

  const errorMessage =
    error.message === "RATE_LIMIT"
      ? "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
      : "프로젝트를 불러올 수 없습니다.";

  projectsContainer.innerHTML = `
    <div class="projects-error">
      <p>${errorMessage}</p>
      <button id="retry-button">다시 시도</button>
    </div>
  `;

  const retryButton =
    document.querySelector("#retry-button");

  retryButton.addEventListener("click", fetchProjects);

  console.error(error);
  }  
};

fetchProjects();

// =========================
// Dark Mode
// =========================

const themeToggle = document.querySelector("#theme-toggle");

// 브라우저에 저장된 테마 확인
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.textContent = "☀️";
} else {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.textContent = "🌙";
}

// 다크 모드 버튼 클릭
themeToggle.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");

    localStorage.setItem("theme", "light");

    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");

    localStorage.setItem("theme", "dark");

    themeToggle.textContent = "☀️";
  }
});

// =========================
// Mobile Menu
// =========================

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  const isOpen = navMenu.classList.contains("active");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

// 메뉴 링크를 클릭하면 모바일 메뉴 닫기
const navLinks = document.querySelectorAll("nav ul a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


// =========================
// Header Scroll Effect
// =========================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// =========================
// Scroll To Top
// =========================

const scrollTopButton = document.querySelector("#scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopButton.classList.add("show");
  } else {
    scrollTopButton.classList.remove("show");
  }
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// =========================
// Scroll Animation
// =========================

const sections = document.querySelectorAll("main section");

sections.forEach((section) => {
  section.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2
  }
);

sections.forEach((section) => {
  observer.observe(section);
});


// =========================
// Contact Form Validation
// =========================

const contactForm = document.querySelector("#contact-form");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");

const formSuccess = document.querySelector("#form-success");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let isValid = true;

  // 이름 검사
  if (nameInput.value.trim() === "") {
    nameError.textContent = "이름을 입력해주세요.";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  // 이메일 검사
  if (emailInput.value.trim() === "") {
    emailError.textContent = "이메일을 입력해주세요.";
    isValid = false;
  } else if (!emailInput.value.includes("@")) {
    emailError.textContent = "올바른 이메일 형식을 입력해주세요.";
    isValid = false;
  } else {
    emailError.textContent = "";
  }

  // 메시지 검사
  if (messageInput.value.trim() === "") {
    messageError.textContent = "메시지를 입력해주세요.";
    isValid = false;
  } else {
    messageError.textContent = "";
  }

  // 모든 입력이 정상일 때
  if (isValid) {
    formSuccess.textContent = "메시지가 정상적으로 작성되었습니다.";
  } else {
    formSuccess.textContent = "";
  }
});


// 사용자가 다시 입력하면 오류 메시지 제거
nameInput.addEventListener("input", () => {
  nameError.textContent = "";
  formSuccess.textContent = "";
});

emailInput.addEventListener("input", () => {
  emailError.textContent = "";
  formSuccess.textContent = "";
});

messageInput.addEventListener("input", () => {
  messageError.textContent = "";
  formSuccess.textContent = "";
});
