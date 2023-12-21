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
    $arrivalDate = date("Y-m-d", strtotime(str_replace("/", "-", $clickedDay)));

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO guesthousebooking (roomnumber, arrivaldate, departuredate, memname, memphone, memcode, bookingdate) VALUES (:roomNumber, :arrivalDate, :departureDate, :memberName, :memberPhone, :memberCode, :bookingDate)");

        // Bind parameters
        $stmt->bindParam(':roomNumber', $roomNumber);
        $stmt->bindParam(':departureDate', $departureDate);
        $stmt->bindParam(':memberName', $memberName);
        $stmt->bindParam(':memberPhone', $memberPhone);
        $stmt->bindParam(':memberCode', $memberCode);

        // Loop through dates from arrival date to departure date
        $currentDate = $arrivalDate;
        while (strtotime($currentDate) <= strtotime($departureDate)) {
            $stmt->bindParam(':arrivalDate', $currentDate);
            $stmt->bindParam(':bookingDate', $bookingDate);

            // Execute the statement
            $stmt->execute();

            // Increment the date by one day
            $currentDate = date("Y-m-d", strtotime($currentDate . ' +1 day'));
        }

        $response = ["success" => true, "message" => "Events added successfully"];
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
