<?php

include 'db_conn.php';
// Check if the form is submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    

    $selectedDate = $_POST["selectedDate"];
    $eventTitle = $_POST["eventTitle"];
    $eventTimeFrom = $_POST["eventTimeFrom"];
    $eventTimeTo = $_POST["eventTimeTo"];
    $formattedDate = date("Y-m-d", strtotime(str_replace("/", "-", $selectedDate)));
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO event (arrivaldate, roomnumber) VALUES (:selected_date, :title)");

        // Bind parameters
        $stmt->bindParam(':selected_date', $formattedDate);
        $stmt->bindParam(':title', $eventTitle);
        // $stmt->bindParam(':time_from', $eventTimeFrom);
        // $stmt->bindParam(':time_to', $eventTimeTo);

        // Execute the statement
        $stmt->execute();

        $response = ["success" => true, "message" => "Event added successfully"];
        echo json_encode($response);
    } catch (PDOException $e) {
        $response = ["success" => false, "message" => "Error: " . $e->getMessage()];
        echo json_encode($response);
    }

    // Close the database connection
    $conn = null;
} else {
    // Invalid request method
    $response = ["success" => false, "message" => "Invalid request method"];
    echo json_encode($response);
}

?>