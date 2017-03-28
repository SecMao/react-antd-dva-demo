/**
 * Created by Sec on 2017/3/22.
 */
import React, {PropTypes} from 'react';
import {Row, Col, Button, Form, Input, Select, DatePicker, Icon, TreeSelect} from 'antd';
import moment from 'moment';
import {dateTimeFormat} from '../../constants/options';
import CustomCard from '../common/CustomCard';

const FormItem = Form.Item;
const Option = Select.Option;
const TSNode = TreeSelect.TreeNode;

/**
 * 引用查询面板参考：
 * @param fields: 查询字段，格式[{name: name1, label: label1, type: 'Select', options: {dictData: []}}]
 * @param maxCols: 最大列数，可取值2,3,4,6
 * @param showTitle: 是否展示标题，默认展示
 * @param onSearch: 点击查询及重置按钮后触发
 * @param defaultParams: 默认查询条件
 */
const SearchPanel = Form.create()(class SearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

  // 查询方法
  handleSearch = (e) => {
    e.preventDefault();
    this.onClicked();
  };
  // 重置方法
  handleReset = () => {
    this.props.form.resetFields();
    this.onClicked();
  };
  // 点击触发查询
  onClicked = () => {
    const {form, onSearch} = this.props;
    form.validateFields((err, values) => {
      onSearch(values);
    });
  };
  // 切换隐藏区域显示隐藏
  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  };

  render() {
    const {defaultParams, fields, maxCols, form, showTitle = true} = this.props;
    const {expand} = this.state;
    const shownCount = expand ? fields.length : Math.min((2 * maxCols), fields.length);
    // form item装饰方法
    const {getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
      style: {marginBottom: '8px'}
    };
    // 设置Form.Item
    let formItems = [];
    for (let i = 0; i < shownCount; i++) {
      let options = Object.assign({}, {
        format: dateTimeFormat,
        dictData: {}
      }, fields[i].options);
      let fieldType = fields[i].type;
      let decoratorOpt = {};
      // 设置默认参数
      if (defaultParams) {
        let itemValue = defaultParams[fields[i].name];
        if (fieldType === "DatePicker") {
          itemValue = moment(itemValue);
        } else if (fieldType === "RangePicker") {
          itemValue = [moment(defaultParams[`${fields[i].name}Begin`]), moment(defaultParams[`${fields[i].name}End`])];
        }
        decoratorOpt["initialValue"] = itemValue;
      }
      formItems.push(
        <Col span={24 / maxCols} key={i}>
          <FormItem {...formItemLayout} label={fields[i].label}>
            {getFieldDecorator(fields[i].name, {...decoratorOpt})(
              (() => {
                // 根据字段类型返回对应的数据组件
                switch (fieldType) {
                  case "Select" :// 选择框
                    const optionArr = [];
                    let dictData = options.dictData;
                    for (let [objKey, objValue] of Object.entries(dictData)) {
                      optionArr.push(<Option key={objKey}>{objValue}</Option>);
                    }
                    return <Select placeholder={fields[i].label} allowClear>
                      {optionArr}
                    </Select>;
                  case "DatePicker" :// 日期组件
                    return <DatePicker showTime={{hideDisabledOptions: true}}
                                       format={options.format}/>;
                  case 'RangePicker' :// 日期范围组件
                    const RangePicker = DatePicker.RangePicker;
                    return <RangePicker showTime={{hideDisabledOptions: true}}
                                        format={options.format}/>;
                  case 'TreeSelect' : // 树选择框
                        {/*return*/}
                  default :// 默认为文本框
                    return <Input placeholder={fields[i].label}/>;
                }
              })()
            )
            }
          </FormItem>
        </Col>
      );
    }

    return (
      <CustomCard showTitle={showTitle} title="查询" style={{margin: '0px 0px 2px 0px'}}>
        <Form>
          <Row>
            {formItems.slice(0, shownCount)}
          </Row>
        </Form>
        <Row gutter={40}>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>
              重置
            </Button>
            {
              // 字段总数多于可显示总数，添加展开选项
              fields.length > 2 * maxCols && <a style={{marginLeft: 8, fontSize: 12}} onClick={this.toggle}>
                {expand ? '收起' : '显示更多'}<Icon type={expand ? 'up' : 'down'}/>
              </a>
            }
          </Col>
        </Row>
      </CustomCard>
    );
  }
});

// 定义必需属性校验，未生效
SearchPanel.propTypes = {
  fields: PropTypes.array.isRequired,
  maxCols: PropTypes.oneOf([2, 3, 4, 6]).isRequired,
  showTitle: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
  defaultParams: PropTypes.object
};

export default SearchPanel;
