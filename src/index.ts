import './styles/main.scss';

import { createApp } from '@muban/muban';
import { App } from './App';

const app = createApp(App);
app.mount(document.getElementById('app'));
