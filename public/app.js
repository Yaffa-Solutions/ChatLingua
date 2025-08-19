
import { createLoginPage }   from './login.js';  
import { createSignUpPage }  from './signup.js';  
import { createProfilePage } from './Profile.js';

window.app = document.getElementById('app');

function render(view) {
  switch ((view || '').toLowerCase()) {
    case 'signup':
      return createSignUpPage();
    case 'profile':
      return createProfilePage();
    case 'login':
    default:
      return createLoginPage();
  }
}
console.log("kkk")

export function navigate(to = 'login') {
  location.hash = `#/${to}`;
  render(to);
}

function handleRoute() {
  const route = (location.hash.replace(/^#\//, '') || 'login');
  render(route);
}

window.navigate          = navigate;
window.createLoginPage   = createLoginPage;
window.createSignUpPage  = createSignUpPage;
window.createProfilePage = createProfilePage;

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
