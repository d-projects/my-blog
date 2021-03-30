/**
 * Functionality to turn the page theme dark or light
 */

const displayMode = (mode) => {
    removeClasses();
    if (mode == 'dark') {
      document.body.classList.add("dark-mode");
      const hr = document.querySelector('hr');
      if (hr) hr.classList.add("hr-dark-mode");
    } else {
      document.querySelector('nav').classList.add("navbar-light");
      document.querySelector('nav').classList.add("bg-light");
      const blogLinks = document.querySelectorAll('.blog-link a');
      if (blogLinks) blogLinks.forEach(b => { b.classList.add("text-dark") });
    }
  }

  document.getElementById("toggle-dark").addEventListener("click", () => {
    let mode = localStorage.getItem('mode');
    if (mode == 'light') mode = 'dark';
    else mode = 'light';
    localStorage.setItem('mode', mode);
    displayMode(mode);
  });

  const removeClasses = () => {
    document.body.classList.remove("dark-mode");
    document.querySelector('nav').classList.remove("navbar-light");
    document.querySelector('nav').classList.remove("bg-light");
    const blogLinks = document.querySelectorAll('.blog-link a');
    if (blogLinks) blogLinks.forEach(b => { b.classList.remove("text-dark") });
    const hr = document.querySelector('hr');
    if (hr) hr.classList.remove("hr-dark-mode");
  }

  // display the chosen mode if the page is not the admin control page (dark mode is disabled on that page)
  const urlParts = window.location.href.split('/');
  if (!(urlParts.length >= 3 && urlParts[1] == 'admin' && urlParts[2] == 'login')) displayMode(localStorage.getItem('mode'));