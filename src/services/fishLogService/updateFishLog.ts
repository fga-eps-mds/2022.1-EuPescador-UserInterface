import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from "buffer";
import { fishLogService } from './fishService';

async function UpdateFishLog(
    log_id: string,
    name: string | undefined,
    largeGroup: string | undefined,
    group: string | undefined,
    species: string | undefined,
    latitude: string | undefined,
    longitude: string | undefined,
    photoString: string | undefined | undefined,
    length: string | undefined,
    weight: string | undefined,
    reviewed: boolean | undefined,
    admin: Boolean,
    superAdmin: Boolean,
    visible: boolean
) {
    const userId = await AsyncStorage.getItem("@eupescador/userId");
    const token = await AsyncStorage.getItem("@eupescador/token");
    const userToken = `Bearer ${token}`;
    let photo = null;
    let reviewedBy = null;

    if (admin || superAdmin)
        reviewedBy = userId;

    const coordenates = {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
    }
    if (photoString) {
        photo = photoString;
    }
    const res = await fishLogService.patch(`/fishLog/${log_id}`, {
        name,
        largeGroup,
        group,
        species,
        coordenates,
        photo,
        length: length ? parseFloat(length) : null,
        weight: weight ? parseFloat(weight) : null,
        reviewed,
        reviewedBy: Number(reviewedBy),
        updatedBy: Number(userId),
        visible
    }, { headers: { Authorization: userToken } });
    return res.data;
}

export { UpdateFishLog };
