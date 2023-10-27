import React from "react";
import ReactLoading from 'react-loading';


const Loading = () => {
    return (
        <div className="absolute top-0 flex mx-14 md:mx-64 mt-64">
            <ReactLoading  type={"bars"} color={'blue'} height={667} width={375} />
        </div>
    )
}


export default Loading;