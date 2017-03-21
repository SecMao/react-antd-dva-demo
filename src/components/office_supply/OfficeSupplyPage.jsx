/**
 * Created by Sec on 2017/3/9.
 */

import React, { PropTypes } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import TableUI from './TableUI';
import DetailWindowUI from './DetailWindowUI';
import SearchPanelUI from './SearchPanelUI';

class SupplyMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  reloadTableData = param => {
    const { currentParam, dispatch } = this.props;
    let queryParam = Object.assign({}, currentParam);
    if (param) {
      for (let [key, value] of Object.entries(param)) {
        if (key === "receiveTime") {
          if (typeof (value) !== "undefined" && value !== null && value[0] !== null && value[0]._isValid) {
            queryParam[`${key}Begin`] = value[0].format('YYYY-MM-DD HH:mm:ss');
            queryParam[`${key}End`] = value[1].format('YYYY-MM-DD HH:mm:ss');
          } else {
            queryParam[`${key}Begin`] = null;
            queryParam[`${key}End`] = null;
          }
        } else {
          queryParam[key] = value;
        }
      }
    }
    dispatch({
      type: 'officeSupply/getSupplyList',
      payload: queryParam,
    });
  };

  createData = () => {
    this.props.dispatch({
      type: 'officeSupply/getSupplyInfo',
      payload: {
        id: null,
        success: () => this.setState({ modalVisible: true })
      }
    });
  };

  editData = id => {
    this.props.dispatch({
      type: 'officeSupply/getSupplyInfo',
      payload: {
        id,
        success: () => this.setState({ modalVisible: true }),
        failure: (msg) => message.error(`获取记录信息失败，请参考：${msg}`)
      }
    });
  };

  saveData = (item, callback) => {
    this.props.dispatch({
      type: 'officeSupply/saveData',
      payload: {
        item,
        success: () => this.actionSuccess("保存记录成功", callback),
        failure: (msg) => message.error(`保存记录失败，请参考：${msg}`)
      }
    });
  };

  actionSuccess = (msg, callback) => {
    message.success(msg);
    this.hideDetailWindow(callback);
  };

  removeData = ids => {
    this.props.dispatch({
      type: 'officeSupply/removeData',
      payload: {
        ids,
        success: () => message.success("删除记录成功"),
        failure: (msg) => message.error(`删除记录失败，请参考：${msg}`)
      }
    });
  };

  hideDetailWindow = callback => {
    this.setState({
      modalVisible: false
    });
    if (typeof callback === "function") {
      callback();
    }
  };

  render() {
    const { dictData, dataSource, currentData, loading, total, currentParam } = this.props;
    const columns = [{
      title: '主键',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '用品类型',
      dataIndex: 'supplyType',
      key: 'supplyType',
      render: text => (dictData["supply_type"] ? dictData["supply_type"][text] : text)
    }, {
      title: '领取时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    }, {
      title: '资产编号',
      dataIndex: 'propertyNumber',
      key: 'propertyNumber'
    }];
    const searchFields = [{
      name: 'supplyType',
      type: 'Select',
      options: {
        dictData: dictData["supply_type"]
      },
      value: "01",
      label: '用品类型'
    }, {
      name: 'receiveTime',
      type: 'RangePicker',
      label: '领取时间'
    }, {
      name: 'propertyNumber',
      type: 'Input',
      label: '资产编号'
    }];
    const detailFields = [{
      name: 'id',
      type: 'Input',
      label: '主键',
      options: {
        disabled: true,
        visible: true
      }
    }, {
      name: 'supplyType',
      type: 'Select',
      rules: [{
        required: true,
        message: '用品类型不能为空！'
      }],
      label: '用品类型',
      options: {
        dictData: dictData["supply_type"]
      }
    }, {
      name: 'receiveTime',
      type: 'DatePicker',
      label: '领取时间',
      options: {
        visible: true
      }
    }, {
      name: 'propertyNumber',
      type: 'Input',
      label: '资产编号',
      rules: [{
        max: 20,
        message: '资产编号长度不能超过20字符！'
      }]
    }];

    return (
      <div>
        <SearchPanelUI fields={searchFields} reloadTableData={this.reloadTableData} />
        <TableUI columns={columns} rowOperation primaryKey="id" dataSource={dataSource} isLoading={loading}
                 pageSize={currentParam.pageSize} onCreateData={this.createData} onEditData={this.editData}
                 total={total} onRemoveData={this.removeData}
                 onChangePagination={this.reloadTableData} />
        <DetailWindowUI currentData={currentData} onHideWindow={this.hideDetailWindow}
                        modalVisible={this.state.modalVisible} fields={detailFields} tipInfo="办公用品领取信息"
                        saveData={this.saveData} />
      </div>
    );
  }
}

SupplyMainPage.propTypes = {};

const mapStateToProps = state => ({
  ...state.officeSupply, loading: state.loading.models.officeSupply
});

export default connect(mapStateToProps)(SupplyMainPage);
