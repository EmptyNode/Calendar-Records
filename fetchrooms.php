<?php

include 'db_conn.php';

// Create a MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

try {
    // Get the clickedDay from the query parameters
    $clickedDay = $_GET['clickedDay'];

    // Extract day, month, and year from the clickedDay
    list($day, $month, $year) = explode('/', $clickedDay);

    // Format the date as 'YYYY-MM-DD'
    $formattedDate = sprintf('%04d-%02d-%02d', $year, $month, $day);

    // Query to fetch roomnumber and roomtype from roomdetails
    // where arrivaldate does not match clickedDay or there is no corresponding row in the event table
    $query = "SELECT rd.roomnumber, rd.roomtype
              FROM roomdetails rd
              LEFT JOIN guesthousebooking e ON rd.roomnumber = e.roomnumber AND e.arrivaldate = ?
              WHERE e.roomnumber IS NULL OR (e.arrivaldate IS NOT NULL AND e.arrivaldate != ?)";

    // Use prepared statement to prevent SQL injection
    $statement = $conn->prepare($query);

    if ($statement) {
        // Bind the parameters
        $statement->bind_param('ss', $formattedDate, $formattedDate);

        // Execute the statement
        $statement->execute();

        // Get the result set
        $result = $statement->get_result();

        // Fetch data as associative array
        $data = $result->fetch_all(MYSQLI_ASSOC);

        // Prepare the response in JSON format
        $response = [
            'success' => true,
            'data' => $data,
            'message' => 'Data retrieved successfully.'
        ];

        // Output the JSON response
        header('Content-Type: application/json');
        echo json_encode($response);

        // Close the result set
        $result->close();
    } else {
        // If an error occurred in preparing the statement, return an error message
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error preparing the query: ' . $conn->error]);
    }

    // Close the prepared statement
    $statement->close();
} catch (Exception $e) {
    // Handle other exceptions
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
}

// Close the database connection
$conn->close();

?>
