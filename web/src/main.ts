import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';

import bootstrap from './core/bootstrap';
import '/@/styles/reset.less';
import '/@/styles/index.less';
import Antd from 'ant-design-vue';
import '/@/utils/rem.js';
import './mock/index.js';
const app = createApp(App);

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

app.use(Antd);
app.use(router);
app.use(piniaStore);
app.use(bootstrap);
app.use(ElementPlus);
app.mount('#app');
