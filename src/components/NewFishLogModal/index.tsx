import React, { useState, useEffect } from "react";
import { Modal, Alert } from "react-native";
import { CloseButton, CloseButtonIcon, ModalContainer, ModalDescripton, ModalImage, ModalImageIconContainer, ModalTitle, ModalView, Button } from "./styles";

import { getImage } from "../../utils/getInstructionImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DisableIconButton } from "../DisableIconButton";
import { ModalButton } from "../ModalButton";

interface ModalProps {
    modalVisible: boolean,
    dismissModal: () => void,
    navigation: any;
}


export const NewFishLogModal = ({ modalVisible, dismissModal, navigation }: ModalProps) => {
    const [modalDescriptions, setModalDescriptions] = useState([
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
            animationType="fade"
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
                    <ModalButton text="Sim, conheço" buttonFunction={handleAddLog} type='primary'/>
                    <ModalButton text="Não conheço" buttonFunction={handleAddNoNameLog} type='secondary'/>
                </ModalView>
            </ModalContainer>
        </Modal>
    );
}

