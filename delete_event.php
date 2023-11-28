<?php
include 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the client-side (JavaScript)
$day = $_POST['day'];
$month = $_POST['month'];
$year = $_POST['year'];
$roomNumber = $_POST['eventTitle'];

// Create formatted date in "YYYY-MM-DD" format
$arrivalday = date("Y-m-d", mktime(0, 0, 0, $month, $day, $year));

// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("DELETE FROM events WHERE arrivalday = ? AND roomnumber = ?");
$stmt->bind_param("ss", $arrivalday, $roomNumber); // Corrected this line

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting event: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
