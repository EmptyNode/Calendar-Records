<?php

include 'db_conn.php';

// Set the content type to JSON
header('Content-Type: application/json');  // Line added

// Check if the form is submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $roomnumber = $_POST["roomnumber"];
        $departuredate = $_POST["departuredate"];
        $arrivaldate = $_POST["arrivaldate"];

        // Use a loop to delete rows for each arrival date
        while (strtotime($arrivaldate) <= strtotime($departuredate)) {
            // Prepare SQL statement
            $stmt = $conn->prepare("DELETE FROM guesthousebooking WHERE roomnumber = :roomnumber AND arrivaldate = :arrivaldate");
        
            // Bind parameters
            $stmt->bindParam(':roomnumber', $roomnumber);
            $stmt->bindParam(':arrivaldate', $arrivaldate);
        
            // Execute the statement
            $stmt->execute();
        
            // Increment the date by one day
            $arrivaldate = date("Y-m-d", strtotime($arrivaldate . ' +1 day'));
        }

        $response = ["success" => true, "message" => "Events deleted successfully"];
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
