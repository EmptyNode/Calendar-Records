<?php

include 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$month = $_GET['month'];
$year = $_GET['year'];

// Validate input parameters
if (!is_numeric($month) || !is_numeric($year)) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Invalid input parameters']));
}

// Construct the start and end dates of the month
$firstDay = sprintf('%04d-%02d-01', $year, $month);
$lastDay = date('Y-m-t', strtotime($firstDay));

// Generate an array with all days of the month
$allDays = range(1, date('t', strtotime($firstDay)));

// Use prepared statements to prevent SQL injection
$sql = "SELECT DAY(arrivaldate) as day, COUNT(roomnumber) as roomCount FROM guesthousebooking WHERE arrivaldate BETWEEN ? AND ? GROUP BY DAY(arrivaldate)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ss", $firstDay, $lastDay);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $roomNumbers = array();

        // Initialize the availability for all days to 0
        foreach ($allDays as $day) {
            $roomNumbers[] = [
                'day' => $day,
                'availability' => 0
            ];
        }

        // Fetch each row and update room number availability in the array
        while ($row = $result->fetch_assoc()) {
            $dayIndex = array_search($row['day'], array_column($roomNumbers, 'day'));
            if ($dayIndex !== false) {
                $roomNumbers[$dayIndex]['availability'] = ($row['roomCount'] > 0) ? 1 : 0;
            }
        }

        // Return the room numbers availability as JSON
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
