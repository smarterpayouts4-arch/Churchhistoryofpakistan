
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

// If a downloaded cathedral asset is missing, fall back to the local archival placeholder.
// This keeps the prototype truthful instead of silently pulling copyrighted internet imagery.
document.querySelectorAll('.place-media img[data-fallback]').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback && img.src !== img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
  }, {once:true});
});
