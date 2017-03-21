import dva from 'dva';
import { hashHistory } from 'dva/router';
import createLoading from 'dva-loading';
import { message } from 'antd';
import './index.less';

// 1. Initialize
const app = dva({
  history: hashHistory,
  onError(e) {
    message.error(`未定义的错误：${e.message}`, 3);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
