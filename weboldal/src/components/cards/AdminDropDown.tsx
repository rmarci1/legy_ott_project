/**
 * `AdminDropDown` komponens, amely egy admin felületen lévő menüpontot reprezentál.
 * A komponens tartalmaz egy gombot, amely kattintásra két funkciót hajt végre:
 * egy űrlapot jelenít meg és egy szűrést végez.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {string} props.title - A gomb szövege (pl. "Szűrés" vagy "Új bejegyzés")
 * @param {function} props.handleForm - Egy függvény, amely egy űrlapot jelenít meg
 * @param {function} props.handleFilter - Egy függvény, amely szűrést hajt végre
 */
export default function AdminDropDown({title,handleForm, handleFilter} : {title : string,handleForm : () => void, handleFilter : () => void}){
    return (
        <li className={`cursor-pointer w-full justify-between hover:bg-gray-300 rounded-md`}>
            <button
            className="px-4 py-2"
            onClick={() => {
                handleForm();
                handleFilter();
            }}
            >
            {title}
            </button>
        </li>
    )
}