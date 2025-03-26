import { FaBold, FaHeading, FaItalic } from "react-icons/fa6";
import { IoArrowUndoOutline, IoArrowUndoSharp } from "react-icons/io5";

const ConvertType = ({handleStash,selection,undoStates,handleUndoStates,handleSelection,handleForm,description,stashed,iconColor} : 
    {
        handleStash: (text : string) => void, selection: {start: number, end:number}, undoStates: string[], handleUndoStates: (temp : string[]) => void, 
        handleSelection: (data: {start: number, end: number}) => void, handleForm: (text : string) => void,
        description: string, stashed: string, iconColor?: string
    }
) => {
    const converting = (part : string) => {
        let temp = undoStates;
        temp.push(description);
        handleUndoStates(temp);
        const selected = selection.start !== selection.end;
        let str = description;
        let convert = "";
        if(selected){
          convert = (selection.start != 0  ? str.substring(0,selection.start) : "") + part + str.slice(selection.start,selection.end) +
          part + (selection.end != description.length - 1 ? str?.slice(selection.end) : "");
        }
        else{
          convert = part + (selection.start != 0 ? str.slice(0,selection.start) : "") + part + str.slice(selection.start);
        }
        handleSelection({start: selection.start + 2, end:selection.end + 2});
        handleForm(convert)
      }
  return (
    <div className='flex flex-row my-4 justify-between'>
      <div className='flex flex-row'>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); converting("**")
                  }}
                  className='ml-2'
                >
                    <FaBold name="bold" size={24} color={iconColor? iconColor : "black"} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); converting("*")
                  }}
                  className='ml-4' 
                >
                  <FaItalic name="italic" size={24} color={iconColor ? iconColor : "black"} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
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
                  <FaHeading name="heading" size={24} color={iconColor ? iconColor : "black"} />
                </button>
        </div>
        <div>
            <button
                onClick={() => {
                    if(undoStates.length == 0){
                        alert("Nem lehet jelenleg visszaállítani")
                    }
                    else{
                        let temp = undoStates;
                        handleForm(temp.pop()!);
                        if(stashed) handleStash("");
                        handleUndoStates(temp);
                        }
                    }}
            >
                {undoStates.length > 0 ? 
                    <IoArrowUndoSharp name="arrow-undo" size={24} color={iconColor? iconColor : "black"} /> :
                    <IoArrowUndoOutline name="arrow-undo-outline" size={24} color={iconColor ? iconColor : "black"} />
                }
            </button>
        </div>
    </div>
  )
}

export default ConvertType