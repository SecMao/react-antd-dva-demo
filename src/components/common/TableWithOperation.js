/**
 * Created by Sec on 2017/3/23.
 */

import React, { PropTypes } from 'react';
import { Table, Button, Popconfirm, message, Tooltip } from 'antd';
import CustomCard from '../common/CustomCard';

const ButtonGroup = Button.Group;

/**
 * 引用表格组件参考：
 * @param primaryKey: 数据源主键
 * @param columns: 表格列，格式[{ title: '主键', dataIndex: 'id', key: 'id', render: () => () }]
 * @param dataSource: 数据源
 * @param total：数据总数
 * @param rowOperation：是否需要行编辑，格式
 *             {enable: true,//是否启用行编辑
 *             showEditBtn: true, // 是否显示编辑按钮
 *             showDelBtn: true, // 是否显示删除按钮
 *             extra: [{// 自定义按钮
 *               icon: 'user',// 按钮图标
 *               text: '提示',// 按钮文字
 *               danger: false,// 是否为危险按钮
 *               onClick: () => ()// 点击事件
 *             }]}
 * @param onChangePagination: 切换分页方法
 * @param onCreateData: 新增数据方法
 * @param onEditData: 编辑数据方法
 * @param onRemoveData: 删除数据方法
 */
class TableWithOperation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: []// 选中行
    };
  }

  // 点击行勾选
  rowClick = record => this.setState({ selectedRowKeys: [record.id] });
  // 删除选择记录
  deleteSelections = () => {
    this.props.onRemoveData(this.state.selectedRowKeys);
  };

  render() {
    const { primaryKey } = this.props;
    // 行选择参数
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => this.setState({ selectedRowKeys: selectedRowKeys })
    };

    // 如果行操作属性为真，且行操作列不存在，添加行操作列
    let columns = this.props.columns;
    const rowOperation = Object.assign({}, {
      enable: true,
      showEditBtn: true,
      showDelBtn: true,
      extra: []
    }, this.props.rowOperation);
    if (rowOperation.enable && columns.findIndex(column => (column["key"] === "operation")) === -1) {
      columns.push({
        title: '操作',
        key: 'operation',
        minWidth: '15%',
        render: (text, record) =>
          <span className="ant-btn-group">
            {// 编辑按钮
              rowOperation.showEditBtn && <Tooltip title="编辑">
                <Button type="primary" icon="edit"
                        onClick={() => this.props.onEditData(record[primaryKey])} />
              </Tooltip>
            }
            {// 删除按钮
              rowOperation.showDelBtn && <Tooltip title="删除">
                <Popconfirm title="确认要删除此条记录吗？" onConfirm={() => this.props.onRemoveData([record[primaryKey]])}
                            okText="确定"
                            cancelText="取消">
                  <Button type="danger" icon="delete" />
                </Popconfirm>
              </Tooltip>
            }
            {// 自定义按钮
              (() => {
                let extraBtns = [];
                if (rowOperation.extra) {
                  for (let i = 0; i < rowOperation.extra.length; i++) {
                    let btn = rowOperation.extra[i];
                    extraBtns.push(<Tooltip title={btn.text} key={i}>
                      {btn.danger ?
                        <Popconfirm title={`确认要${btn.text}此条记录吗？`} onConfirm={() => btn.onClick(record)}
                                    okText="确定"
                                    cancelText="取消">
                          <Button type="danger" icon={btn.icon} />
                        </Popconfirm> : <Button type="primary" icon={btn.icon} onClick={() => btn.onClick(record)} />}
                    </Tooltip>);
                  }
                  return extraBtns;
                }
              })()
            }
          </span>
      });
    }

    return (
      <CustomCard>
        <ButtonGroup style={{ margin: '4px 0' }}>
          <Button type="primary" icon="plus" onClick={this.props.onCreateData}>新增</Button>
          <Popconfirm title="确认要删除选中的记录吗？" onConfirm={this.deleteSelections}
                      okText="确定"
                      cancelText="取消">
            <Button type="danger" icon="delete">批量删除</Button>
          </Popconfirm>
          <Button type="primary" icon="file-excel">导出</Button>
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
      </CustomCard>
    );
  }
}

TableWithOperation.propTypes = {
  columns: PropTypes.array.isRequired,
  rowOperation: PropTypes.object.isRequired,
  primaryKey: PropTypes.string.isRequired,
  dataSource: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onChangePagination: PropTypes.func.isRequired,
  onCreateData: PropTypes.func.isRequired,
  onEditData: PropTypes.func.isRequired,
  onRemoveData: PropTypes.func.isRequired
};

export default TableWithOperation;
