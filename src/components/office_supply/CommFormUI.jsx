/**
 * Created by Sec on 2017/3/9.
 */

import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, Select, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class CommFormUI extends React.Component {
  resetFields = () => {
    this.props.form.resetFields();
  };

  render() {
    const { currentData, fields, columns } = this.props;
    const colSpan = 24 / columns;
    // form item装饰方法
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    // 设置Form.Item
    let formItems = [];
    for (let i = 0; i < fields.length; i++) {
      let options = Object.assign({}, {
        disabled: false,
        visible: true
      }, fields[i].options);
      let fieldType = fields[i].type;
      let decoratorOpt = {
        rules: fields[i].rules
      };
      if (typeof currentData !== "undefined" && currentData !== null) {
        let itemValue = currentData[fields[i].name];
        if (fieldType === "DatePicker") {
          itemValue = moment(itemValue);
        } else if (fieldType === "RangePicker") {
          itemValue = [moment(currentData[`${fields[i].name}Begin`]), moment(currentData[`${fields[i].name}End`])];
        }
        decoratorOpt["initialValue"] = itemValue;
      }
      formItems.push(
        <Col span={options.visible ? colSpan : 0} key={i}>
          <FormItem {...formItemLayout} label={fields[i].label}>
            {getFieldDecorator(fields[i].name, { ...decoratorOpt })(
              // 自执行方法根据字段类型返回对应的数据组件
              (() => {
                switch (fieldType) {
                  case "Select" :// 选择框
                    const optionArr = [];
                    let dictData = options.dictData || {};
                    for (let [objKey, objValue] of Object.entries(dictData)) {
                      optionArr.push(<Option key={objKey}>{objValue}</Option>);
                    }
                    return <Select placeholder={fields[i].label} allowClear>
                      {optionArr}
                    </Select>;
                  case "DatePicker" :// 日期组件
                    return <DatePicker showTime={{ hideDisabledOptions: true }}
                                       format={options.foramt || "YYYY-MM-DD HH:mm:ss"} />;
                  case 'RangePicker' :// 日期范围组件
                    const RangePicker = DatePicker.RangePicker;
                    return <RangePicker showTime={{ hideDisabledOptions: true }}
                                        format={options.foramt || "YYYY-MM-DD HH:mm:ss"} />;
                  default :// 默认为文本框
                    return <Input placeholder={fields[i].label} disabled={options.disabled} />;
                }
              })()
            )
            }
          </FormItem>
        </Col>
      );
    }

    return (
      <Form>
        <Row>
          {formItems}
        </Row>
      </Form>
    );
  }
}

CommFormUI.propTypes = {
  fields: PropTypes.array.isRequired,
  columns: PropTypes.number.isRequired,
  currentData: PropTypes.object,
  getData: PropTypes.func,
  clearData: PropTypes.func
};

export default Form.create()(CommFormUI);
