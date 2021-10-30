import React, { useState, useEffect } from 'react';
import { Buffer } from "buffer";
import { Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { GetWikiFishes } from '../../services/wikiServices/getWikiFishes';
import { RegularText } from '../../components/RegularText';
import { createFishLog } from '../../services/fishLogService/createFishLog';
import { ActivityIndicator } from 'react-native-paper';
import { GetOneFishLog } from '../../services/fishLogService/getOneFishLog';
import { UpdateFishLog } from '../../services/fishLogService/updateFishLog';
import {
  NewFishLogContainer,
  ImageContainer,
  FishLogImage,
  TopIcon,
  TextClick,
  InputContainer,
  InputView,
  InputBox,
  Input,
  RowView,
  BoxView,
  HalfInputView,
  SendButtonView,
  SendButton,
  SendButtonText,
  OptionList,
  OptionsContainer,
  OptionListItem,
  AddLocaleButton,
  AddLocaleButtonLabel,
  AddLocaleButtonIcon,
  NewFishlogScroll,
} from './styles';
export interface IFish {
  _id: string;
  largeGroup: string;
  group: string;
  commonName: string;
  scientificName: string;
  family: string;
  food: string;
  habitat: string;
  maxSize: number;
  maxWeight: number;
  isEndemic: string;
  isThreatened: string;
  hasSpawningSeason: string;
  wasIntroduced: string;
  funFact: string;
  photo: string;
}

export function NewFishLog({ navigation, route }: any) {
  const [isNew, setIsNew] = useState(false);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);
  const [fishes, setFishes] = useState<IFish[]>([]);
  const [fishPhoto, setFishPhoto] = useState<string | undefined | undefined>();
  const [fishName, setFishName] = useState<string | undefined>();
  const [fishLargeGroup, setFishLargeGroup] = useState<string | undefined>();
  const [fishGroup, setFishGroup] = useState<string | undefined>();
  const [fishSpecies, setFishSpecies] = useState<string | undefined>();
  const [fishWeight, setFishWeight] = useState<string | undefined>();
  const [fishLength, setFishLength] = useState<string | undefined>();
  const [fishLatitude, setFishLatitude] = useState<string | undefined>();
  const [fishLongitude, setFishLongitude] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  const getFishOptions = async () => {
    let newFishes: IFish[] = [];
    try {
      const wikiData = await GetWikiFishes();
      for (let i = 0; i < wikiData.length; i++) {
        if (!newFishes.includes(wikiData[i])) {
          newFishes.push(wikiData[i]);
        }
      }
      setFishes(newFishes);
    } catch (error) {
      console.log(error);
    }
  };

  const setFishProps = async (fish: IFish) => {
    setFishName(fish.commonName);
    setFishSpecies(fish.scientificName);
    setFishLargeGroup(fish.largeGroup);
    setFishGroup(fish.group);
  }

  const getData = async () => {
    const id = await AsyncStorage.getItem("@eupescador/userId");
    const userAdmin = await AsyncStorage.getItem("@eupescador/userAdmin");
    const token = await AsyncStorage.getItem("@eupescador/token");
    if (token) {
      getFishLogProperties(token);
    }
    if (userAdmin === "true")
      setIsAdmin(true);
    else
      setIsAdmin(false);
  }

  const getFishLogProperties = async (token: string) => {
    try {
      const { log_id } = route.params;
      const log = await GetOneFishLog(log_id, token);
      if (log.photo) {
        const log64 = Buffer.from(log.photo).toString('base64');
        setFishPhoto(log64);
      }
      setFishName(log?.name || undefined);
      setFishSpecies(log?.species || undefined);
      setFishLargeGroup(log?.largeGroup || undefined);
      setFishGroup(log?.group || undefined);
      setFishWeight(log?.weight?.toString() || undefined);
      setFishLength(log?.length?.toString() || undefined);
      setFishLongitude(log?.coordenates?.longitude?.toString() || undefined);
      setFishLatitude(log?.coordenates?.latitude?.toString() || undefined);
    } catch (error) {
      console.log(error);
    }
  };

  async function requestPermission() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Error', 'É preciso permissão para colocar uma foto');
    }
  }

  async function openCamera() {
    await requestPermission();

    const pickerResult = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      quality: 0.5,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    setFishPhoto(pickerResult.base64);
  }

  async function pickImage() {
    await requestPermission();

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
      aspect: [1, 1],
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      return;
    }
    setFishPhoto(pickerResult.base64);
  }

  const handleEditFishLog = async () => {
    let alertMessage = '';
    let alertTitle = '';
    const { log_id } = route.params;
    let reviewed = false;
    if (isAdmin) {
      reviewed = true;
    }

    try {
      const res = await UpdateFishLog(
        log_id,
        fishName,
        fishLargeGroup,
        fishGroup,
        fishSpecies,
        fishLatitude,
        fishLongitude,
        fishPhoto,
        fishLength,
        fishWeight,
        reviewed,
        isAdmin
      );
      alertMessage = "Registro atualizado com sucesso";
      alertTitle = 'Editar registro'
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: 'WikiFishlogs' }],
      });
      navigation.dispatch(resetAction);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400)
        alertTitle = 'Sem informação'
      alertMessage = error.response.data.message;
    }
    if (alertMessage) {
      Alert.alert(alertTitle, alertMessage, [
        {
          text: 'Ok',
        },
      ]);
    }
  }

  const deleteDraft = async () => {
    if (isDraft) {
      const drafts = await AsyncStorage.getItem('drafts');
      if (drafts) {
        let draftList: [] = JSON.parse(drafts);
        if (draftId)
          draftList.splice(parseInt(draftId), 1);
        await AsyncStorage.setItem('drafts', JSON.stringify(draftList));
      }
    }
  }

  const handleCreateFishLog = async () => {
    let alertMessage = '';
    try {
      setIsLoading(true);
      await createFishLog(
        fishPhoto,
        fishName,
        fishLargeGroup,
        fishGroup,
        fishSpecies,
        fishWeight,
        fishLength,
        fishLatitude,
        fishLongitude,
      );
      setIsLoading(false);
      alertMessage = 'Registro criado com sucesso!';
      await deleteDraft();
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: 'WikiFishlogs' }],
      });
      navigation.dispatch(resetAction);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      if (error.response.status === 400)
        alertMessage =
          'Informe no mínimo o grande grupo, espécie ou foto do peixe';
      else if (error.response.status === 413)
        alertMessage = 'Falha ao criar registro! Arquivo muito grande';
      else alertMessage = 'Falha ao criar registro!';
    }
    if (alertMessage) {
      Alert.alert('Registro', alertMessage, [
        {
          text: 'Ok',
        },
      ]);
    }
  }

  const handleOpenMap = async () => {
    const { log_id, name } = route.params;
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Sem permissão de localização",
        "Para abrir o mapa é necessário que você aceite a permissão de localização."
      );
      return;
    }
    setIsLoading(true);
    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setIsLoading(false);
    if (!fishLatitude && !fishLongitude) {
      setFishLatitude(loc.coords.latitude.toString());
      setFishLongitude(loc.coords.longitude.toString());
    }
    const latitude = fishLatitude ? parseFloat(fishLatitude) : loc.coords.latitude;
    const longitude = fishLongitude ? parseFloat(fishLongitude) : loc.coords.longitude;
    navigation.navigate("Maps", {
      isNew,
      isAdmin,
      photoString: fishPhoto,
      name: fishName,
      largeGroup: fishLargeGroup,
      group: fishGroup,
      species: fishSpecies,
      weight: fishWeight,
      length: fishLength,
      latitude,
      longitude,
      log_id,
      screenName: name
    })
  }

  const saveDraft = async () => {
    let drafts = await AsyncStorage.getItem('drafts');
    const newDraft = {
      photoString: fishPhoto,
      name: fishName,
      largeGroup: fishLargeGroup,
      group: fishGroup,
      species: fishSpecies,
      weight: fishWeight,
      length: fishLength,
      latitude: fishLatitude,
      longitude: fishLongitude,
    };
    let newDrafts;
    if (drafts != null) {
      let oldDrafts = JSON.parse(drafts);
      newDrafts = [...oldDrafts, newDraft];
    }
    else {
      newDrafts = [newDraft];
    }
    await AsyncStorage.setItem('drafts', JSON.stringify(newDrafts));
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'WikiFishlogs' }],
    });
    navigation.dispatch(resetAction);

  }

  const getSendButton = () => {
    const text = isNew || !isAdmin ? "Enviar" : "Revisar";
    let handleButton: () => void;
    if (isNew) {
      if (isConnected) {
        handleButton = handleCreateFishLog;
      }
      else {
        handleButton = saveDraft;
      }
    }
    else {
      handleButton = handleEditFishLog;
    }
    return (
      <SendButton onPress={handleButton}>
        <SendButtonText>{text}</SendButtonText>
      </SendButton>
    )
  }

  const loadData = async () => {
    const connection = await Network.getNetworkStateAsync();
    setIsConnected(!!connection.isConnected && !!connection.isInternetReachable);
    if (connection.isConnected && connection.isInternetReachable) {
      getFishOptions();
      const { data, isNewRegister, isFishLogDraft, fishLogDraftId } = route.params;
      setIsNew(isNewRegister);
      console.log(data);
      if (data != null) {
        setIsAdmin(data?.isAdmin);
        setFishName(data?.name);
        setFishLargeGroup(data?.largeGroup);
        setFishGroup(data?.group);
        setFishSpecies(data?.species)
        setFishWeight(data?.weight);
        setFishLength(data?.length);
        setFishLatitude(data?.latitude?.toString());
        setFishLongitude(data?.longitude?.toString());
        if (data.photo) {
          const log64 = Buffer.from(data.photo).toString('base64');
          setFishPhoto(log64);
        }
      }
      if (isFishLogDraft) {
        setIsDraft(true);
        setDraftId(fishLogDraftId);
      }
      else {
        if (!isNewRegister) {
          getData();
        }
      }
    }
  }

  const list = () => {
    return fishes.filter((item) => {
      if (item.commonName.toLowerCase().includes(fishName.toLowerCase().trim())) {
        return item;
      }
    }).map((item, index) => {
      return (
        <OptionListItem key={index} onPress={() => setFishProps(item)}>
          <RegularText text={item.commonName} />
        </OptionListItem>
      );
    });
  };
  useEffect(() => {
    loadData();
  }, [route.params]);


  return (
    <NewFishLogContainer>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) :
        (<ScrollView>
          <ImageContainer>
            {fishPhoto ? (
              <FishLogImage
                source={{ uri: `data:image/png;base64,${fishPhoto}` }}
              />
            ) : (
              <FishLogImage source={require('../../assets/selectPicture.png')} />
            )}
          </ImageContainer>
          <ImageContainer onPress={pickImage}>
            <TopIcon name="photo" />
            <TextClick>Selecionar Foto</TextClick>
          </ImageContainer>
          <ImageContainer onPress={openCamera}>
            <TopIcon name="camera" />
            <TextClick>Tirar Foto</TextClick>
          </ImageContainer>

          <InputContainer>
            <InputView>
              <Input
                placeholder="Nome"
                value={fishName}
                onChangeText={setFishName}
              />
              <InputBox />
            </InputView>
            {
              (fishName && fishes.filter((item) => {
                if (
                  item.commonName.toLowerCase().includes(fishName.toLowerCase().trim())
                  && item.commonName.toLowerCase() != fishName.toLowerCase().trim()
                ) {
                  return item;
                }
              }).length) ? (
                <OptionsContainer>
                  <OptionList showsVerticalScrollIndicator>{list()}</OptionList>
                </OptionsContainer>
              ) : (null)
            }

            <InputView>
              <Input
                placeholder="Espécie"
                value={fishSpecies}
                onChangeText={setFishSpecies}
              />
              <InputBox />
            </InputView>

            <InputView>
              <Input
                placeholder="Grande Grupo"
              />
              <InputBox />
            </InputView>

            <InputView>
              <Input
                placeholder="Grupo"
                value={fishGroup}
                onChangeText={setFishGroup}
              />
              <InputBox />
            </InputView>

            <BoxView>
              <RowView>
                <HalfInputView>
                  <Input
                    placeholder="Peso (kg)"
                    value={fishWeight}
                    keyboardType="numeric"
                    onChangeText={setFishWeight}
                  />
                </HalfInputView>
                <HalfInputView>
                  <Input
                    placeholder="Comprimento (cm)"
                    value={fishLength}
                    keyboardType="numeric"
                    onChangeText={setFishLength}
                  />
                </HalfInputView>
              </RowView>
            </BoxView>
          </InputContainer>
          <AddLocaleButton onPress={handleOpenMap}>
            <AddLocaleButtonIcon name="map" />
            <AddLocaleButtonLabel> {fishLatitude && fishLongitude ? "Alterar" : "Adicionar"} Localização </AddLocaleButtonLabel>
          </AddLocaleButton >
          <SendButtonView>
            {getSendButton()}
          </SendButtonView>
        </ScrollView >)
      }
    </NewFishLogContainer >
  );
}