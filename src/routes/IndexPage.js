import React from 'react';
import { Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'dva';
import styles from './IndexPage.css';
import OfficeSupplyPage from '../components/office_supply/OfficeSupplyPage';
import EquipManagementPage from '../components/equip_management/EquipManagementPage';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;
const BreadcrumbItem = Breadcrumb.Item;

function IndexPage({ children, history }) {
  function onItemClick({ item, key, keyPath }) {
    history.push(key);
  }

  return (
    <div className={styles.layoutAside}>
      <aside className={styles.layoutSider}>
        <div className={styles.layoutLogo}>S.E.T</div>
        <Menu mode="inline" theme="dark" defaultOpenKeys={['demoMenu']} onClick={onItemClick}>
          <SubMenu key="demoMenu" title={<span><Icon type="book" />场景样例</span>}>
            <MenuItemGroup key="singleTableScene"
                           title={<span><Icon type="appstore" /> 单表场景</span>}>
              <MenuItem key="rowEdit_toolBarEdit">行编辑与工具栏编辑</MenuItem>
              <MenuItem key="inlineEdit">行内编辑</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup key="masterSlaveTableScene" title={<span><Icon type="appstore" /> 主从表场景</span>}>
              <MenuItem key="selectToTrigger">勾选筛选从表</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup key="treeTableScene" title={<span><Icon type="appstore" /> 树表场景</span>}>
              <MenuItem key="triggerTableQuery">触发表格刷新</MenuItem>
            </MenuItemGroup>
          </SubMenu>
        </Menu>
      </aside>
      <div className={styles.layoutMain}>
        <div className={styles.layoutHeader}></div>
        <div className={styles.layoutContainer}>
          <Breadcrumb>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>App list</BreadcrumbItem>
            <BreadcrumbItem>Any App</BreadcrumbItem>
          </Breadcrumb>
          <div className={styles.layoutContent}>
            <div style={{ height: "100%",  minHeight: "590px"}}>
              {children}
            </div>
          </div>
        </div>
        <div className={styles.layoutFooter}>
          SET all rights reserved © 2017 Created by SET Sec
        </div>
      </div>
    </div>
  );
}

IndexPage.propTypes = {};

IndexPage.OfficeSupplyPage = OfficeSupplyPage;
IndexPage.EquipManagementPage = EquipManagementPage;
export default connect()(IndexPage);
