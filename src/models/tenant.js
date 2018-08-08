import { getTenantsList, addTenant, getTenantData, deleteTenant, editTenant } from '../services/api';
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
            yield put({
                type: 'currentTenant',
                payload: response,
              });
        },
        *deleteTenant({payload, callback}, {call, put}){
            const response =  yield call(deleteTenant, payload);
            if(callback) callback(response);
        },
        *edit({ payload, callback }, { call, put }){
            const response = yield call(editTenant, payload);
            console.log(response);
            if (callback) callback(response);
        },

    },

    reducers: {
        tenantsList(state, action){
            return {
                ...state,
                tenants: action.payload,
            }
        },
        currentTenant(state, action){
            return {
                ...state,
                currentTenant: action.payload,
            }
        },

    }
};