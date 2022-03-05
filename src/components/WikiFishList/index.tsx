import React, { useState } from "react";
import { WikiFishCard, IFish, IFishLog } from "../WikiFishCard";
import { FishCardList } from "./styles";

interface FishListProps {
    fishData: IFishLog[] | IFish[];
    type: "fishWiki" | "fishLog";
    handleNavigation: (id: string) => void;
}

export const WikiFishList = ({ fishData, type, handleNavigation }: FishListProps) => {
    const state = {
        data: [
            fishData[0],
            fishData[1],
            fishData[2],
            fishData[3],
            fishData[4],
            fishData[5],
            fishData[6],
            fishData[7],
            fishData[8],
            fishData[9],
        ],
    }
    
    const renderItem = ({ item, index } : {item: any, index: number}) => (
        <>
            {type === "fishLog" ?
                (<WikiFishCard
                    fishLog={item as IFishLog}
                    cardFunction={() => { item._id ? handleNavigation(item._id) : handleNavigation(index.toString()) }}
                />) :
                (<WikiFishCard
                    fishWiki={item as IFish}
                    cardFunction={() => { handleNavigation(item._id) }}
                />)
            }
        </>
    );
            
    return (
            <FishCardList
                data={state.data}
                // renderItem={({ item, index }) => (
                //     <>
                //         {type === "fishLog" ?
                //             (<WikiFishCard
                //                 fishLog={item as IFishLog}
                //                 cardFunction={() => { item._id ? handleNavigation(item._id) : handleNavigation(index.toString()) }}
                //             />) :
                //             (<WikiFishCard
                //                 fishWiki={item as IFish}
                //                 cardFunction={() => { handleNavigation(item._id) }}
                //             />)
                //         }
                //     </>
                // )}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
    );
}