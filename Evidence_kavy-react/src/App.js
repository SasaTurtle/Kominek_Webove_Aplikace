import React , { useState, useEffect } from 'react';
import './App.css';
import {getCall, postCall, serialize, validate} from "../src/script"
import Person  from './components/person';
import Drink from './components/drink';
import DrinkList from './components/drinklist';
function App() {

  const [people, setPeople] = useState([
    {
      id: "0",
      name: ""
    }
  ]);
  const [drinks, setDrinks] = useState([
    {
      id: "0",
      typ: ""
    }
  ]);

  function saveHandler(){
    const form = document.querySelector('form');
    const params = serialize(form);//new FormData(form);
    console.log(params);
    if (!validate(params)){
      alert("Vyber pijana");
      return;
    }
    postCall("?cmd=saveDrinks",params).then(data => {  
      if(data.success){
        alert("Uloženo");
      }else{
        alert("Chyba ukládání " + data.message);
      }
  })
  }


  useEffect(() => {
   
    getCall("?cmd=getPeopleList").then(data => {
      //p5episuju data do JSON array tak jak to mělo přijít z API
      var peopleArray =[];
      if(data.success){
          for (const key in data.data) {
              if (data.data.hasOwnProperty(key)) {
                  const item = data.data[key];
                  peopleArray.push({id: item.ID, name: item.name});
              }
          }
          setPeople(peopleArray);
      }else{
          console.log("Nějaký problém: "  + data.message);
      }
    })

    //calling drinks
    getCall("?cmd=getTypesList").then(data => {
        //p5episuju data do JSON array tak jak to mělo přijít z API
        var drinkArray =[];
        if(data.success){
            for (const key in data.data) {
                if (data.data.hasOwnProperty(key)) {
                    const item = data.data[key];
                    drinkArray.push({id: item.ID, typ: item.typ});
                }
            }
            setDrinks(drinkArray);
        }else{
            console.log("Nějaký problém: "  + data.message);
        }
    })

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <form id="form">
          {
            people?.map(function(p) {return (
               <div key={p.id}>
                  <Person name={p.name} id={p.id} />
                 
               </div> 
              );
          }
        )}

        {
         drinks?.map(function(d) {return (
               <div key={d.id}>
                  <Drink typ={d.typ} id={d.id} />
                 
               </div> 
              );
          }
        )}
        <button type="button" onClick={saveHandler}>Odeslat</button>
        </form>

        <DrinkList />

      </header>
    </div>
  );
}

export default App;
