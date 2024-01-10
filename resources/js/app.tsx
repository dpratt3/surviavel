import { createRoot } from 'react-dom/client';
import HelloWorld from './Components/HelloWorld';

const appElement = document.getElementById('app');

if (appElement) {
  createRoot(appElement).render(
    <HelloWorld />
  );
} else {
  console.error("Element with ID 'app' not found in the DOM.");
}
