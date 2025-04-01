import axios from "axios";

export const Temp=()=>{
    const handleClick=async()=>{
        const res=await axios.get("http://localhost:1337/api/card-infos");
        console.log(res.data.data[0].card_details)
    }
    return(
        <div>
            <button onClick={handleClick}>Click</button>
        </div>
    )
}