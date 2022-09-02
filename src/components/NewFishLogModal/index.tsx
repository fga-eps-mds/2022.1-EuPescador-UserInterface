import React, { useState, useEffect } from "react";
import { Modal, Alert } from "react-native";
import { CloseButton, CloseButtonIcon, ModalContainer, ModalDescripton, ModalImage, ModalImageIconContainer, ModalTitle, ModalView, Button } from "./styles";

import { getImage } from "../../utils/getInstructionImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DisableIconButton } from "../DisableIconButton";
import { DefaultButton } from "../Button";

interface ModalProps {
    modalVisible: boolean,
    dismissModal: () => void,
    navigation: any;
}


export const NewFishLogModal = ({ modalVisible, dismissModal, navigation }: ModalProps) => {
    const [modalDescriptions, setModalDescriptions] = useState([
        "Vamos registrar um novo peixe!\n\n",
        "Você conhece o nome científico do peixe que pescou?\n\n",
    ]);

    const handleAddLog = async () => {
        navigation.navigate(
          "NewFishLog" as never,
          {
            isNewRegister: true,
            name: "Novo Registro",
          } as never
        );
        dismissModal();
      };

    const handleAddNoNameLog = async () => {
    navigation.navigate(
        "NewNoNameFishLog" as never,
        {
        isNewRegister: true,
        name: "Novo Registro",
        } as never
    );
    dismissModal();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={dismissModal}>
            <ModalContainer>
                <ModalView>
                    <CloseButton onPress={dismissModal}>
                        <CloseButtonIcon name="close" />
                    </CloseButton>
                    <ModalTitle>
                        Novo Registro
                    </ModalTitle>
                    <ModalDescripton>
                        {modalDescriptions}
                    </ModalDescripton>
                    <DefaultButton text="Sim, conheço" buttonFunction={handleAddLog} />
                    <DefaultButton text="Não conheço" buttonFunction={handleAddNoNameLog} />
                </ModalView>
            </ModalContainer>
        </Modal>
    );
}

