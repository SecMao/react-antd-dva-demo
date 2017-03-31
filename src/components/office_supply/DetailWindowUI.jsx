/**
 * Created by Sec on 2017/2/27.
 */

import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import CommFormUI from './CommFormUI';

class DetailWindowUI extends React.Component {
  // 点击模态窗口确认按钮
  handleOk = () => {
    this.props.dispatch({
      type: 'common/invokeCommFormFunc',
      payload: { funcName: 'getCommFormValues', callback: this.props.saveData }
    });
  };
  // 重置方法
  resetFields = () => {
    this.props.dispatch({
      type: 'common/invokeCommFormFunc',
      payload: { funcName: 'resetCommFormValues', callback: undefined }
    });
  };

  render() {
    const { currentData, fields } = this.props;

    return (
      <Modal title={this.props.tipInfo} visible={this.props.modalVisible}
             onOk={this.handleOk} onCancel={() => this.props.onHideWindow(this.resetFields)} width="900px">
        <CommFormUI currentData={currentData} fields={fields} columns={2} />
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

export default connect()(DetailWindowUI);
