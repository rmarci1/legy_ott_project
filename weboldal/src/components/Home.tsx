import "../index.css"
import {getUser} from "../api";
import { useState } from "react";

export default function Home(){

    const [text, setText] = useState("text");

  const handleButton = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      console.log(await getUser()); 
      setText("megnyomva");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <button onClick={handleButton}>nyomas</button>
      <div id="text">{text}</div>
    </>
  );
}