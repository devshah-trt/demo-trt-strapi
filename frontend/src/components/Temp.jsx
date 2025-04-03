import axios from "axios";
import { useEffect, useState } from "react";

export const Temp=()=>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Flag to track if the component is mounted
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:1337/api/card-infos?filters[isActive][$eq]=true");
                
                // Only update state if component is still mounted
                if (isMounted) {
                    // console.log(res.data.data);
                    const ans=res.data.data.map((item)=>
                    {
                        return item.title
                    });
                    console.log(ans)
                    setData(res.data.data);
                    setLoading(false);
                }
            } catch (err) {
                // Only update state if component is still mounted
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function to run when component unmounts
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array means this effect runs once on mount

    const handleClick=async()=>{
        const res=await axios.get("http://localhost:1337/api/card-infos");
        console.log(res.data.data[0].card_details);
    };
    
    return(
        <div>
            <button onClick={handleClick}>Click</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && (
                <div>
                    <h2>Card Info:</h2>
                    <pre>{JSON.stringify(data[0]?.card_details, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};