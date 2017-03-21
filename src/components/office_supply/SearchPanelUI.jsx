/**
 * Created by Sec on 2017/2/27.
 *
 * 定义查询Form
 */
import React, { PropTypes } from 'react';
import { Card, Row, Col, Button } from 'antd';
import CommFormUI from './CommFormUI';

class SearchPanelUI extends React.Component {
  formReference = (form) => {
    this.form = form;
  };
  // 查询方法
  handleSearch = (e) => {
    e.preventDefault();
    this.reloadTable();
  };
  // 重置方法
  handleReset = () => {
    this.form.resetFields();
    this.reloadTable();
  };
  reloadTable = () => {
    this.form.validateFields((err, values) => {
      this.props.reloadTableData(values);
    });
  };

  render() {
    return (
      <Card title="查询" bordered={false} style={{ margin: '0px 0px 8px 0px' }}>
        <CommFormUI ref={this.formReference} fields={this.props.fields} columns={3} />
        <Row gutter={40}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

// 定义必需属性校验，未生效
SearchPanelUI.propTypes = {
  fields: PropTypes.array.isRequired,
  reloadTableData: PropTypes.func.isRequired,
};

export default SearchPanelUI;
