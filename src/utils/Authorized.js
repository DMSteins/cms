import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';
import { getLocalStorage } from './help';

let Authorized = RenderAuthorized(getLocalStorage('KLoginToken')); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getLocalStorage('KLoginToken'));
};

export { reloadAuthorized };
export default Authorized;
