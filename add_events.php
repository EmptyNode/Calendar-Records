<?php

include 'db_conn.php';

// Check if the form is submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $roomNumber = $_POST["roomNumber"];
    $bookingDate = $_POST["bookingDate"];
    $departureDate = $_POST["departureDate"];
    $memberName = $_POST["memberName"];
    $memberPhone = $_POST["memberPhone"];
    $memberCode = $_POST["memberCode"];
    $clickedDay = $_POST["clickedDay"];

    $arrivaldate = date("Y-m-d", strtotime(str_replace("/", "-", $clickedDay)));

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO event (roomnumber, arrivaldate, departuredate, memname, memphone, memcode, bookingdate) VALUES (:roomNumber, :arrivalDate, :departureDate, :memberName, :memberPhone, :memberCode, :bookingDate)");

        // Bind parameters
        $stmt->bindParam(':roomNumber', $roomNumber);
        $stmt->bindParam(':arrivalDate', $arrivaldate);
        $stmt->bindParam(':departureDate', $departureDate);
        $stmt->bindParam(':memberName', $memberName);
        $stmt->bindParam(':memberPhone', $memberPhone);
        $stmt->bindParam(':memberCode', $memberCode);
        $stmt->bindParam(':bookingDate', $bookingDate);

        // Execute the statement
        $stmt->execute();

        $response = ["success" => true, "message" => "Event added successfully"];
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
