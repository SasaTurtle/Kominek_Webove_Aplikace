import React , { useState} from 'react';
import {getCall} from "../script"


const DrinkList = () => {
    const [drinks, setDrinks] = useState([
        {
          typ: "",
          jmeno:"",
          count:""
        }
      ]);
    var monthList = [];
    const formatter = new Intl.DateTimeFormat('cz', { month: 'long' });
    for(var month=1; month<13 ;month++){
        const monthName = formatter.format(new Date(2024, month, 1));
        monthList.push({id:month,name:monthName})
    }

    const getDrinksHandler = (id) =>{
      var drinkArray = [] 
      
      getCall("?cmd=getSummaryOfDrinks&month="+id).then( data=> {
         
        if(data.success){
         for (const key in data.data) {
            if (data.data.hasOwnProperty(key)) {
                const item = data.data[key];
                drinkArray.push({jmeno: item[0], typ: item[1], count:item[2]});
            }
        }
        setDrinks(drinkArray);
        }else{
            console.log("Chyba:" + data.message);
        }

       })
    }

    return (
        <>
         {
            monthList?.map(function(p) {return (
               <div key={p.id} onClick={() => getDrinksHandler(p.id)}>{p.name}</div> 
            )}
            )
         }
         <hr style={{height: 5}} />
         <ul>
         {
            drinks?.map(function(p) {return (
               <li>{p.jmeno} {p.typ} {p.count}</li>
            )}
            )
         }
         </ul>
        </>
    );
};

export default DrinkList