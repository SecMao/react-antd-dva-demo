/**
 * Created by Sec on 2017/3/9.
 */
import moment from 'moment';
import officeSupplyService from '../services/officeSupplyService';
import { runCallback } from '../utils/common';

export default {
  namespace: 'officeSupply',
  state: {
    dataSource: [],
    total: 0,
    currentData: {},
    dictData: {},
    currentParam: {
      supplyType: null,
      receiveTimeBegin: null,
      receiveTimeEnd: null,
      propertyNumber: null,
      pageSize: 5,
      pageNumber: 1,
      orderBy: "receive_time"
    }
  },
  reducers: {
    reloadTable(state, { payload: { dataSource, total, newParam: currentParam } }) {
      return { ...state, dataSource, total, currentParam };
    },
    reloadForm(state, { payload: currentData }) {
      return { ...state, currentData };
    },
    injectDict(state, { payload: dictData }) {
      return { ...state, dictData };
    }
  },
  effects: {
    * getSupplyList({ payload: param }, { call, put, select }) {
      const currentParam = yield select(state => state.officeSupply.currentParam);
      const newParam = Object.assign({}, currentParam, { ...param });
      const { data: dataSource, total } = yield call(officeSupplyService.getSupplyList, { ...newParam });
      yield put({ type: 'reloadTable', payload: { dataSource, total, newParam } });
    },
    * getSupplyInfo({ payload: { id, success, failure } }, { call, put }) {
      let fetchResult = {
        result: "success",
        data: {
          id: null,
          supplyType: null,
          receiveTime: moment(),
          propertyNumber: null
        }
      };
      if (typeof id !== "undefined" && id !== null) {
        fetchResult = yield call(officeSupplyService.getSupplyInfo, { id });
      }
      yield runCallback(put, fetchResult, 'reloadForm', fetchResult.data, success, failure);
    },
    * getDictData({ payload: type }, { call, put }) {
      const dictData = yield call(officeSupplyService.getDictData, { type });
      yield put({ type: 'injectDict', payload: dictData });
    },
    * removeData({ payload: { ids, success, failure } }, { call, put }) {
      const fetchResult = yield call(officeSupplyService.removeData, ids);
      yield runCallback(put, fetchResult, 'getSupplyList', {}, success, failure);
    },
    * saveData({ payload: { item, success, failure } }, { call, put }) {
      const fetchResult = yield call(officeSupplyService.saveData, { ...item });
      yield runCallback(put, fetchResult, 'getSupplyList', {}, success, failure);
    },
  },
  subscriptions: {
    initPage({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        dispatch({ type: 'getDictData' });
        if (pathname === '/rowEdit_toolBarEdit') {
          dispatch({ type: 'getSupplyList' });
        } else if (pathname === '/form') {
          dispatch({ type: 'getSupplyInfo', payload: query.id });
        }
      });
    }
  }
};
