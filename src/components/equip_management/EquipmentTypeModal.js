/**
 * Created by Sec on 2017/3/20.
 */
import React, { PropTypes } from 'react';
import { Modal, Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;

function EquipmentTypeModal({
                              visible, form, tipInfo, saveData, onHideWindow, currentData
                            }) {
  function handleOk() {
    // 校验并滚动到出错位置
    form.validateFieldsAndScroll((err, values) => {
      if (err) { // 有错误则返回并自动提示
        return;
      }
      // 保存数据并回调重置方法
      saveData(values, clearAllData);
    });
  }

  function clearAllData() {
    form.resetFields();
  }

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal visible={visible} title={tipInfo} onOk={handleOk} onCancel={() => onHideWindow(clearAllData)} width="900px">
      <Form>
        <Row>
          <Col span={0} key={1}>
            <FormItem {...formItemLayout} label="主键">
              {getFieldDecorator("id", {
                initialValue: currentData ? (currentData.id) : null,
              })(
                <Input placeholder="主键" disabled />
              )}
            </FormItem>
          </Col>
          <Col span={12} key={2}>
            <FormItem {...formItemLayout} label="所属上级分类">
              {getFieldDecorator("parent.typeCode", {
                initialValue: currentData ? (currentData.parent ? currentData.parent.typeCode : null) : null,
                rules: [{ max: 15, message: "所属上级分类不能超过15字符" }]
              })(
                <Input placeholder="所属上级分类" disabled />
              )}
            </FormItem>
          </Col>
          <Col span={12} key={3}>
            <FormItem {...formItemLayout} label="设备类型编码">
              {getFieldDecorator("typeCode", {
                initialValue: currentData ? (currentData.typeCode) : null,
                rules: [{ required: true, message: "请填写设备类型编码" }, { max: 15, message: "所属上级分类不能超过15字符" }]
              })(
                <Input placeholder="设备类型" />
              )}
            </FormItem>
          </Col>
          <Col span={12} key={4}>
            <FormItem {...formItemLayout} label="设备类型名称">
              {getFieldDecorator("typeName", {
                initialValue: currentData ? (currentData.typeName) : null,
                rules: [{ required: true, message: "请填写设备类型名称" }, { max: 45, message: "设备类型名称不能超过15字符" }]
              })(
                <Input placeholder="设备类型名称" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

EquipmentTypeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  tipInfo: PropTypes.string.isRequired,
  saveData: PropTypes.func.isRequired,
  currentData: PropTypes.object.isRequired,
  onHideWindow: PropTypes.func.isRequired
};

export default Form.create()(EquipmentTypeModal);
