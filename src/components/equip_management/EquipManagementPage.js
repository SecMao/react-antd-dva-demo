/**
 * Created by Sec on 2017/3/16.
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tree, Table, Icon, Button, Popconfirm, Tooltip, message } from 'antd';
import EquipmentTypePanel from './EquipmentTypePanel';
import EquipmentTypeModal from './EquipmentTypeModal';
import { appendTreeNodeData, findTreeNodeInPos } from '../../utils/common';

const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;

class EquipManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [{ typeCode: '-1', typeName: '设备类型树' }],
      expandedKeys: ['-1'],
      selectedKeys: ['-1'],
      selectedPos: null,
      checkedKeys: [],
      checkedNodes: [],
      typeModalVisible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { loadData, parentPos } = nextProps;
    const { loadData: oldLoadData, parentPos: oldParentPos } = this.props;
    if (!parentPos || (oldLoadData === loadData && oldParentPos === parentPos)) {
      return;
    }
    // 计算节点位置并添加到相应位置
    let position = parentPos.split("-").slice(1);
    let curTreeData = [...this.state.treeData];
    appendTreeNodeData(curTreeData, loadData, position);
    this.setState({
      treeData: curTreeData
    });
    // 手动触发选择事件
    this.onTreeSelect(this.state.selectedKeys, parentPos);
  }

  /**
   * 树节点选择事件
   * @param selectedKeys 选中节点
   * @param selectedPos 选中位置
   */
  onTreeSelect = (selectedKeys, selectedPos) => {
    // 保存选中节点和位置
    this.setState({
      selectedKeys,
      selectedPos
    });
    // 刷新明细面板
    this.props.dispatch({
      type: 'equipManagement/getEquipInfoList',
      payload: selectedKeys[0]
    });
    // 刷新设备列表
    this.props.dispatch({
      type: 'equipManagement/getEquipTypeInfo',
      payload: { typeCode: selectedKeys[0] }
    });
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
    const { children, eventKey, pos } = treeNode.props;
    // 不重新请求
    if (!children) {
      this.props.dispatch({
        type: 'equipManagement/getTypeTreeNodes',
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
    if (!this.state.selectedKeys) {
      message.warn("请选择父节点进行新增操作！");
      return;
    }
    this.props.dispatch({
      type: 'equipManagement/getEquipTypeInfo',
      payload: {
        typeCode: null,
        parentTypeCode: this.state.selectedKeys[0],
        success: () => this.setState({ typeModalVisible: true })
      }
    });
  };

  /**
   * 保存树节点
   * @param item 节点数据
   */
  onSaveNode = (item, callback) => {
    const { treeData, selectedPos, selectedKeys } = this.state;
    let parentTypeCode = selectedKeys[0];
    let parentPos = selectedPos;
    if (item.id) {
      parentPos = selectedPos.substring(0, selectedPos.length - 2);
      parentTypeCode = findTreeNodeInPos(treeData, parentPos.split("-").slice(1)).typeCode;
    }
    this.props.dispatch({
      type: 'equipManagement/saveEquipTypeInfo',
      payload: {
        item,
        parentTypeCode,
        parentPos,
        success: () => {
          this.actionSuccess("保存记录成功", callback);
          this.setState({ selectedKeys: [parentTypeCode], selectedPos: parentPos })
        },
        failure: (msg) => message.error(`保存记录失败，请参考：${msg}`)
      }
    });
  };

  /**
   * 成功操作
   * @param msg
   */
  actionSuccess = (msg, callback) => {
    message.success(msg);
    this.hideModal(callback);
  };

  onEditSelection = () => {
    const { selectedKeys } = this.state;
    if (!selectedKeys) {
      message.warn("请选择节点进行新增操作！");
      return;
    }
    this.props.dispatch({
      type: 'equipManagement/getEquipTypeInfo',
      payload: {
        typeCode: selectedKeys[0],
        parentTypeCode: null,
        success: () => this.setState({ typeModalVisible: true })
      }
    });
  };

  /**
   * 删除选中的树节点
   */
  onDeleteSelections = () => {
    const { treeData, selectedPos, selectedKeys } = this.state;
    if (!selectedKeys) {
      message.warn("请选择节点进行新增操作！");
      return;
    }
    let parentPos = selectedPos.substring(0, selectedPos.length - 2);
    let parentNode = findTreeNodeInPos(treeData, parentPos.split("-").slice(1));
    this.props.dispatch({
      type: 'equipManagement/removeTypeTreeNodes',
      payload: {
        typeCode: selectedKeys[0],
        parentTypeCode: parentNode.typeCode,
        parentPos,
        success: () => {
          message.success("删除记录成功");
          this.setState({ selectedKeys: [parentNode.typeCode], selectedPos: parentPos })
        },
        failure: (msg) => message.error(`删除记录失败，请参考：${msg}`)
      }
    });
  };

  /**
   * 隐藏明细模态窗口
   */
  hideModal = (callback) => {
    this.setState({
      typeModalVisible: false
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
      if (item.typeCode && item.typeCode.startsWith("01")) {
        iconName = "appstore";
      }
      if (item.children) {
        return <TreeNode title={<span><Icon type={iconName} />{item.typeName}</span>}
                         key={item.typeCode}>{this.nodeGenerator(item.children)}</TreeNode>;
      }
      return <TreeNode title={<span><Icon type={iconName} />{item.typeName}</span>} key={item.typeCode}
                       isLeaf={item.isLeaf} disabled={item.key === '0-0-0'} />;
    });
  };

  render() {
    const columns = [{
      title: '主键',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '设备编码',
      dataIndex: 'equipCode',
      key: 'equipCode',
    }, {
      title: '设备类型',
      dataIndex: 'equipType',
      key: 'equipType',
    }, {
      title: '设备类型名称',
      dataIndex: 'equipTypeName',
      key: 'equipTypeName',
    }, {
      title: '设备型号',
      dataIndex: 'equipModel',
      key: 'equipModel',
    }, {
      title: '生产厂家',
      dataIndex: 'equipManufacturer',
      key: 'equipManufacturer',
    }];
    const { loading, tableDataSource, currentData } = this.props;

    return (
      <div>
        <Row>
          <Col span={5}>
            <Card title="设备分类树" extra={
              <ButtonGroup>
                <Tooltip title="新增子节点">
                  <Button size="small" icon="plus" onClick={this.onCreateNode} />
                </Tooltip>
                <Tooltip title="编辑节点">
                  <Button size="small" icon="edit" onClick={this.onEditSelection} />
                </Tooltip>
                <Popconfirm title={`确认要删除节点“${currentData.typeName}”吗？`} onConfirm={this.onDeleteSelections}
                            okText="确定" cancelText="取消">
                  <Tooltip title="删除节点">
                    <Button size="small" icon="delete" />
                  </Tooltip>
                </Popconfirm>
              </ButtonGroup>
            }>
              <Tree
                onSelect={(selectedKeys, e) => this.onTreeSelect(selectedKeys, e.node.props.pos)}
                loadData={this.onTreeLoadData} checkable onExpand={this.onTreeExpand}
                defaultSelectedKeys={this.state.selectedKeys} selectedKeys={this.state.selectedKeys}
                onCheck={this.onTreeNodeChecked} defaultExpandedKeys={this.state.expandedKeys}>
                {this.nodeGenerator(this.state.treeData)}
              </Tree>
            </Card>
          </Col>
          <Col span={19}>
            <Card title="设备类型信息" style={{ margin: "0px 0px 3px 1px" }}>
              <EquipmentTypePanel currentData={currentData} />
            </Card>
            <Card title="设备列表" style={{ margin: "0px 1px" }}>
              <Table rowKey="id" columns={columns} dataSource={tableDataSource} loading={loading} />
            </Card>
          </Col>
        </Row>
        <EquipmentTypeModal visible={this.state.typeModalVisible} currentData={currentData}
                            onHideWindow={this.hideModal} saveData={this.onSaveNode} tipInfo="新增设备类型信息" />
      </div>
    );
  }
}

EquipManagementPage.propTypes = {};

const mapStateToProps = state => ({
  ...state.equipManagement, loading: state.loading.models.equipManagement
});

export default connect(mapStateToProps)(EquipManagementPage);
