<?php


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Start the session to manage user states

session_start();



// In-memory storage for user credentials

$users = [];



$users_file = 'users.json';



// Load the users data from the file

function load_users($filename) {

    global $users_file;

    if (file_exists($filename)) {

        $users = json_decode(file_get_contents($filename), true);

        return $users ?? []; // Return an empty array if no users found

    }

    return [];

}



// Save the users data to the file

function save_users($data) {

    global $users_file;

    file_put_contents($data['user'] +".json", json_encode($data));

}





// Handle incoming requests

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {

    case 'POST':

        // Get the request body

        $data = json_decode(file_get_contents("php://input"), true);

        

        // Check if action is provided

        if (!isset($data['user'])) {

            http_response_code(400);

            echo json_encode(['message' => 'Action not specified.']);

            break;

        }



        // Call the appropriate function based on the action

        
        save_users($data);
       
        echo json_encode(['message' => 'Registration successful.']);

        break;



    default:

        http_response_code(405);

        echo json_encode(['message' => 'Method not allowed.']);

        break;

}

?>

			