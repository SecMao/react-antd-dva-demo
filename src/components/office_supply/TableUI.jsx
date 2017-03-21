/**
 * Created by Sec on 2017/2/27.
 */

import React, { PropTypes } from 'react';
import { Table, Card, Button, Popconfirm, message } from 'antd';

const ButtonGroup = Button.Group;

class TableUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: []
    };
  }

  onEditSelection = (redirect) => {
    if (this.state.selectedRowKeys.length === 1) {
      const selectedId = this.state.selectedRowKeys[0];
      if (redirect) {
        this.props.onEditDataRedirect(selectedId);
      } else {
        this.props.onEditData(selectedId);
      }
      return;
    }
    message.warning("请选择一条且只能选择一条记录进行编辑！");
  };
  rowClick = record => this.setState({ selectedRowKeys: [record.id] });
  deleteSelections = () => {
    this.props.onRemoveData(this.state.selectedRowKeys);
  };

  render() {
    const { primaryKey } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => this.setState({ selectedRowKeys: selectedRowKeys })
    };

    // 如果行操作属性为真，且行操作列不存在，添加行操作列
    let columns = this.props.columns;
    if (this.props.rowOperation && columns.findIndex(column => (column["key"] === "operation")) === -1) {
      columns.push({
        title: '操作',
        key: 'operation',
        width: '15%',
        render: (text, record) =>
          <span className="ant-btn-group">
              <Button type="primary" icon="edit"
                      onClick={() => this.props.onEditData(record[primaryKey])}>编辑</Button>
              <Popconfirm title="确认要删除此条记录吗？" onConfirm={() => this.props.onRemoveData([record[primaryKey]])}
                          okText="确定"
                          cancelText="取消">
                <Button type="danger" icon="delete">删除</Button>
              </Popconfirm>
          </span>
      });
    }

    return (
      <Card >
        <ButtonGroup style={{ margin: '8px 0' }}>
          <Button type="primary" icon="plus" onClick={this.props.onCreateData}>新增</Button>
          <Button type="primary" icon="edit" onClick={() => this.onEditSelection(false)}>编辑</Button>
          <Popconfirm title="确认要删除选中的记录吗？" onConfirm={() => this.deleteSelections()}
                      okText="确定"
                      cancelText="取消">
            <Button type="danger" icon="delete">删除</Button>
          </Popconfirm>
        </ButtonGroup>
        <Table rowKey={primaryKey} dataSource={this.props.dataSource} columns={columns} rowSelection={rowSelection}
               onRowClick={this.rowClick} size="middle"
               pagination={{
                 pageSize: this.props.pageSize,
                 showSizeChanger: true,
                 total: this.props.total,
                 pageSizeOptions: ["5", "10", "15", "20"],
                 showTotal: (total, range) => `共${total}条记录，当前展示第${range[0]}至第${range[1]}条`,
                 onShowSizeChange: (current, pageSize) => this.props.onChangePagination({
                   pageNumber: current,
                   pageSize
                 }),
                 onChange: (page) => this.props.onChangePagination({ pageNumber: page })
               }} />
      </Card>
    );
  }
}

TableUI.propTypes = {
  columns: PropTypes.array.isRequired,
  rowOperation: PropTypes.bool.isRequired,
  primaryKey: PropTypes.string.isRequired,
  dataSource: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onChangePagination: PropTypes.func.isRequired,
  onCreateData: PropTypes.func.isRequired,
  onEditData: PropTypes.func.isRequired,
  onRemoveData: PropTypes.func.isRequired
};

export default TableUI;
