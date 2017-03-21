/**
 * Created by Sec on 2017/3/20.
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
