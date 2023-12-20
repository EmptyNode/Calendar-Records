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
    // Query to fetch roomtype and roomnumber from the roomdetails table
    $query = "SELECT roomtype, roomnumber FROM roomdetails";

    // Use prepared statement to prevent SQL injection
    $statement = $conn->prepare($query);

    if ($statement) {
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
