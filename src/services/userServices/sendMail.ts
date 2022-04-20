import { userService } from './userService';

async function SendMail() {
  let route = "/recover-password";

  userService.get(route);
}

export { SendMail };
