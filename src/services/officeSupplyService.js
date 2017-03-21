/**
 * Created by Sec on 2017/3/9.
 */
import request from '../utils/request';

export default {
  getSupplyList: param => request('/api/supply/list', param),
  getSupplyInfo: id => request('/api/supply/form', id),
  removeData: ids => request('/api/supply/delete', ids, 'POST'),
  saveData: item => request('/api/supply/saveForm', item, 'POST'),
  getDictData: () => request('/api/supply/getDictData')
};
