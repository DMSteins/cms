import { getProdctList, addProduct, deleteProduct, editProduct, getProduct } from '../services/api';
import { add } from 'gl-matrix/src/gl-matrix/mat2';

export default {
  namespace: 'product',

  state: {
    list: [],
    currentPro: {
      name: "",
      description: "",
    }
  },
  /*异步操作，得到服务器返回结果后，调用同步操作reducers来更新state*/
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProdctList, payload);
      var data = {};
      if(response) {
        data = {...response}
      }
      yield put({
        type: 'queryList',
        payload: data,
      });
      
    },
    *fetchProduct({payload}, {call, put}){
      const response = yield call(getProduct, payload);
      var data = {};
      if(response) {
        data = {...response}
      }
      yield put({
        type: 'productData',
        payload: data,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(getProdctList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProduct, payload);
      // yield put({
      //   type: 'addProduct',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteProduct, payload);

      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call, put }){
      const response = yield call(editProduct, payload);
      if (callback) callback(response);
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    addProduct(state, action){
      return {
        ...state,
        list: state.list.rows.concat(action.payload),
      };
    },
    productData(state, action){
      return {
        ...state,
        currentPro: action.payload,
      };
    }
  },
};