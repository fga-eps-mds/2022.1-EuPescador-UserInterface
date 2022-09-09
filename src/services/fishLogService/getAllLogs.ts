import { fishLogService } from './fishService';

async function GetAllFishLogs(token: string, query: string) {
  let route = "/fishLog/";
  if(query)
    route += query;
  
  const userToken = `Bearer ${token}`;
  const res = await fishLogService.get(route, {
    timeout: 1000000,
    headers: { Authorization: userToken },
  });
  return res.data as any;
}

export { GetAllFishLogs };
