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
$sql = "SELECT roomnumber FROM event WHERE DAY(arrivaldate) = ? AND MONTH(arrivaldate) = ? AND YEAR(arrivaldate) = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("sss", $day, $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $roomNumbers = array();

        // Fetch each row and add room number to the array
        while ($row = $result->fetch_assoc()) {
            $roomNumbers[] = $row['roomnumber'];
        }

        // Return the room numbers as JSON
        header('Content-Type: application/json');
        echo json_encode(['roomNumbers' => $roomNumbers]);
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
