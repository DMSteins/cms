import { stringify } from 'qs';
import request from '../utils/request';
import { getLocalStorage } from '../utils/help';
import { getAuthHeader } from '../utils/utils';

const urlPrefix = 'http://59.80.34.112:4000';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

/*登录接口http://59.80.34.112:4000/auth/login
http://192.168.39.28/phpapi/test.php
*/
export async function fakeAccountLogin(params) {
  return request(`${urlPrefix}/auth/login`, {
    method: 'POST',
    body: params,
  });
}

export async function getProdctList(params){
  return request(`${urlPrefix}/productions?page=${params.page}&page_size=${params.page_size}`, {
    method: 'GET',
  }, true);
}

export async function addProduct(params){
  return request(`${urlPrefix}/productions`, {
    method: 'POST',
    body: params,
  }, true);
}

export async function deleteProduct(params){
  return request(`${urlPrefix}/productions/${params.id}`, {
    method: 'DELETE',
  }, true);
}

export async function editProduct(params){
  return request(`${urlPrefix}/productions/${params.id}`, {
    method: 'PUT',
    body: {
      name: params.name,
      description: params.description,
    }
  }, true);
}

export async function getProduct(params){
  return request(`${urlPrefix}/productions/${params.id}`, {
    method: 'GET',
  }, true);
}

export async function getModulesList(params){
  return request(`${urlPrefix}/productions/${params.id}/modules`, {
    method: 'GET',
  }, true);
}

export async function getModuleData(params){
  return request(`${urlPrefix}/modules/${params.id}`, {
    method: 'GET',
  }, true);
}

export async function deleteModule(params){
  return request(`${urlPrefix}/modules/${params.id}`, {
    method: 'DELETE',
  }, true);
}

export async function addModule(params){
  return request(`${urlPrefix}/modules`, {
    method: 'POST',
    body: {
      name: params.name,
      description: params.description,
      productionId: params.id,
    }
  }, true);
}

export async function editModule(params){
  return request(`${urlPrefix}/modules/${params.id}`, {
    method: 'PUT',
    body: {
      name: params.name,
      description: params.description,
      productionId: params.productionId,
    }
  }, true);
}

export async function getTenantsList(params){
  return request(`${urlPrefix}/tenants?page=${params.page}&page_size=${params.page_size}`, {
    method: 'GET',
  }, true);
}

export async function addTenant(params){
  return request(`${urlPrefix}/tenants`, {
    method: 'POST',
    body: {
      ...params,
    }
  }, true);
}

export async function getTenantData(params){
  return request(`${urlPrefix}/tenants/${params.id}`, {
    method: 'GET',
  }, true);
}

export async function deleteTenant(params){
  return request(`${urlPrefix}/tenants/${params.id}`, {
    method: 'DELETE',
  }, true);
}

export async function editTenant(params){
  return request(`${urlPrefix}/tenants/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    }
  }, true);
}

export async function getSubscriptionsList(params){
  return request(`${urlPrefix}/subscriptions?page=${params.page}&page_size=${params.page_size}&tenant_id=${params.tenant_id}`, {
    method: 'GET',
  }, true);
}

export async function addSubscription(params){
  return request(`${urlPrefix}/subscriptions`, {
    method: 'POST',
    body: {
      ...params,
    }
  }, true);
}

export async function getSubscription(params){
  return request(`${urlPrefix}/subscriptions/${params.id}`, {
    method: 'GET',
  }, true);
}

export async function updateSubscription(params){
  return request(`${urlPrefix}/subscriptions/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    }
  }, true);
}
