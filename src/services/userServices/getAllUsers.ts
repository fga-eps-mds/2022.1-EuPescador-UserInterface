import { userService } from './userService';

async function GetAllUsers() 
  {
    const res = await userService.get('/user/');
    return res.data as any;
  }
  
  export { GetAllUsers };