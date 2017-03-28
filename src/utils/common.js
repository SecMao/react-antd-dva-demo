/**
 * Created by Sec on 2017/3/20.
 */
import moment from 'moment';

export const runCallback = function *runCallback(put, fetchResult, type, payload, success, failure) {
  if (fetchResult.result === "success") {
    if (typeof success === "function") {
      success();
    }
    yield put({ type: type, payload: payload });
    return;
  }
  if (typeof failure === "function") {
    failure(fetchResult.message);
  }
};

export const appendTreeNodeData = (treeData, loadData, position) => {
  let item = treeData[position[0]];
  if (position.length === 1) {
    if (loadData.length !== 0) {
      item.children = loadData;
    } else {
      item.isLeaf = true;
    }
    return;
  }
  appendTreeNodeData(item.children, loadData, position.slice(1));
};

export const findTreeNodeInPos = (treeData, position) => {
  let item = treeData[position[0]];
  if (position.length === 1) {
    return item;
  }
  return findTreeNodeInPos(item.children, position.slice(1));
};

export const commonTimeRanges = {
  '昨天': [moment().startOf('day').add(-1, 'day'), moment().endOf('day').add(-1, 'day')],
  '今天': [moment().startOf('day'), moment()],
  '上周': [moment().startOf('week').add(-1, 'week'), moment().startOf('week').add(-1, 'second')],
  '本周': [moment().startOf('week'), moment().endOf('day')],
  '上月': [moment().startOf('month').add(-1, 'month'), moment().startOf('month').add(-1, 'second')],
  '本月': [moment().startOf('month'), moment().endOf('day')],
  '上季度': [moment().startOf('quarter').add(-1, 'quarter'), moment().startOf('quarter').add(-1, 'second')],
  '本季度': [moment().startOf('quarter'), moment().endOf('day')],
  '上年度': [moment().startOf('year').add(-1, 'year'), moment().startOf('year').add(-1, 'second')],
  '本年度': [moment().startOf('year'), moment().endOf('day')]
};
