import { userService } from './userService';

async function SendMail(email: string) {
  userService.post('/recover-password', { email });
}

export { SendMail };
