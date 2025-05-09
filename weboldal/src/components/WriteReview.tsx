import {FaStar} from "react-icons/fa";
import {toast, ToastContainer} from "react-toastify";
import {useState} from "react";
import {createReview} from "../lib/api.ts";
import {Advertiser} from "../Types/Advertiser.ts";
import {Review} from "../Types/Review.ts";

interface WriteReviewProps {
    advertiser: Advertiser,
    setReviewList: (reviews: Review[] | ((prev: Review[]) => Review[])) => void;
    manuallyAddedReview:  React.MutableRefObject<boolean>;
}
/**
 * A felhasználói értékelés írását lehetővé tevő komponens.
 * A felhasználók ezen keresztül értékelhetik az adott hirdetőt.
 *
 * @component
 * @param {Advertiser} advertiser - Az értékelt hirdető adatai.
 * @param {Function} setReviewList - A hirdető értékeléseinek frissítésére szolgáló függvény.
 * @param {React.MutableRefObject<boolean>} manuallyAddedReview - Ref, amely jelzi, hogy az értékelés manuálisan lett hozzáadva.
 */
export default function WriteReview({advertiser, setReviewList, manuallyAddedReview}: WriteReviewProps){
    // Állapotok a hover, leírás és értékelés kezelésére
    const [hover, setHover] = useState(0);
    const [reviewDesc, setReviewDesc] = useState("");
    const [rating, setRating] = useState(0);

    /**
     * Kezeli a csillagok kiválasztását.
     * Beállítja az aktuális értékelést (csillagszám).
     *
     * @param {number} star - A kiválasztott csillag értéke (1-5).
     */
    const handleClick = (star: number) => {
        setRating(star);
    };

    /**
     * Kezeli az értékelés beküldését.
     * Ha nincs értékelés (rating == 0), akkor értesíti a felhasználót.
     * Beküldi az értékelést a backend API-nak és frissíti a hirdető értékeléseit.
     *
     * @param {React.FormEvent} e - A form beküldésének eseménye.
     */
    const handleReview = async (e: any) => {
        e.preventDefault();
        if(rating == 0){
            toast('Csillagokkal is muszáj érékelni!')
            return;
        }

        await createReview(advertiser.username, reviewDesc, rating).then((res: Review) => {
            manuallyAddedReview.current = true;
            setReviewList((prev) => [...prev, res])
        })


        // Űrlap törlése
        setReviewDesc("")
        setRating(0);
    }

    return <>
        <form className="p-4 bg-blue-200/5 mt-2 rounded-3xl" onSubmit={handleReview}>
            <div>
                <div className="flex flex-row items-center pb-3">
                    <label htmlFor="reviewDesc"
                           className="block text-sm font-medium text-gray-900 dark:text-white">Írjon
                        értékelést!</label>
                    <div className="flex pl-2">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <FaStar
                                    key={index}
                                    size={30}
                                    className="cursor-pointer transition-colors duration-200"
                                    color={starValue <= (hover || rating) ? "gold" : "gray"}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => handleClick(starValue)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col">
                    <input type="text"
                           name="reviewDesc"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           placeholder="pl.: Király volt!"
                           value={reviewDesc}
                           onChange={(e) => {
                               setReviewDesc(e.target.value)
                           }}
                           required/>
                </div>


                <div className="flex flex-row  place-self-end mt-2 p-1 px-2 rounded bg-blue-600/25 w-fit">
                    <button type={"submit"}>
                        Küldés
                    </button>
                </div>
            </div>
            <ToastContainer/>
        </form>
    </>
}