import { userService } from './userService';

async function UserEmail() {
  let route = "/user/";
  
  const res = await userService.get(route)
  return res.data as any;

  return res;
}

export { UserEmail };
