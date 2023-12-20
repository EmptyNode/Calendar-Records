<?php
// Include the file containing the database connection
include 'db_conn.php';

// Check if the form is submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get room number and room type from the POST data
    $roomNumber = isset($_POST["roomNumber"]) ? $_POST["roomNumber"] : '';
    $roomType = isset($_POST["roomType"]) ? $_POST["roomType"] : '';

    // Validate input (you may need to enhance this based on your requirements)
    if (empty($roomNumber) || empty($roomType)) {
        $response = ["success" => false, "message" => "Invalid input data"];
        echo json_encode($response);
        exit(); // Stop execution
    }

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO roomdetails (roomnumber, roomtype) VALUES (:roomNumber, :roomType)");

        // Bind parameters
        $stmt->bindParam(':roomNumber', $roomNumber);
        $stmt->bindParam(':roomType', $roomType);

        // Execute the statement
        $stmt->execute();

        $response = ["success" => true, "message" => "Room added successfully"];
        echo json_encode($response);
    } catch (PDOException $e) {
        $response = ["success" => false, "message" => "Error: " . $e->getMessage()];
        echo json_encode($response);
    } finally {
        // Close the database connection
        $conn = null;
    }
} else {
    // Invalid request method
    $response = ["success" => false, "message" => "Invalid request method"];
    echo json_encode($response);
}
?>
