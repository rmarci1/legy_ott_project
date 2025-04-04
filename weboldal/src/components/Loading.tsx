
/**
 * A betöltési animációs komponens, amely egy forgó pörgettyűt jelenít meg.
 * A `div` elem középre van igazítva, és az animáció folyamatos forgást biztosít a pörgettyű számára.
 *
 * @returns {JSX.Element} A betöltési animációval rendelkező JSX elem.
 */
export default function Loading(){
    return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
}