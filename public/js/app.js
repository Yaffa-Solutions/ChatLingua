
import { createLoginPage }   from './login.js';  
import { createSignUpPage }  from './signup.js';  
import { createProfilePage } from './Profile.js';
import {createHomePage} from './home.js';

window.app = document.getElementById('app');

function render(view) {
  switch ((view || '').toLowerCase()) {
    case 'signup':
      return createSignUpPage();
    case 'profile':
      return createProfilePage();
    case 'home':
      return createHomePage()
    case 'login':
    default:
      return createLoginPage();
  }
}


function handleRoute() {
  let route = (location.hash.replace(/^#\//, '') || 'login');
  const hasToken = document.cookie.includes("token=");
  if(hasToken){
    route='home'
  }
  render(route);
}

window.createLoginPage   = createLoginPage;
window.createSignUpPage  = createSignUpPage;
window.createProfilePage = createProfilePage;

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
