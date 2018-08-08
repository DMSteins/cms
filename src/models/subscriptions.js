import { getSubscriptionsList, addSubscription, getSubscription, updateSubscription } from '../services/api';
import {routerRedux} from 'dva/router';

export default {
    namespace: "subscriptions",

    state: {
        data: {} ,
        currentSubscription: {},
    },
    
    effects: {
        *fetchList({payload}, {call, put}){
            const response =  yield call(getSubscriptionsList, payload);
            yield put({
                type: "subscriptionsList",
                payload: response,
            });
        },
        *addSubscription({payload, callback}, {call, put}){
            const response =  yield call(addSubscription, payload);
            if(callback) callback(response);
            yield put(routerRedux.push(`/tenants/${payload.tenantId}`));
        },
        *getSubscription({payload}, {call, put}){
            const response =  yield call(getSubscription, payload);
            yield put({
                type: "currentSubscription",
                payload: response,
            });
        },
        *updateSubscription({payload, callback}, {call, put}){
            const response =  yield call(updateSubscription, payload);
            if(callback) callback(response);
            yield put(routerRedux.push(`/tenants/${payload.tenantId}`));
        },

    },

    reducers: {
        subscriptionsList(state, action){
            return {
                ...state,
                data: action.payload,
            }
        },
        currentSubscription(state, action){
            return {
                ...state,
                currentSubscription: action.payload,
            }
        },

    }
};