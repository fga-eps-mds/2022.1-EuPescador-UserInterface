import { UserLogin } from '../src/services/userServices/login'
import { GetAllFishLogs} from '../src/services/fishLogService/getAllLogs'
import { GetOneFishLog } from '../src/services/fishLogService/getOneFishLog'
import { UpdateFishLog } from '../src/services/fishLogService/updateFishLog'
import { GetAllUsers } from '../src/services/userServices/getAllUsers'
import { GetWikiFishes } from '../src/services/wikiServices/getWikiFishes'
import { GetOneWikiFish } from '../src/services/wikiServices/getOneWikiFish'

let novoPeixe = {
  name : "testeUpdate",
  largeGroup : "",
  group: "",
  species: "",
  coordenates: "",
  photo: "",
  length: "66",
  weight: "200",
  reviewed: true,
  reviewedBy: true,
  updatedBy: true,
  visible: true
}

describe('AllFishLog Service Test', () => {
  it('Recuperar todos os logs', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await GetAllFishLogs(response.data.token, '').then((res) => {
        expect(res.length).toBeGreaterThanOrEqual(1)
      })
    })
  }, 700000)


  it('Recuperar um log', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await GetAllFishLogs(response.data.token, '1').then((res) => {
        expect(res.length).toBeGreaterThanOrEqual(1)
      })
    })
  }, 700000)

})

describe('OneFishLog Test', () => {
  it('Recuperar um log', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await GetOneFishLog('22', response.data.token).then((res) => {
        expect(res.id).toEqual(22)
      })
    })
  }, 700000)

  it('Log não existente', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await GetOneFishLog('6000', response.data.token).catch((res) => {
        expect(res.response.status).toEqual(404)
      })
    })
  })
})

/*describe('Update Fishlog Test', () => {

  it('Log não existente', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await UpdateFishLog("80", "0", "0", "0","0","0","0","0", "0", "0", true,true,true, response.data.token).catch((res) => {
        expect(res.response.status).toEqual(200)
      })
    })
  }, 700000)
})*/

describe('Get Users Test', () => {
  it('Recupera um user', async () => {
    await UserLogin('lulu@gmail.com', '702200').then(async (response) => {
      await GetAllUsers().then((res) => {
        expect(res.length).toBeGreaterThanOrEqual(1)
      })
    })
  }, 7000)
})

describe('Login Test', () => {
  it('Efetua o login', async () => {
    await UserLogin('lulu@gmail.com', '702200').then((res) => {
      expect(res.status).toEqual(200)
    })
  }, 7000)
})

describe('Get Wiki Fishes Test', () => {
  it('Recupera os peixes da Wiki', async () => {
    await GetWikiFishes().then((res) => {
      expect(res.length).toBeGreaterThanOrEqual(1)
    })
  }, 7000)


  it('Recupera um peixe da Wiki', async () => {
    await GetWikiFishes('1').then((res) => {
      expect(res.id).toEqual(1)
    })
  }, 7000)

})

describe('Get One Wiki Fish Test', () => {
  it('Recupera os peixes da Wiki', async () => {
    await GetOneWikiFish('1').then((res) => {
      expect(res.id).toEqual(1)
    })
  }, 7000)


  it('Recupera um peixe da Wiki', async () => {
    await GetOneWikiFish('2').then((res) => {
      expect(res.id).toEqual(2)
    })
  }, 7000)

})