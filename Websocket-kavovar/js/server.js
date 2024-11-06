const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3001;
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' blob: data:; script-src 'self'; style-src 'self'");
    next();
});


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'coffee_tracker'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

let lastFetchTime = new Date(0);

const checkForNewTasks = () => {
    const query = `
        SELECT tasks.task_description, users.username,tasks.created_at, tasks.id FROM tasks
        inner join users on users.id = tasks.user_id
        ORDER BY created_at DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return;
        }

        if (results.length > 0) {
            // Send the entire tasks list to all WebSocket clients
            const message = JSON.stringify({ type: 'tasksUpdate', data: results });
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });
};

setInterval(checkForNewTasks, 1000);

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    ws.on('close', () => console.log('WebSocket client disconnected'));
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/add_task', (req, res) => {
    const { token, task_type } = req.body;
    if (!token) return res.status(401).json({ error: 'Token must be provided' });

    const predefinedTasks = {
        'milk': 'Je potřeba koupit mléko',
        'clean': 'Je potřeba vyčistit kávovar'
    };

    const taskDescription = predefinedTasks[task_type];

    if (!taskDescription) {
        return res.status(400).json({ error: 'Invalid task type' });
    }

    try {
        const user = jwt.verify(token, 'secretkey');
        db.query('INSERT INTO tasks (user_id, task_description) VALUES (?, ?)', [user.id, taskDescription], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Task added', taskId: result.insertId });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
});



app.post('/complete_task', (req, res) => {
    const { token, task_id } = req.body;
    if (!token) return res.status(401).json({ error: 'Token must be provided' });

    try {
        const user = jwt.verify(token, 'secretkey');
        db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [task_id, user.id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(403).json({ error: 'Task not found or user not authorized' });
            }

            const taskDescription = results[0].task_description;

            db.query('UPDATE tasks SET is_completed = TRUE WHERE id = ?', [task_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (taskDescription === 'Je potřeba vyčistit kávovar') {
                    db.query('UPDATE machine_status SET coffee_until_clean = 20, last_cleaned = NOW() WHERE id = 1', (err, result) => {
                        if (err) throw err;
                        res.json({ message: 'Task completed and machine cleaned' });
                    });
                } else if(taskDescription === 'Je potřeba koupit mléko') {
                    db.query('UPDATE machine_status SET milk_remaining = 20000 WHERE id = 1', (err, result) => {
                        if (err) throw err;
                        res.json({ message: 'Task completed and machine refilled with milk'});
                    });
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
});


// Function to fetch all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT tasks.*, users.username FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});


app.post('/clear_tasks', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Token must be provided' });

    try {
        const user = jwt.verify(token, 'secretkey');
        db.query('DELETE FROM tasks WHERE is_completed = TRUE', (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Completed tasks cleared' });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
});



app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // If email does not exist, proceed with registration
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Generate a token
            const token = jwt.sign({ id: result.insertId }, 'secretkey', { expiresIn: '1h' });
            res.json({ message: 'User registered', token });
        });
    });
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) throw err;
        if (result.length && bcrypt.compareSync(password, result[0].password)) {
            const token = jwt.sign({ id: result[0].id }, 'secretkey', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    });
});

app.post('/order', (req, res) => {
    const { token, espresso, lungo, hotWater, milk } = req.body;
    if (!token) return res.status(401).json({ error: 'Token must be provided' });

    try {
        const user = jwt.verify(token, 'secretkey');

        checkMachineStatus((err, status) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (milk > status.milk_remaining) {
                return res.status(400).json({ error: 'Not enough milk in the machine' });
            }

            db.query('INSERT INTO orders (user_id, espresso, lungo, hotWater, milk) VALUES (?, ?, ?, ?, ?)', [user.id, espresso, lungo, hotWater, milk], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                updateMachineStatus(milk);
                res.json({ message: 'Order placed' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
});




app.get('/summary', (req, res) => {
    const { token } = req.query;
    const user = jwt.verify(token, 'secretkey');
    db.query('SELECT * FROM orders WHERE user_id = ?', [user.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

function checkMachineStatus(callback) {
    db.query('SELECT milk_remaining, coffee_until_clean FROM machine_status ORDER BY id DESC LIMIT 1', (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return callback({ error: 'Internal server error' });
        }
        if (result.length === 0) {
            console.log('No status found in database');
            return callback({ error: 'No status found' });
        }
        console.log('Machine status result:', result[0]);
        callback(null, result[0]);
    });
}


app.get('/machine_status', (req, res) => {
    db.query('SELECT * FROM machine_status ORDER BY id DESC LIMIT 1', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(result[0]);
    });
});


app.post('/machine_clean', (req, res) => {
    const { token } = req.body;
    const user = jwt.verify(token, 'secretkey');
    db.query('UPDATE machine_status SET coffee_until_clean = 20, last_cleaned = NOW() WHERE id = 1', (err, result) => {
        if (err) throw err;
        res.send('Machine cleaned');
    });
});

app.post('/generate_qr', (req, res) => {
    const { text } = req.body;
    QRCode.toDataURL(text, (err, url) => {
        if (err) throw err;
        res.json({ url });
    });
});

function updateMachineStatus(usedMilk) {
    db.query('UPDATE machine_status SET milk_remaining = milk_remaining - ?, coffee_until_clean = coffee_until_clean - 1 WHERE id = 1', [usedMilk], (err, result) => {
        if (err) throw err;
    });
}

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
