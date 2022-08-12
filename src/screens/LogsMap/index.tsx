import React, { useEffect, useState } from "react";
import { Marker, Circle } from "react-native-maps";
import { Map, MapContainer } from "./styles";
import { GetAllFishLogs } from "../../services/fishLogService/getAllLogs";
import { IFishLog } from "../../components/FishLogCard";
import { Container } from "./styles";
import { Imagem } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LogsMap = ({
  latitude,
  longitude,
  latitudeDelta,
  longitudeDelta,
  token,
  navigation,
  isAdmin,
  filterQuery,
}: any) => {
  const [fishLogs, setFishLogs] = useState<IFishLog[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  async function updateFishLogs() {
    const data = await GetAllFishLogs(token, filterQuery);
    setFishLogs(data as IFishLog[]);
    const userSuperAdmin = await AsyncStorage.getItem(
      "@eupescador/userSuperAdmin"
    );
    if (userSuperAdmin === "true") {
      setIsSuperAdmin(true);
    }
  }

  useEffect(() => {
    updateFishLogs();
  }, []);
  return (
    <Container>
      <MapContainer>
        <Map
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
          maxZoomLevel={14.8}
        >
          {fishLogs.map((res) => {
            if (res.reviewed) {
              return (
                <Marker
                  coordinate={{
                    latitude:
                      res.coordenates.latitude !== null
                        ? randomNumber(res.coordenates.latitude)
                        : 0.0,
                    longitude:
                      res.coordenates.longitude !== null
                        ? randomNumber(res.coordenates.longitude)
                        : 0.0,
                  }}
                  title={res.name}
                  description={res.group}
                />
              );
            }
          })}
        </Map>
      </MapContainer>
    </Container>
  );
};

function randomNumber(coordinate: number) {
	let random = 0;
    while(0.1> random || random > 0.25){
     random = Math.random();
    }
    if(random<0.15){
      random = random * -1;
    }
    let sum = coordinate + (random/80);
    return sum;
}