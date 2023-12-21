<?php

include 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Extract day, month, and year from the request
$day = $_GET['day'];
$month = $_GET['month'];
$year = $_GET['year'];

// Validate input parameters
if (!is_numeric($day) || !is_numeric($month) || !is_numeric($year)) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Invalid input parameters']));
}

// Use prepared statement to prevent SQL injection
$sql = "SELECT bookingid, roomnumber, memname, memphone, departuredate, arrivaldate FROM guesthousebooking WHERE DAY(arrivaldate) = ? AND MONTH(arrivaldate) = ? AND YEAR(arrivaldate) = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("sss", $day, $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $bookingData = array();

        // Fetch each row and add booking ID, room number, memname, and memphone to the array
        while ($row = $result->fetch_assoc()) {
            $bookingData[] = $row;
        }

        // Return the booking data as JSON
        header('Content-Type: application/json');
        echo json_encode(['bookingData' => $bookingData]);
    } else {
        // If an error occurred, return an error message
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error executing the query: ' . $stmt->error]);
    }

    // Close the prepared statement
    $stmt->close();
} else {
    // If an error occurred in preparing the statement, return an error message
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error preparing the query: ' . $conn->error]);
}

// Close the database connection
$conn->close();
?>
