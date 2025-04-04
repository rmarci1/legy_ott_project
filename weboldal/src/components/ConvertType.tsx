import { FaBold, FaHeading, FaItalic } from "react-icons/fa6";
import { IoArrowUndoOutline, IoArrowUndoSharp } from "react-icons/io5";

/**
 * A `ConvertType` komponens a szövegszerkesztőben alkalmazott formázásokat és visszavonási műveleteket kezeli.
 * A felhasználó formázási opciókat (pl. félkövér, dőlt betű, cím) alkalmazhat a szövegre,
 * illetve visszavonhatja az utolsó változtatást.
 *
 * @param {Function} handleStash - Egy függvény, amely a szöveg mentését végzi.
 * @param {Object} selection - A szövegszerkesztőben kijelölt szöveg kezdő- és végpontjai.
 * @param {Array} undoStates - A szöveges dokumentumban végzett változtatások történetének tárolására szolgáló tömb.
 * @param {Function} handleUndoStates - Egy függvény, amely kezeli a visszavonási állapotok frissítését.
 * @param {Function} handleSelection - A függvény, amely frissíti a kijelölés aktuális pozícióját.
 * @param {Function} handleForm - A szöveg formázásának végrehajtása, amely frissíti a szerkesztett szöveget.
 * @param {string} description - Az aktuálisan szerkesztett szöveg.
 * @param {string} stashed - A mentett szöveg, ha van.
 * @param {string} [iconColor] - Az ikonok színének beállítása (opcionális).
 *
 * @returns {JSX.Element} - A formázásokat kezelő gombokat tartalmazó UI komponenst.
 */

const ConvertType = ({handleStash,selection,undoStates,handleUndoStates,handleSelection,handleForm,description,stashed,iconColor} : 
    {
        handleStash: (text : string) => void, selection: {start: number, end:number}, undoStates: string[], handleUndoStates: (temp : string[]) => void, 
        handleSelection: (data: {start: number, end: number}) => void, handleForm: (text : string) => void,
        description: string, stashed: string, iconColor?: string
    }
) => {

    /**
     * A szöveg formázásához szükséges függvény, amely egy adott formázást alkalmaz a kijelölt szövegre.
     *
     * @param {string} part - A formázás karakterlánca, pl. `**` a félkövérhez.
     */
    const converting = (part : string) => {
        let temp = undoStates;
        temp.push(description); // Elmenti a szöveg aktuális állapotát a visszavonás történetébe.
        handleUndoStates(temp);
        const selected = selection.start !== selection.end; // Ellenőrzi, hogy van-e kijelölt szöveg.
        let str = description;
        let convert = "";
        if(selected){
            // Ha van kijelölt szöveg, akkor a formázás a kijelölt részre kerül.
          convert = (selection.start != 0  ? str.substring(0,selection.start) : "") + part + str.slice(selection.start,selection.end) +
          part + (selection.end != description.length - 1 ? str?.slice(selection.end) : "");
        }
        else{
            // Ha nincs kijelölve szöveg, akkor a teljes szöveghez hozzáadja a formázást.
          convert = part + (selection.start != 0 ? str.slice(0,selection.start) : "") + part + str.slice(selection.start);
        }
        handleSelection({start: selection.start + 2, end:selection.end + 2}); // A formázás után a kijelölés frissítése.
        handleForm(convert) // A szöveg frissítése.
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
                onClick={(e) => {
                    e.preventDefault();
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