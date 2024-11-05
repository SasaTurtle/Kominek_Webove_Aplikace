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


// Directory where the uploaded images will be stored
$targetDir = "users/";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Check if the directory exists, if not, create it
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Check if a file was uploaded
    if (!empty($_FILES["image"]["name"])) {
        $fileName = basename($_FILES["image"]["name"]);
        $targetFilePath = $targetDir . $fileName;

        // Check if the file is a valid image
        $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $validExtensions = ['jpg', 'jpeg', 'png'];

        if (in_array($imageFileType, $validExtensions)) {
            // Move the uploaded file to the target directory
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
                echo json_encode(["success" => true, "message" => "Image uploaded successfully.", "file" => $targetFilePath]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to upload image."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid file type. Only JPG, JPEG, and PNG are allowed."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No file uploaded."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

?>
