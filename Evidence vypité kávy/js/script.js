async function getData(URL) {
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('coffe:kafe')
            }
        });

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function postData(URL,formdata) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(formdata),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('coffe:kafe')
            }
        });

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

function getPeopleList() {
    const url = "http://ajax1.lmsoft.cz/procedure.php?cmd=getPeopleList";
    
    getData(url).then(data => {
        const consumptionDiv = document.getElementById('lidi');
        consumptionDiv.innerHTML = '<legend>Select Person</legend>';
        
        for (let key in data){
            if (data.hasOwnProperty(key)) {
                const dataInfo = `<label><input type="radio" name="person" value="${data[key].ID}"> ${data[key].name}</label><br>`;
                 consumptionDiv.innerHTML += dataInfo;
            }
        }
            
    });
}

function getTypesList() {
    const url = "http://ajax1.lmsoft.cz/procedure.php?cmd=getTypesList";
    
    getData(url).then(data => {
        const consumptionDiv = document.getElementById('piti');
        consumptionDiv.innerHTML = '<legend>Select Drink Quantity</legend>';
        
        for (let key in data){
            if (data.hasOwnProperty(key)) {
                const dataInfo = `<label for="${data[key].ID}">${data[key].typ}</label> <input type="range" id="${data[key].ID}" name="${data[key].ID}" min="0" max="10" value="0"><br>`;
                 consumptionDiv.innerHTML += dataInfo;
            }
        }
            
    });
}

function saveDrinks() {
    const url = "http://ajax1.lmsoft.cz/procedure.php?cmd=saveDrinks";
    
    const formData = new FormData(coffeeForm);
    const formJSON = Object.fromEntries(formData.entries());
    console.log(formJSON);

    postData(url,formJSON).then(respose => {
        console.log(respose);
    });
}

function getSummaryOfDrinks(){
    const url = "http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks"

    getData(url).then(data => {
        const consumptionDiv = document.getElementById('consumptionList');
        consumptionDiv.innerHTML = '<h1>Drink consumption:</h1>';
        
        for (let drinks in data){
                const dataInfo = `<li><bold>Piti:</bold> ${data[drinks][0]} | <bold>Mnozstvi:</bold> ${data[drinks][1]} | <bold>Jmeno:</bold> ${data[drinks][2]}</li>`;
                consumptionDiv.innerHTML += dataInfo;
        }
            
    });
}