import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import commonModel from './models/commonModel';
import officeSupplyModel from './models/officeSupplyModel';
import equipManagementModel from './models/equipManagementModel';

// 包装model注册方法，避免重复注册
const cached = {};
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model); // 注册model
    cached[model.namespace] = 1;
  }
}

function RouterConfig({ history, app }) {
  registerModel(app, officeSupplyModel);
  registerModel(app, equipManagementModel);
  registerModel(app, commonModel);
  return (
      <Router history={history}>
        <Route path="/" component={IndexPage}>
          <Route path="/rowEdit_toolBarEdit" component={IndexPage.OfficeSupplyPage} />
          <Route path="/triggerTableQuery" component={IndexPage.EquipManagementPage} />
        </Route>
      </Router>
  );
}

export default RouterConfig;
