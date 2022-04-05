import React, { useEffect, useState } from 'react';
import { Marker, MapEvent, LatLng, Circle } from 'react-native-maps';
import { Map, MapContainer } from './styles';
import { DefaultButton } from '../../components/Button';
import { GetAllFishLogs } from '../../services/fishLogService/getAllLogs';
import { IFishLog } from '../../components/FishLogCard';
import * as Location from 'expo-location';
import { Container } from './styles';
import { useAuth } from '../../contexts/authContext';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';



export const LogsMap = ({ navigation,isAdmin ,token, filterQuery }: any) => {


  const [wiki, setWiki] = useState(true);
  const [register, setRegister] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const { signOut } = useAuth();
  const [fishLatitude, setFishLatitude] = useState<any | null>();
  const [fishLongitude, setFishLongitude] = useState<any | null>();

  const [mark, setMark] = useState<LatLng>({
    latitude: fishLatitude,
    longitude: fishLongitude,
  });
  const [fishLogs, setFishLogs] = useState<IFishLog[]>([]);

  useEffect(() => {
    async function updateFishLogs() {
      const data = await GetAllFishLogs(token, filterQuery);
      setFishLogs(data as IFishLog[]);
    }
    updateFishLogs();
  }, [token, filterQuery]);
 
  async function getPosition() {
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setFishLatitude(loc.coords.latitude);
      setFishLongitude(loc.coords.longitude);
  }

    getPosition();


  const handleDrag = (e: MapEvent) => {
    setMark(e.nativeEvent.coordinate);
  };
  return (
    <Container>
      <MapContainer>
        <Map
          initialRegion={{
            latitude: fishLatitude,
            longitude: fishLongitude,
            latitudeDelta: 0.0300022,
            longitudeDelta: 0.0000121,
          }}
          onPress={handleDrag}
        >
          {/* <Marker coordinate={mark} />
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
          })} */}
        </Map>
        {isAdmin}
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
     

    </Container>
  );
};
