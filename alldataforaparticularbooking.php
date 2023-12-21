<?php

include 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Check if the request is made using GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {

    // Extract bookingid from the request
    $bookingId = $_GET['bookingid'];

    // Validate input parameter
    if (!is_numeric($bookingId)) {
        header('Content-Type: application/json');
        die(json_encode(['error' => 'Invalid input parameter']));
    }

    // Use prepared statement to prevent SQL injection
    $sql = "SELECT roomnumber, arrivaldate, departuredate, memname, memphone, memcode, bookingdate 
            FROM guesthousebooking 
            WHERE bookingid = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $bookingId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            $events = array();

            // Fetch each row and add event details to the array
            while ($row = $result->fetch_assoc()) {
                $events[] = $row;
            }

            // Return the events as JSON
            header('Content-Type: application/json');
            echo json_encode(['events' => $events]);
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
} else {
    // Invalid request method
    $response = ["error" => "Invalid request method"];
    echo json_encode($response);
}

// Close the database connection
$conn->close();
?>
