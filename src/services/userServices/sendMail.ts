import { userService } from './userService';

async function SendMail() {
  let route = "/recover-password/";
  
  const res = await userService.get(route);

  return res;
}

export { SendMail };
