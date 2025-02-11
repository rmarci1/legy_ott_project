import "../index.css"
import {getUser} from "../api";
import {ChangeEvent, useState} from "react";

export default function Home() {

    const [text, setText] = useState("text");

    const [file, setFile] = useState<string | Blob>("");

    const handleButton = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            console.log(await getUser());
            setText("megnyomva");
        } catch (error) {
            alert(error);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files![0]);
        }
    };

    async function handleSendPic(e: any) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', 'John123');

        const result = await fetch("http://localhost:3000/profiles/adhdjdjdjjf/uploadProfilePic",
            {
                body: formData,
                method: "post",
            });
        console.log(result.body)
    }


    return (
        <>
            <button onClick={handleButton}>nyomas</button>
            <div id="text">{text}</div>
            <form onSubmit={handleSendPic}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <input
                    type="text"
                    placeholder="Description"
                />
                <button type="submit">Upload</button>
            </form>
        </>
    );
}