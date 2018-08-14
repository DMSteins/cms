import { routerRedux } from 'dva/router';
import { fakeAccountLogin, test } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { setLocalStorage } from '../utils/help';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response);
      
      if(response && response.token){
        yield put({
          type: 'changeLoginStatus',
          payload: {...response, status: 'ok'},
        });

        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: {...response, status: 'error'},
        });
        reloadAuthorized();
        // yield put(routerRedux.push('/user/login'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      setLocalStorage("KLoginToken", payload);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        httpCode: payload.httpCode,
      };
    },
  },
};
