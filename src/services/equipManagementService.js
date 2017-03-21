/**
 * Created by Sec on 2017/3/16.
 */
import request from '../utils/request';

export default {
  getTypeTreeNodes: param => request('/api/equipType/list', param),
  getEquipTypeInfo: param => request('/api/equipType/form', param),
  saveEquipTypeInfo: item => request('/api/equipType/save', item, 'POST'),
  removeTypeTreeNodes: typeCodes => request('/api/equipType/delete', typeCodes, 'POST'),
  getEquipInfoList: param => request('/api/equipInfo/list', param),
  removeEquipData: ids => request('/api/equipInfo/delete', ids, 'POST'),
  saveEquipData: item => request('/api/equipInfo/save', item, 'POST')
};
