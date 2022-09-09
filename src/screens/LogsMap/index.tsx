import React, { useEffect, useState } from "react";
import { LoadingIdicationMapView, Map, MapContainer } from "./styles";
import { Marker, Circle } from "react-native-maps";
import { GetAllFishLogs } from "../../services/fishLogService/getAllLogs";
import { IFishLog } from "../../components/FishLogCard";
import { Container } from "./styles";
import { Imagem } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

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
  const [isLoading, setIsLoading] = useState(true);

  async function updateFishLogs() {
    const data = await GetAllFishLogs(token, filterQuery);
    setFishLogs(data as IFishLog[]);
    const userSuperAdmin = await storage.getString(
      "@eupescador/userSuperAdmin"
    );
    if (userSuperAdmin === "true") {
      setIsSuperAdmin(true);
    }
    setIsLoading(false);
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
          })}
        </Map>
      </MapContainer>
      {isLoading &&
        <LoadingIdicationMapView>
          <ActivityIndicator size="large" color="#0000ff" />
        </LoadingIdicationMapView>
      }
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