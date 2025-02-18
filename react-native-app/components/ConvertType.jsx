import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';

const ConvertType = ({handleStash,selection,undoStates,handleUndoStates,handleSelection,handleForm,description,stashed}) => {
    const converting = (part) => {
        let temp = undoStates;
        temp.push(description);
        handleUndoStates(temp);
        const selected = selection.start !== selection.end;
        let str = description;
        let convert = "";
        if(selected){
          convert = (selection.start != 0  ? str.substring(0,selection.start) : "") + part + str.slice(selection.start,selection.end) +
          part + (selection.end != description.length - 1 ? str.slice(selection.end) : "");
        }
        else{
          convert = part + (selection.start != 0 ? str.slice(0,selection.start) : "") + part + str.slice(selection.start);
        }
        handleSelection({start: selection.start + 2, end:selection.end + 2});
        handleForm(convert)
      }
  return (
    <View className='flex-row my-4 justify-between'>
      <View className='flex-row'>
                <TouchableOpacity 
                  onPress={() => converting("**")}
                  className='ml-2'
                >
                    <Feather name="bold" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => converting("*")}
                  className='ml-4' 
                >
                  <Feather name="italic" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    let temp = undoStates;
                    temp.push(description);
                    handleUndoStates(temp);
                    const firstNewlineBefore = description.lastIndexOf('\n',selection.start-1);
                    let str = description;
                    let convert = "";
                    if(firstNewlineBefore !== -1){
                        convert = str.slice(0,firstNewlineBefore+1) + 
                        `#${description[firstNewlineBefore == -1 ? 0 : firstNewlineBefore + 1] == "#" ? '' : ' '}` + str.slice(firstNewlineBefore+1);
                    }
                    else{
                      convert = `#${description[firstNewlineBefore == -1 ? 0 : firstNewlineBefore + 1] == "#" ? '' : ' '}` + description
                    }
                    handleForm(convert)
                  }}
                  className='ml-6'
                >
                  <Octicons name="heading" size={24} color="black" />
                </TouchableOpacity>
        </View>
        <View>
            <TouchableOpacity
                onPress={() => {
                    if(undoStates.length == 0){
                        Alert.alert("Hiba","Nem lehet jelenleg visszaállítani")
                    }
                    else{
                        let temp = undoStates;
                        handleForm(temp.pop());
                        if(stashed) handleStash("");
                        handleUndoStates(temp);
                        }
                    }}
            >
                {undoStates.length > 0 ? 
                    <Ionicons name="arrow-undo" size={24} color="black" /> :
                    <Ionicons name="arrow-undo-outline" size={24} color="black" />
                }
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default ConvertType