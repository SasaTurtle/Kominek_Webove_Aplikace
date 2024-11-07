var url = 'http://localhost:3000'
var ws = 'ws://localhost:3001'
var pageUrl = 'http://localhost:5500'

function addTask(taskType) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Prosím, přihlaste se nejdříve.");
        return;
    }

    fetch(url+'/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, task_type: taskType }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Úkol přidán');
            loadTasks(); // Refresh the task list
        }
    })
    .catch(error => console.error('Error:', error));
}


function loadTasks() {

    const socket = new WebSocket(ws);

    // Handle incoming WebSocket messages
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'tasksUpdate') {
            updateTaskList(message.data);
        }
        if(message.type === 'clearTasks'){
            const taskList = document.getElementById('coffeeStat');
            taskList.innerHTML = '';
        }
    };
}
    // Update the task list in the DOM
    function updateTaskList(tasks) {
        const taskList = document.getElementById('coffeeStat');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const item = document.createElement('li');
              item.innerText = `${task.task_description} - Created by ${task.username} at ${task.created_at.substr(0,10)}   `;
              if (!task.is_completed) {
                  const completeButton = document.createElement('button');
                  completeButton.innerText = 'Complete';
                  completeButton.onclick = () => completeTask(task.id);
                  item.appendChild(completeButton);
              } else {
                  item.style.textDecoration = 'line-through';
              }
              taskList.appendChild(item);
        });
    }


function completeTask(taskId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Prosím, přihlaste se nejdříve.");
        return;
    }

    fetch(url+'/complete_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, task_id: taskId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            loadTasks(); // Refresh the task list
            loadMachineStatus(); // Refresh machine status
        }
    })
    .catch(error => console.error('Error:', error));
}

function submitOrder() {
    const espresso = document.getElementById("espresso").value || 0;
    const lungo = document.getElementById("lungo").value || 0;
    const hotWater = document.getElementById("hotWater").value || 0;
    const milk = document.getElementById("milk").value || 0;
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Prosím, přihlaste se nejdříve.");
        return;
    }

    fetch(url+'/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, espresso, lungo, hotWater, milk }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error); // Zobrazit chybovou zprávu
        } else {
            const coffeeItem = document.createElement("li");
            coffeeItem.innerText = "Data úspěšně odeslána.";
            document.getElementById("coffeeSend").appendChild(coffeeItem);
            loadMachineStatus(); // Načíst aktualizovaný stav
        }
    })
    .catch(error => console.error('Error:', error));
}




function getSummary() {
    const token = localStorage.getItem('token');

    fetch(url+`/summary?token=${token}`)
    .then(response => response.json())
    .then(data => {
        const coffeeList = document.getElementById("coffeeList");
        coffeeList.innerHTML = '';
        data.forEach(order => {
            const item = document.createElement("li");
            item.innerText = `Espresso: ${order.espresso}, Lungo: ${order.lungo}, Horká voda: ${order.hotWater}, Mléko: ${order.milk}`;
            coffeeList.appendChild(item);
        });
    })
    .catch(error => console.error('Error:', error));
}

function clearTasks() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Prosím, přihlaste se nejdříve.");
        return;
    }

    fetch(url+'/clear_tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            loadTasks(); // Refresh the task list
        }
    })
    .catch(error => console.error('Error:', error));
}


function loadMachineStatus() {
    const socket = new WebSocket(ws);

    socket.onopen = () => {
        console.log("WebSocket connection for machine status opened");
    };

    // Listen for machine status updates via WebSocket
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'machineStatusUpdate') {
            updateMachineStatusDisplay(message.data);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection for machine status closed");
    };
}

function updateMachineStatusDisplay(status) {
    document.getElementById("milkStatus").innerText = `Mléko: ${status.milk_remaining} ml`;
    document.getElementById("cleaningStatus").innerText = `Počet káv do čištění: ${status.coffee_until_clean}`;
}


function cleanMachine() {
    const token = localStorage.getItem('token');

    fetch(url+'/machine_clean', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    })
    .then(response => response.text())
    .then(data => {
        alert('Kávovar vyčištěn');
        loadMachineStatus();
    })
    .catch(error => console.error('Error:', error));
}

function generateQRCode() {
    const registrationUrl = pageUrl+"/register.html"; // Adjust the port if necessary
    
    fetch(url+'/generate_qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: registrationUrl }),
    })
    .then(response => response.json())
    .then(data => {
        const qrMessage = document.getElementById("qrMessage");
        qrMessage.innerText = 'QR kód a odkaz:';
        qrMessage.style.display = 'block';
        
        // Add QR code image
        const qrImage = document.createElement("img");
        qrImage.src = data.url;
        document.getElementById("coffeeQR").appendChild(qrImage);

        // Add clickable link
        const qrLink = document.createElement("a");
        qrLink.href = registrationUrl;
        qrLink.innerText = registrationUrl;
        qrLink.target = "_blank"; // Open in a new tab
        document.getElementById("coffeeQR").appendChild(qrLink);
    })
    .catch(error => console.error('Error:', error));
}



// Při prvním načtení stránky načti stav kávovaru
document.addEventListener('DOMContentLoaded', (event) => {
    loadMachineStatus();
});
