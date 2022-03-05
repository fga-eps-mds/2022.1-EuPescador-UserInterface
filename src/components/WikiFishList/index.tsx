import React, { useState } from "react";
import { WikiFishCard, IFish, IFishLog } from "../WikiFishCard";
import { FishCardList } from "./styles";

interface FishListProps {
    fishData: IFishLog[] | IFish[];
    type: "fishWiki" | "fishLog";
    handleNavigation: (id: string) => void;
}

export const WikiFishList = ({ fishData, type, handleNavigation }: FishListProps) => {
    const [fishList, setFishList] = useState([
        fishData[0],
        fishData[1],
        fishData[2],
        fishData[3],
        fishData[4],
        fishData[5],
        fishData[6],
        fishData[7],
        fishData[8],
        fishData[9]
    ]);
    
    const [endPos, setEndPos] = useState(9);
    
    const loadFishData = () => {
        console.log('entrou aqui');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        const initialPos = endPos + 1;
        
        if((endPos + 10) < 117) {
            console.log('oia aqui belezura');
            setEndPos(endPos + 10);
            console.log(endPos);
        } else {
            setEndPos(117);
        }
        
        let response = [];

        for(let i = initialPos; i < endPos + 1; i++) {
            response.push(fishData[i]);
        }
        
        setFishList([...response]);
        for(let i = 0; i < fishList.length; i++) {
            console.log(fishList[i]);
        }

        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('Initial Pos: ', initialPos);
        console.log('End Pos: ', endPos);
        // const response = [
        //         fishData[initialPos],
        //         ...fishData[endPos], 
        // ],
        // const repositories = await response.json();
    
        // setState({
        //   data: [ ...this.state.data, ...fishData[].items ],
        //   endPos: endPos + 9,
        // });
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
                data={fishList}
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
                onEndReached={loadFishData}
                onEndReachedThreshold={0.01}
            />
    );
}