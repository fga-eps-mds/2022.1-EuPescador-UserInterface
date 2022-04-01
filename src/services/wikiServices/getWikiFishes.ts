import { FishWiki } from "../../interfaces/FishWiki";
import wikiService from "./wikiService";

async function GetWikiFishes(query?:string) {
  let route = "/fishWiki/";
  if(query)
    route += query;

  const res = await wikiService.get(route);

  return res.data as any[];
}

export { GetWikiFishes };