import React, { useState } from 'react';
import { getCall } from "../script";

const DrinkList = () => {
    const [drinks, setDrinks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [noDataMessage, setNoDataMessage] = useState('');

    const monthList = [];
    const formatter = new Intl.DateTimeFormat('cz', { month: 'long' });
    for (let month = 1; month < 13; month++) {
        const monthName = formatter.format(new Date(2024, month, 0));
        monthList.push({ id: month, name: monthName });
    }

    const getDrinksHandler = (id) => {
        let drinkArray = [];

        getCall("?cmd=getSummaryOfDrinks&month=" + id).then(data => {
            if (data.success && data.data) {
                let hasData = false;
                
                for (const key in data.data) {
                    if (data.data[key]) {
                        hasData = true;
                        const item = data.data[key];
                        drinkArray.push({ jmeno: item[0], typ: item[1], count: item[2] });
                    }
                }
                
                if (!hasData) {
                    setNoDataMessage("No one had coffee this month.");
                } else {
                    setNoDataMessage("");
                }
                setDrinks(drinkArray);
            } else {
                console.log("Chyba: " + data.message);
                setNoDataMessage("No one had coffee this month.");
                setDrinks([]);
            }
        }).catch(err => {
            console.log("Error fetching data: " + err.message);
            setNoDataMessage("Error fetching data.");
            setDrinks([]);
        });
    };

    const handleMonthChange = (e) => {
        const selectedId = parseInt(e.target.value);
        setSelectedMonth(selectedId);
        getDrinksHandler(selectedId);
    };

    return (
        <>
            <select value={selectedMonth} onChange={handleMonthChange}>
                {monthList.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>

            <hr style={{ height: 5 }} />

            {noDataMessage && <p>{noDataMessage}</p>}

            <ul>
                {drinks.map((p, index) => (
                    <li key={index}>
                        {p.jmeno} {p.typ} {p.count}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default DrinkList;
