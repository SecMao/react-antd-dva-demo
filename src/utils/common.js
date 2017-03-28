/**
 * Created by Sec on 2017/3/20.
 */
import moment from 'moment';

/**
 * 请求成功后执行回调函数并分发刷新Action
 * @param put
 * @param fetchResult 请求结果
 * @param type 刷新Action type
 * @param payload 刷新Action 参数
 * @param success 成功回调
 * @param failure 失败回调
 */
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

/**
 * 初始化树根节点
 * @param prevState 当前状态
 * @param defaultRootKey 默认根节点key
 * @param defaultRootName 默认根节点名称
 * @param loadData 异步数据
 * @param selectEvent 节点选中事件
 * @returns {{}}
 */
export const initTreeRootNode = (prevState, defaultRootKey, defaultRootName, loadData, selectEvent) => {
  let state = {};
  if (defaultRootKey === '-1') {
    let root = { id: '-1', orgCode: '-1', orgName: defaultRootName, children: loadData }, focusKey = loadData[0].id;
    // 默认根节点为-1，默认选中-1的子节点
    state = {
      treeData: [root],
      selectedNodeData: loadData,
      selectedKeys: [focusKey],
      selectedPos: '0-0-0'
    };
  } else {
    const newRoot = loadData[0];
    // 指定根节点时默认选中指定的节点
    state = {
      treeData: loadData,
      selectedNodeData: Object.assign({}, newRoot, { children: undefined }),
      selectedKeys: [newRoot.id],
      selectedPos: '0-0'
    };
  }
  // 手动触发选择事件
  selectEvent(state.selectedKeys, state.selectedPos, state.selectedNodeData);
  return Object.assign({}, prevState, state);
};

/**
 * 将异步数据添加到已有树数据
 * 注意此函数非纯，将直接修改传入数据
 * @param treeData 已有数据
 * @param loadData 异步数据
 * @param position 添加位置
 */
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

/**
 * 获取指定位置的树节点
 * @param treeData 数据源
 * @param position 位置
 * @returns {*}
 */
export const findTreeNodeInPos = (treeData, position) => {
  let item = treeData[position[0]];
  if (position.length === 1) {
    return item;
  }
  return findTreeNodeInPos(item.children, position.slice(1));
};

/**
 * 常用时间区间
 * @type {{昨天: [*], 今天: [*], 上周: [*], 本周: [*], 上月: [*], 本月: [*], 上季度: [*], 本季度: [*], 上年度: [*], 本年度: [*]}}
 */
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
