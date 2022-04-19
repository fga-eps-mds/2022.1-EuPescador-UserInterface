import React, { useEffect, useState } from 'react';
import { Marker} from 'react-native-maps';
import {  Map, MapContainer } from './styles';
import { GetAllFishLogs } from '../../services/fishLogService/getAllLogs';
import { IFishLog } from '../../components/FishLogCard';
import { Container } from './styles';
import { Imagem } from './styles';

export const LogsMap = ({ latitude, longitude,latitudeDelta,longitudeDelta, token, navigation, isAdmin, filterQuery }: any) => {

  const [fishLogs, setFishLogs] = useState<IFishLog[]>([]);
  
  async function updateFishLogs() {
    const data = await GetAllFishLogs(token, filterQuery);

    setFishLogs(data as IFishLog[]);
    
  }
    
  useEffect(() => {
    updateFishLogs();
    
    
  }, []);

  // const handleDrag = (e: MapEvent) => {
  //   setMark(e.nativeEvent.coordinate);
  // };
  return (
    
    <Container>
      <MapContainer >
        
        
        <Map
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }
          }
          maxZoomLevel={14.8}
          
        >
          {
            isAdmin ? (
              fishLogs.map(log => {
                if(log.reviewed){
                return (
                  <Marker
                    coordinate={{
                      latitude: log.coordenates.latitude,
                      longitude: log.coordenates.longitude
                    }}
                    title={log.name}
                    description={log.group}
                  />
                )
                  }else{
                    return
                  }

              })

            ) :
         
            
              fishLogs.map(log => {
                if(log.reviewed && log.visible){
                  return (         
                    
                        <Marker
                            coordinate={{
                            latitude: log.coordenates.latitude,
                            longitude: log.coordenates.longitude,
                            
                            }}
                            title={log.name}
                            description={log.group}
                  
                            image={{
                              uri: Imagem.resolveAssetSource(
                                require("../../assets/circle2.png")
                              ).uri,
                            }}
                            
                        />
                       
                    )
                }else{
                  return
                }

                  }
            )
    }
        </Map> 
        
      </MapContainer>
    </Container>
  );
};
