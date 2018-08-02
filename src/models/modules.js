import { getModulesList, addModule, deleteModule, getModuleData, editModule } from '../services/api'

export default {
    namespace: "modules",

    state: {
        modulesList: [],
        currentModule: {},
    },
    
    effects: {
        *fetchList({payload}, {call, put}){
            const response =  yield call(getModulesList, payload);
            yield put({
                type: "modulesList",
                payload: response,
            });
        },
        *deleteModule({payload, callback}, {call, put}){
            const response =  yield call(deleteModule, payload);
            if(callback) callback(response);
        },
        *addModule({payload, callback}, {call, put}){
            const response =  yield call(addModule, payload);
            if(callback) callback(response);
        },
        *fetchModuleData({payload}, {call, put}){
            const response =  yield call(getModuleData, payload);
            yield put({
                type: "currentModule",
                payload: response,
            });
        },
        *editModule({payload, callback}, {call, put}){
            const response =  yield call(editModule, payload);
            if(callback) callback(response);
        },
    },

    reducers: {
        modulesList(state, action){
            return {
                ...state,
                modulesList: action.payload,
            }
        },
        currentModule(state, action){
            return {
                ...state,
                currentModule: action.payload,
            }
        },

    }
};