/**
 * Created by Sec on 2017/3/22.
 */
import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Tree, Icon, Button, Popconfirm, Tooltip, message} from 'antd';
import {initTreeRootNode, appendTreeNodeData} from '../../utils/common';
import CustomCard from '../common/CustomCard';

const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;

class OrgTreePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedNodeData: {},
      expandedKeys: [props.defaultRootKey],
      selectedKeys: [],
      selectedPos: '0-0',
      checkedKeys: [],
      checkedNodes: [],
      modalVisible: false
    };
  }

  componentWillMount() {
    const {dispatch, defaultRootKey} = this.props;
    // 指定根节点时，获取其自身及其子节点
    if (defaultRootKey !== '-1') {
      dispatch({
        type: 'org/getOrgListByRootId',
        payload: defaultRootKey
      });
      return;
    }
    // 默认根节点为-1时，获取其子节点
    dispatch({
      type: 'org/getOrgListByParent',
      payload: {parentKey: defaultRootKey, parentPos: "0-0"}
    });
  }

  componentWillReceiveProps(nextProps) {
    const {loadData, parentPos, defaultRootKey} = nextProps;
    const {loadData: oldLoadData, parentPos: oldParentPos} = this.props;
    if (oldLoadData === loadData && oldParentPos === parentPos) {
      return;
    }
    this.setState(prevState => {
      let curTreeData = [...prevState.treeData];
      // 初始化根节点
      if (curTreeData.length === 0 || defaultRootKey !== curTreeData[0].id) {
        return initTreeRootNode(prevState, defaultRootKey, '组织单元树', loadData, this.onTreeSelect);
      }
      // 添加异步节点到相应位置
      if (!parentPos) {
        return prevState;
      }
      let position = parentPos.split("-").slice(1);
      appendTreeNodeData(curTreeData, loadData, position);
      return {
        treeData: curTreeData
      };
    });
  }

  /**
   * 树节点选择事件
   * @param selectedKeys 选中节点
   * @param selectedPos 选中位置
   * @param treeNodeData 选中节点携带数据
   */
  onTreeSelect = (selectedKeys, selectedPos, treeNodeData) => {
    // 保存选中节点和位置
    this.setState({
      selectedKeys,
      selectedPos,
      selectedNodeData: treeNodeData
    });
    // 执行回调
    this.props.onOrgSelect(selectedKeys, selectedPos, treeNodeData);
  };

  /**
   * 树节点展开事件
   * @param expandedKeys 展开节点
   */
  onTreeExpand = (expandedKeys) => {
    this.setState({
      expandedKeys: expandedKeys
    });
  };

  /**
   * 异步加载数据
   * @param treeNode 父节点
   * @returns {Promise.<T>}
   */
  onTreeLoadData = (treeNode) => {
    const {children, eventKey, pos} = treeNode.props;
    // 不重新请求
    if (!children) {
      // 执行回调
      this.props.dispatch({
        type: 'org/getOrgListByParent',
        payload: {
          parentKey: eventKey, parentPos: pos
        }
      });
    }
    return Promise.resolve();
  };

  /**
   * 树节点勾选事件
   * @param checkedKeys
   * @param e
   */
  onTreeNodeChecked = (checkedKeys, e) => {
    this.setState({
      checkedKeys: checkedKeys,
      checkedNodes: e.checkedNodes
    });
    message.info(`你勾选了${checkedKeys.toString()}节点！`);
  };

  /**
   * 新增树节点
   */
  onCreateNode = () => {

  };

  /**
   * 保存树节点
   * @param item 节点数据
   * @param callback 回调函数
   */
  onSaveNode = (item, callback) => {

  };

  /**
   * 编辑选中的树节点
   */
  onEditSelection = () => {

  };

  /**
   * 删除选中的树节点
   */
  onDeleteSelections = () => {

  };

  /**
   * 隐藏明细模态窗口
   * @param callback 回调函数
   */
  hideModal = (callback) => {
    this.setState({
      modalVisible: false
    });
    if (typeof callback === "function") {
      callback();
    }
  };

  /**
   * 根据数据生成树节点组件
   * @param data
   */
  nodeGenerator = (data) => {
    return data.map((item) => {
      let iconName = "book";
      if (item.orgType === '1') {// 部门
        iconName = "appstore";
      }
      if (item.children) {
        return <TreeNode title={<span><Icon type={iconName}/>{item.orgName}</span>}
                         key={item.id} nodeData={Object.assign({}, item, {children: undefined})}
                         disabled={item.id === "-1"}>
          {this.nodeGenerator(item.children)}
        </TreeNode>;
      }
      return <TreeNode title={<span><Icon type={iconName}/>{item.orgName}</span>} key={item.id}
                       isLeaf={item.isLeaf} nodeData={Object.assign({}, item, {children: undefined})}/>;
    });
  };

  render() {
    const {editable, minBodyHeight} = this.props;
    const {treeData, selectedKeys, expandedKeys, selectedNodeData} = this.state;

    return (
      <CustomCard title="组织单元" minBodyHeight={minBodyHeight} extra={ !editable ? '' :
        <ButtonGroup>
          <Tooltip title="新增子节点">
            <Button size="small" icon="plus" onClick={this.onCreateNode}/>
          </Tooltip>
          <Tooltip title="编辑节点">
            <Button size="small" icon="edit" onClick={this.onEditSelection}/>
          </Tooltip>
          <Popconfirm title={`确认要删除节点“${selectedNodeData.orgName}”吗？`} onConfirm={this.onDeleteSelections}
                      okText="确定" cancelText="取消">
            <Tooltip title="删除节点">
              <Button size="small" icon="delete"/>
            </Tooltip>
          </Popconfirm>
        </ButtonGroup>
      }>
        <Tree
          onSelect={(selectedKeys, e) => this.onTreeSelect(selectedKeys, e.node.props.pos, e.node.props.nodeData)}
          loadData={this.onTreeLoadData} checkable={editable} onExpand={this.onTreeExpand}
          defaultSelectedKeys={selectedKeys} selectedKeys={selectedKeys}
          onCheck={this.onTreeNodeChecked} defaultExpandedKeys={expandedKeys}>
          {this.nodeGenerator(treeData)}
        </Tree>
      </CustomCard>
    );
  }
}


OrgTreePanel.propTypes = {
  defaultRootKey: PropTypes.string,
  minBodyHeight: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  onOrgSelect: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ...state.org
});

export default connect(mapStateToProps)(OrgTreePanel);
