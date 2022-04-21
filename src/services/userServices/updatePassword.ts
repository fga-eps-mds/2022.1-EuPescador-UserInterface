import { userService } from './userService';

async function UpdateUser(user_id: string, password: string) {
  let route = '/user/';

  await userService.put(route, { user_id, password });
}

async function VerifyToken(token: string) {
  const res = await userService.get(`/recover-password/token?value=${token}`);

  return res;
}

export { UpdateUser, VerifyToken };
