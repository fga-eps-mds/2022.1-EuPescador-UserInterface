import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminService } from "./adminService";
const config = require('../../../config');

async function editUser(
    name: string | undefined,
    email: string | undefined,
    phone: string | undefined,
    state: string | undefined,
    city: string | undefined,
  ) {
        const userSuperAdmin = await AsyncStorage.getItem('@eupescador/userSuperAdmin');

        if(userSuperAdmin === "true") {
          const token : string = config.ADMIN_CONFIRMATION_CODE;
          const res = await adminService.put('/admin/', {
              name,
              email,
              phone,
              state,
              city,
              token,
          },);
          return res;
        } else {
              const token : string = "não-sou-admin";
              const res = await adminService.put('/admin/', {
                  name,
                  email,
                  phone,
                  state,
                  city,
                  token,
              },);
              return res;
        }
  }

export { editUser };