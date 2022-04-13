import React, { FC, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Buffer } from 'buffer';
import { TouchableOpacity } from 'react-native';
import {
  FishCardContainer,
  FishImage,
  CommonNameText,
  ScientificName,
  TextView,
  NoFishImage,
  NoFishImageIcon,
} from './styles';
import { FishWiki } from '../../interfaces/FishWiki';

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

export interface IFishLog {
  _id: string;
  userId: number;
  name: string;
  largeGroup: string;
  group: string;
  species: string;
  coordenates: [number, number][];
  photo: string;
  length: number;
  weight: number;
  reviewed: boolean;
  reviewedBy: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
  deletedAt: Date;
  deletedBy: number;
}

interface IFishCardProps {
  fishWiki?: FishWiki;
  fishLog?: IFishLog;
  cardFunction: VoidFunction;
}

export const WikiFishCard: FC<IFishCardProps> = ({
  fishWiki,
  fishLog,
  cardFunction,
}) => {
  const [image, setImage] = useState<string | null>(null);

  const screenIsFocus = useIsFocused();

  useEffect(() => {
    if (fishLog?.photo) {
      const log64 = Buffer.from(fishLog.photo).toString('base64');
      const base64Img = `data:image/png;base64,${log64}`;
      setImage(base64Img);
      // setImage(fishLog.photo);
    }
    if (fishWiki?.photo) {
      setImage(fishWiki.photo);
    }
  }, [screenIsFocus]);
  return (
    <FishCardContainer onPress={() => {}}>
      <TouchableOpacity onPress={cardFunction}>
        {image ? (
          <FishImage
            source={{
              uri: image,
            }}
            resizeMode="contain"
          />
        ) : (
          <NoFishImage>
            <NoFishImageIcon name="no-photography" />
          </NoFishImage>
        )}
        <TextView>
          <CommonNameText numberOfLines={1}>
            {fishLog ? fishLog.name : fishWiki?.commonName}
          </CommonNameText>
          <ScientificName numberOfLines={1}>
            {fishLog ? fishLog.species : fishWiki?.scientificName}
          </ScientificName>
        </TextView>
      </TouchableOpacity>
    </FishCardContainer>
  );
};
