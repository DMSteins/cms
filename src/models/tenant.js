import { getTenantsList, addTenant, getTenantData } from '../services/api';
import {routerRedux} from 'dva/router';

export default {
    namespace: "tenant",

    state: {
        tenants: {} ,
        currentTenant: {},
    },
    
    effects: {
        *fetchList({payload}, {call, put}){
            const response =  yield call(getTenantsList, payload);
            yield put({
                type: "tenantsList",
                payload: response,
            });
        },
        *addTenant({payload, callback}, {call, put}){
            const response =  yield call(addTenant, payload);
            if(callback) callback(response);
            yield put(routerRedux.push('/tenants/list'));
        },
        *detailTenant({payload, callback}, {call, put}){
            const response =  yield call(getTenantData, payload);
            if(callback) callback(response);
            yield put(routerRedux.push('/tenants/list'));
        },

    },

    reducers: {
        tenantsList(state, action){
            return {
                ...state,
                tenants: action.payload,
            }
        },

    }
};