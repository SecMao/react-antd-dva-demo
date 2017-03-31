/**
 * Created by Sec on 2017/3/31.
 */
export default {
  namespace: 'common',
  state: {
    commFormInvoke: {
      invokeKey: 0,
      commFormFuncName: '',
      commFormFuncCallback: undefined
    }
  },
  reducers: {
    invokeCommFormFunc(state, { payload: { funcName: commFormFuncName, callback: commFormFuncCallback } }) {
      return {
        ...state, commFormInvoke: {
          invokeKey: Date.now(),
          commFormFuncName, commFormFuncCallback
        }
      };
    }
  },
  effects: {},
  subscriptions: {},
};
