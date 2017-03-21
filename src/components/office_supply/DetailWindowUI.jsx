/**
 * Created by Sec on 2017/2/27.
 */

import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import CommFormUI from './CommFormUI';

class DetailWindowUI extends React.Component {
  formReference = (form) => {
    this.form = form;
  };
  // 点击模态窗口确认按钮
  handleOk = () => {
    // 校验并滚动到出错位置
    this.form.validateFieldsAndScroll((err, values) => {
      if (err) { // 有错误则返回并自动提示
        return;
      }
      // 保存数据并回调重置方法
      this.props.saveData(values, this.resetFields);
    });
  };
  // 重置方法
  resetFields = () => {
    this.form.resetFields();
  };

  render() {
    const { currentData, fields } = this.props;

    return (
      <Modal title={this.props.tipInfo} visible={this.props.modalVisible}
             onOk={this.handleOk} onCancel={() => this.props.onHideWindow(this.resetFields)} width="900px">
        <CommFormUI ref={this.formReference} currentData={currentData} fields={fields} columns={2} />
      </Modal>
    );
  }
}

DetailWindowUI.propTypes = {
  fields: PropTypes.array.isRequired,
  currentData: PropTypes.object.isRequired,
  tipInfo: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  onHideWindow: PropTypes.func.isRequired,
  saveData: PropTypes.func.isRequired,
};

export default DetailWindowUI;
