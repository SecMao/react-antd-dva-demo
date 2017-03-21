/**
 * Created by Sec on 2017/3/20.
 */
import { Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;

export default Form.create()(function ({ currentData, form }) {
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Form>
      <Row>
        <Col span={8} key={1}>
          <FormItem {...formItemLayout} label="所属上级分类">
            {getFieldDecorator("parentTypeCode", {
              initialValue: currentData ? (currentData.parent ? currentData.parent.typeCode : null) : null,
            })(
              <Input placeholder="所属上级分类" disabled />
            )}
          </FormItem>
        </Col>
        <Col span={8} key={2}>
          <FormItem {...formItemLayout} label="设备类型编码">
            {getFieldDecorator("typeCode", {
              initialValue: currentData ? (currentData.typeCode) : null,
            })(
              <Input placeholder="设备类型" disabled />
            )}
          </FormItem>
        </Col>
        <Col span={8} key={3}>
          <FormItem {...formItemLayout} label="设备类型名称">
            {getFieldDecorator("typeName", {
              initialValue: currentData ? (currentData.typeName) : null,
            })(
              <Input placeholder="设备类型名称" disabled />
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
});
