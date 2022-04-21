import { userService } from './userService';

async function UpdateUser(email:string, password:string) {
  let route = "/user/";
  
  await userService.put(route,{email, password});

}

export { UpdateUser };
