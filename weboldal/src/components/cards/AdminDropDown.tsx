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