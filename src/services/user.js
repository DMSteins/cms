import request from '../utils/request';
import { getLocalStorage } from '../utils/help';
import { getAuthHeader } from '../utils/utils';

const urlPrefix = 'http://59.80.34.112:4000';

export async function query() {
  return request('/api/users');
}
/*组件加载完毕后获取用户信息/api/currentUser
*/
export async function queryCurrent() {
  const tokenData = getLocalStorage('KLoginToken');
  const token = tokenData.token ? tokenData.token : '';
  const header = getAuthHeader(token);
  return request(`${urlPrefix}/auth/user`, {
    method: 'GET',
    ...header,
  });
}
