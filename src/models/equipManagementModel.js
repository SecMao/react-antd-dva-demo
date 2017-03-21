import equipManagementService from '../services/equipManagementService';
import { runCallback } from '../utils/common';

export default {
  namespace: 'equipManagement',
  state: {
    loadData: [],
    parentPos: null,
    tableDataSource: [],
    currentData: {},
    expandedKeys: []
  },
  reducers: {
    refreshTree(state, { payload: { data: loadData, parentPos } }) {
      return { ...state, loadData, parentPos };
    },
    reloadTableData(state, { payload: { data: tableDataSource } }){
      return { ...state, tableDataSource };
    },
    reloadTypeForm(state, { payload: currentData }){
      return { ...state, currentData };
    }
  },
  effects: {
    *getTypeTreeNodes({ payload: { parentKey, parentPos } }, { call, put }){
      const { data } = yield call(equipManagementService.getTypeTreeNodes, { "parent.typeCode": parentKey });
      yield put({ type: 'refreshTree', payload: { data, parentPos } });
    },
    *getEquipInfoList({ payload: typeCode }, { call, put }){
      const { data } = yield call(equipManagementService.getEquipInfoList, { equipType: typeCode });
      yield put({ type: 'reloadTableData', payload: { data } });
    },
    *getEquipTypeInfo({ payload: { typeCode, parentTypeCode, success, failure } }, { call, put }){
      let fetchResult = {
        result: "success",
        data: {
          id: null,
          typeCode: null,
          parent: { typeCode: parentTypeCode },
          typeName: null
        }
      };
      if (typeCode && typeCode !== '-1') {
        fetchResult = yield call(equipManagementService.getEquipTypeInfo, { typeCode });
      }
      yield runCallback(put, fetchResult, 'reloadTypeForm', fetchResult.data, success, failure);
    },
    *saveEquipTypeInfo({ payload: { item, parentTypeCode, parentPos, success, failure } }, { call, put }){
      const fetchResult = yield call(equipManagementService.saveEquipTypeInfo, item);
      yield runCallback(put, fetchResult, 'getTypeTreeNodes', {
        parentKey: parentTypeCode,
        parentPos: parentPos
      }, success, failure);
    },
    *removeTypeTreeNodes({ payload: { typeCode, parentTypeCode, parentPos, success, failure } }, { call, put }){
      const fetchResult = yield call(equipManagementService.removeTypeTreeNodes, [typeCode]);
      yield runCallback(put, fetchResult, 'getTypeTreeNodes', {
        parentKey: parentTypeCode,
        parentPos
      }, success, failure);
    }
  },
  subscriptions: {
    initPage({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/triggerTableQuery') {
          dispatch({ type: 'getTypeTreeNodes', payload: { parentKey: "-1", parentPos: "0-0" } });
          dispatch({ type: 'getEquipInfoList', payload: null });
        }
      });
    }
  },
};
