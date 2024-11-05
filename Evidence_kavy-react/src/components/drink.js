import React , { useState} from 'react';

function Drink({id, typ}) {
    const [counter, setCounter] = useState(0);

    function handleCounter(event) {
        setCounter(parseInt(event.target.value));
    }
    
    return (
        <>
         <label for={id}>{typ}</label>&nbsp;<b>{counter}</b>&nbsp;
         <input type="range" name={"type[" + id + "]"} defaultValue={counter} min="0" max="10" onChange={handleCounter} />
         <br></br>
        </>
    );
};

export default Drink