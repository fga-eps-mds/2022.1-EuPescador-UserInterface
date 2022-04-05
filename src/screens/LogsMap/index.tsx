import React, { useEffect, useState } from 'react';
import { Marker, MapEvent, LatLng, Circle } from 'react-native-maps';
import { Map, MapContainer } from './styles';
import { DefaultButton } from '../../components/Button';
import { GetAllFishLogs } from '../../services/fishLogService/getAllLogs';
import { IFishLog } from '../../components/FishLogCard';

export const LogsMap = ({ navigation, route, token, filterQuery }: any) => {
  const [mark, setMark] = useState<LatLng>({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
  });
  const [fishLogs, setFishLogs] = useState<IFishLog[]>([]);

  useEffect(() => {
    async function updateFishLogs() {
      const data = await GetAllFishLogs(token, filterQuery);
      setFishLogs(data as IFishLog[]);
    }
    updateFishLogs();
  }, [token, filterQuery]);

  const handleDrag = (e: MapEvent) => {
    setMark(e.nativeEvent.coordinate);
  };
  return (
    <MapContainer>
      <Map
        initialRegion={{
          latitude: route.params.latitude,
          longitude: route.params.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0121,
        }}
        onPress={handleDrag}
      >
        <Marker coordinate={mark} />
        {fishLogs.map(log => {
          return (
            <Circle
              center={{
                latitude: log.coordenates[0][0],
                longitude: log.coordenates[0][1],
              }}
              radius={1000}
            />
          );
        })}
      </Map>
      {/* <MapInfoView>
        <MapInstructions>
          <MapInstructionsText>
            Clique no mapa para marcar o local onde pegou o peixe
          </MapInstructionsText>
        </MapInstructions>
        <LocationUsageInfoView>
          <LocationUsageInfoContainer>
            <LocationUsageInfoTitle>
              Por que precisamos da localização?
            </LocationUsageInfoTitle>
            <LocationUsageInfoText>
              A localização enviada será utilizada pelas unidades ambientais
              responsáveis para mapear a posição das espécies marítimas
            </LocationUsageInfoText>
          </LocationUsageInfoContainer>
          <MapButtonsView>
            <DefaultButton
              type="secondary"
              text="Cancelar"
              buttonFunction={() => {
                navigation.goBack();
              }}
            />
            <DefaultButton
              text="Confirmar"
              buttonFunction={() =>
                handleConfirm(mark.latitude, mark.longitude)
              }
            />
          </MapButtonsView>
        </LocationUsageInfoView>
      </MapInfoView> */}
    </MapContainer>
  );
};
