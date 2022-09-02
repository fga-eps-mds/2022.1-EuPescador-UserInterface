import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { GetWikiFishes } from "../../services/wikiServices/getWikiFishes";
import { RegularText } from "../../components/RegularText";
import { HalfToneText } from "../../components/HalfToneText";
import { ActivityIndicator, Switch } from "react-native-paper";
import { createFishLog } from "../../services/fishLogService/createFishLog";
import { GetOneFishLog } from "../../services/fishLogService/getOneFishLog";
import { UpdateFishLog } from "../../services/fishLogService/updateFishLog";
import { data } from "../../utils/dataFishes";
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
} from "./styles";

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
  const [isSuperAdmin, setIsSuperAdmin] = useState<Boolean>(false);
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [fishes, setFishes] = useState<IFish[]>([]);
  const [fishPhoto, setFishPhoto] = useState<string | undefined | undefined>();
  const [fishName, setFishName] = useState<string | undefined>();
  const [fishLargeGroup, setFishLargeGroup] = useState<string | undefined>("");
  const [fishGroup, setFishGroup] = useState<string | undefined>();
  const [fishSpecies, setFishSpecies] = useState<string | undefined>();
  const [fishWeight, setFishWeight] = useState<string | undefined>();
  const [fishLength, setFishLength] = useState<string | undefined>();
  const [fishLatitude, setFishLatitude] = useState<string | undefined>();
  const [fishLongitude, setFishLongitude] = useState<string | undefined>();
  const [dropLargeGroup, setDropLargeGroup] = useState(false);
  const [dropGroup, setDropGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [fishFamily, setFishFamily] = useState<string | undefined>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const netInfo = useNetInfo();
  const isOn = useNetInfo().isConnected;
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
    setFishFamily(fish.family);
    setFishLargeGroup(fish.largeGroup);
    setFishGroup(fish.group);
  };

  const getData = async () => {
    const userAdmin = await AsyncStorage.getItem("@eupescador/userAdmin");
    const userSuperAdmin = await AsyncStorage.getItem(
      "@eupescador/userSuperAdmin"
    );
    const token = await AsyncStorage.getItem("@eupescador/token");
    if (token) {
      getFishLogProperties(token);
    }
    if (userAdmin === "true") {
      setIsAdmin(true);
      setIsSuperAdmin(false);
      setCanEdit(true);
    } else if (userSuperAdmin === "true") {
      setIsAdmin(false);
      setIsSuperAdmin(true);
      setCanEdit(true);
    } else {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setCanEdit(false);
    }
  };

  const getFishLogProperties = async (token: string) => {
    try {
      const { log_id } = route.params;
      const log: any = await GetOneFishLog(log_id, token);
      if (log.photo) {
        const log64 = Buffer.from(log.photo).toString("base64");
        setFishPhoto(log64);
      }
      setFishName(log?.name || undefined);
      setFishSpecies(log?.species || undefined);
      setFishLargeGroup(log?.largeGroup || undefined);
      setFishGroup(log?.group || undefined);
      setFishWeight(log?.weight?.toString() || undefined);
      setFishLength(log?.length?.toString() || undefined);
      setFishFamily(log?.family || undefined);
      setFishLongitude(log?.coordenates?.longitude?.toString() || undefined);
      setFishLatitude(log?.coordenates?.latitude?.toString() || undefined);
      setIsVisible(log?.visible || undefined);
    } catch (error) {
      console.log(error);
    }
  };

  async function requestPermission() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Error", "É preciso permissão para colocar uma foto");
    }
  }

  async function openCamera() {
    await requestPermission();

    const pickerResult = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      quality: 0.1,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    if (pickerResult.height > 2200) {
      Alert.alert("Ops!", "Imagem muito grande!", [
        {
          text: "Ok",
        },
      ]);
      return;
    }
    setFishPhoto(pickerResult.base64);
  }

  async function pickImage() {
    await requestPermission();

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.1,
      width: 200,
      height: 200,
      aspect: [1, 1],
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      return;
    }
    if (pickerResult.height > 2200) {
      Alert.alert("Ops!", "Imagem muito grande!", [
        {
          text: "Ok",
        },
      ]);
      return;
    }
    setFishPhoto(pickerResult.base64);
  }

  const handleEditFishLog = async () => {
    let alertMessage = "";
    let alertTitle = "";
    const { log_id } = route.params;
    let reviewed = false;
    if (isAdmin || isSuperAdmin) {
      reviewed = true;
    }

    try {
      await UpdateFishLog(
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
        isAdmin,
        isSuperAdmin,
        isVisible
      );
      alertMessage = "Registro atualizado com sucesso";
      alertTitle = "Editar registro";
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "WikiFishlogs" }],
      });
      navigation.dispatch(resetAction);
    } catch (error: any) {
      if (error.response.status === 400) alertTitle = "Sem informação";
      alertMessage = error.response.data.message;
    }
    if (alertMessage) {
      Alert.alert(alertTitle, alertMessage, [
        {
          text: "Ok",
        },
      ]);
    }
  };

  const deleteDraft = async () => {
    if (isDraft) {
      const drafts = await AsyncStorage.getItem("drafts");
      if (drafts) {
        let draftList: [] = JSON.parse(drafts);
        if (draftId) draftList.splice(parseInt(draftId), 1);
        await AsyncStorage.setItem("drafts", JSON.stringify(draftList));
      }
    }
  };

  const handleCreateFishLog = async () => {
    let alertMessage = "";
    const connection = await NetInfo.fetch();
    try {
      setIsLoading(true);
      if (connection.isConnected) {
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
          isVisible
        );
        alertMessage = "Registro criado com sucesso!";
        await deleteDraft();
      } else {
        const userId = await AsyncStorage.getItem("@eupescador/userId");
        const coordenates = {
          latitude: parseFloat(fishLatitude!),
          longitude: parseFloat(fishLongitude!),
        };
        const fish = {
          userId,
          fishPhoto,
          name: fishName,
          largeGroup: fishLargeGroup,
          group: fishGroup,
          species: fishSpecies,
          length: parseFloat(fishLength!),
          weight: parseFloat(fishWeight!),
          coordenates,
        };

        const response = await AsyncStorage.getItem("@eupescador/newfish");

        let listFish = [];
        if (response) {
          listFish = JSON.parse(response);
          listFish.push(fish);
          await AsyncStorage.setItem(
            "@eupescador/newfish",
            JSON.stringify(listFish)
          );
        } else {
          listFish.push(fish);
          await AsyncStorage.setItem(
            "@eupescador/newfish",
            JSON.stringify(listFish)
          );
        }

        Alert.alert("Registro", "Seu registro foi salvo com sucesso!");
      }

      setIsLoading(false);
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "WikiFishlogs" }],
      });
      navigation.dispatch(resetAction);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      if (error.response.status === 400)
        alertMessage =
          "Informe no mínimo o grande grupo, espécie ou foto do peixe";
      else if (error.response.status === 413)
        alertMessage = "Falha ao criar registro! Arquivo muito grande";
      else alertMessage = "Falha ao criar registro!";
    }
    if (alertMessage) {
      Alert.alert("Registro", alertMessage, [
        {
          text: "Ok",
        },
      ]);
    }
  };

  const handleOpenMap = async () => {
    const { log_id, name } = route.params;
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sem permissão de localização",
        "Para abrir o mapa é necessário que você aceite a permissão de localização."
      );
      return;
    }
    const connection = await NetInfo.fetch();
    setIsConnected(!!connection.isConnected);
    setIsLoading(true);
    let loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setIsLoading(false);
    if (!fishLatitude && !fishLongitude) {
      setFishLatitude(loc.coords.latitude.toString());
      setFishLongitude(loc.coords.longitude.toString());
    }
    const latitude = fishLatitude
      ? parseFloat(fishLatitude)
      : loc.coords.latitude;
    const longitude = fishLongitude
      ? parseFloat(fishLongitude)
      : loc.coords.longitude;
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
      screenName: name,
    });
  };

  const saveDraft = async () => {
    setIsLoading(true);
    let drafts = await AsyncStorage.getItem("drafts");
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
      visible: isVisible,
    };
    let newDrafts;
    if (drafts != null) {
      let oldDrafts = JSON.parse(drafts);
      if (isDraft) {
        if (draftId) {
          oldDrafts[parseInt(draftId)] = newDraft;
          newDrafts = oldDrafts;
        }
      } else {
        newDrafts = [...oldDrafts, newDraft];
      }
    } else {
      newDrafts = [newDraft];
    }
    await AsyncStorage.setItem("drafts", JSON.stringify(newDrafts));
    setIsLoading(false);
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "WikiFishlogs" }],
    });
    navigation.dispatch(resetAction);
    Alert.alert(
      "Rascunho salvo",
      "Seu rascunho foi salvo com sucesso, quando você tiver acesso a internet pode editar as informações que quiser e enviar para nosso servidor."
    );
  };

  const getSendButton = () => {
    let text = isNew || !canEdit ? "Enviar" : "Revisar";
    let handleButton: () => void;
    if (isNew) {
      if (true) {
        handleButton = handleCreateFishLog;
      } else {
        text = "Salvar rascunho";
        handleButton = saveDraft;
      }
    } else {
      handleButton = handleEditFishLog;
    }

    return (
      <SendButton onPress={handleButton}>
        <SendButtonText>{text}</SendButtonText>
      </SendButton>
    );
  };

  const loadData = async () => {
    setIsLoading(true);
    const connection = await NetInfo.fetch();
    const hasConnection = !!connection.isConnected;
    setIsConnected(hasConnection);
    getFishOptions();
    const { data, isNewRegister, isFishLogDraft, fishLogDraftId } =
      route.params;
    setIsNew(isNewRegister);
    if (data != null) {
      setIsAdmin(data?.isAdmin);
      setFishName(data?.name);
      setFishLargeGroup(data?.largeGroup);
      setFishGroup(data?.group);
      setFishSpecies(data?.species);
      setFishWeight(data?.weight);
      setFishLength(data?.length);
      setFishFamily(data?.family);
      setFishLatitude(data?.latitude?.toString());
      setFishLongitude(data?.longitude?.toString());
      setIsVisible(data?.visible);
      if (data.photo) {
        const log64 = Buffer.from(data.photo).toString("base64");
        setFishPhoto(log64);
      }
    }
    if (isFishLogDraft) {
      setIsDraft(true);
      setDraftId(fishLogDraftId);
    } else {
      if (!isNewRegister && hasConnection) {
        getData();
      }
    }
    setIsLoading(false);
  };

  const nameList = () => {
    return fishes
      .filter((item) => {
        if (
          item.commonName
            .toLowerCase()
            .includes(fishName!.toLowerCase().trim()) &&
          item.commonName.toLowerCase() != fishName!.toLowerCase().trim()
        ) {
          if (fishGroup) {
            if (item.group.toLowerCase().includes(fishGroup.toLowerCase())) {
              return item;
            }
          } else if (fishLargeGroup) {
            if (
              item.largeGroup
                .toLowerCase()
                .includes(fishLargeGroup.toLowerCase())
            ) {
              return item;
            }
          } else return item;
        }
      })
      .map((item, index) => {
        return (
          <OptionListItem key={index} onPress={() => setFishProps(item)}>
            <RegularText text={item.commonName} />
          </OptionListItem>
        );
      });
  };

  const handleFishSpeciesInput = (species: string) => {
    setFishSpecies(species);
    const fish = fishes.find((element) => element.scientificName === species);
    if (fish) {
      setFishFamily(fish.family);
    }
  };

  useEffect(() => {
    loadData();
  }, [route.params]);

  //Carregar Grupo (Dropdown)
  const groupList = () => {
    const filteredGroupFishes = data.filter((item) => {
      if (fishLargeGroup) {
        if (
          item.groupName
            .toLowerCase()
            .includes(fishLargeGroup.toLowerCase().trim())
        ) {
          return item;
        }
      } else {
        return item;
      }
    });
    let fishesGroup = filteredGroupFishes.map((item) => item.subGroups);
    fishesGroup = [...new Set(fishesGroup)];
    return fishesGroup[0].map((item, index) => {
      return (
        <OptionListItem
          key={index}
          onPress={() => {
            setFishGroup(item);
            setDropGroup(false);
          }}
        >
          <RegularText text={item} />
        </OptionListItem>
      );
    });
  };

  return (
    <NewFishLogContainer>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView nestedScrollEnabled={true}>
          <ImageContainer>
            {fishPhoto ? (
              <FishLogImage
                source={{ uri: `data:image/png;base64,${fishPhoto}` }}
              />
            ) : (
              <FishLogImage
                source={require("../../assets/selectPicture.png")}
              />
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
            {isSuperAdmin ? (
              <ImageContainer>
                <Switch
                  value={isVisible}
                  onValueChange={() => setIsVisible(!isVisible)}
                />
                <TextClick>Visível no mapa?</TextClick>
              </ImageContainer>
            ) : null}
            <InputView>
              <Input
                placeholder="Nome"
                value={fishName}
                onChangeText={setFishName}
              />
              <InputBox />
            </InputView>
            {fishName &&
            fishes.filter((item) => {
              if (
                item.commonName
                  .toLowerCase()
                  .includes(fishName.toLowerCase().trim()) &&
                item.commonName.toLowerCase() != fishName.toLowerCase().trim()
              ) {
                if (fishGroup) {
                  if (
                    item.group.toLowerCase().includes(fishGroup.toLowerCase())
                  ) {
                    return item;
                  }
                } else if (fishLargeGroup) {
                  if (
                    item.largeGroup
                      .toLowerCase()
                      .includes(fishLargeGroup.toLowerCase())
                  ) {
                    return item;
                  }
                } else return item;
              }
            }).length ? (
              <OptionsContainer>
                <OptionList
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator
                >
                  {nameList()}
                </OptionList>
              </OptionsContainer>
            ) : null}

            {/* <InputView>
              <Input
                placeholder="Espécie"
                value={fishSpecies}
                onChangeText={handleFishSpeciesInput}
              />
              <InputBox />
            </InputView>

            <TouchableOpacity
              onPress={() => setDropLargeGroup(!dropLargeGroup)}
            >
              <InputView>
                <View style={{ marginLeft: 4, width: "95%" }}>
                  {fishLargeGroup ? (
                    <RegularText text={fishLargeGroup ? fishLargeGroup : ""} />
                  ) : (
                    <HalfToneText text="Grande Grupo" />
                  )}
                </View>
                <InputBox />
              </InputView>
            </TouchableOpacity>
            {dropLargeGroup && data.length ? (
              <OptionsContainer>
                <OptionList
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator
                >
                  {data?.map?.((item, index) => (
                    <OptionListItem
                      key={index}
                      onPress={() => {
                        setFishLargeGroup(item.groupName);
                        setDropLargeGroup(false);
                      }}
                    >
                      <RegularText text={item.groupName} />
                    </OptionListItem>
                  ))}
                </OptionList>
              </OptionsContainer>
            ) : null}

            <TouchableOpacity onPress={() => setDropGroup(!dropGroup)}>
              <InputView>
                <View style={{ marginLeft: 4, width: "95%" }}>
                  {fishGroup ? (
                    <RegularText text={fishGroup ? fishGroup : ""} />
                  ) : (
                    <HalfToneText text="Grupo" />
                  )}
                </View>
                <InputBox />
              </InputView>
            </TouchableOpacity>

            {dropGroup &&
            data.filter((item) => {
              if (fishLargeGroup) {
                if (
                  item.groupName
                    .toLowerCase()
                    .includes(fishLargeGroup.toLowerCase().trim())
                ) {
                  return item;
                }
              } else {
                return item;
              }
            }).length ? (
              <OptionsContainer>
                <OptionList
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator
                >
                  {groupList()}
                </OptionList>
              </OptionsContainer>
            ) : null} */}

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
          {isOn ? (
            <AddLocaleButton onPress={handleOpenMap}>
              <AddLocaleButtonIcon name="map" />
              <AddLocaleButtonLabel>
                {" "}
                {fishLatitude && fishLongitude ? "Alterar" : "Adicionar"}{" "}
                Localização{" "}
              </AddLocaleButtonLabel>
            </AddLocaleButton>
          ) : null}

          <SendButtonView>{getSendButton()}</SendButtonView>
        </ScrollView>
      )}
    </NewFishLogContainer>
  );
}
