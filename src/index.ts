import './styles/main.scss';

import { createApp } from '@muban/muban';
import { App } from './App';

const app = createApp(App);
const element = document.getElementById('app');
if (element) {
  app.mount(element);
}
