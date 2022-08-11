import React, { useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import { LoadingIdicationMapView, Map, MapContainer } from "./styles";
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
    const userSuperAdmin = await AsyncStorage.getItem(
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
            if (res.reviewed) {
              return (
                <Marker
                  coordinate={{
                    latitude:
                      res.coordenates.latitude !== null
                        ? res.coordenates.latitude
                        : 0.0,
                    longitude:
                      res.coordenates.longitude !== null
                        ? res.coordenates.longitude
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
      {isLoading &&
        <LoadingIdicationMapView>
          <ActivityIndicator size="large" color="#0000ff" />
        </LoadingIdicationMapView>
      }
    </Container>
  );
};
