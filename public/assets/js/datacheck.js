// Sanity check to make sure pages that require a character don't load if no character is set
if (!sessionStorage.getItem('CharId')) {
  sessionStorage.clear();
  location.href = '/';
}
