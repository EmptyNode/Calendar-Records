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
$roomnumber = $_POST['roomNumber'];

// Create formatted date in "YYYY-MM-DD" format
$arrivaldate = sprintf('%04d-%02d-%02d', $year, $month - 1, $day);
echo $arrivaldate;
// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("DELETE FROM event WHERE arrivaldate = ? AND roomnumber = ?");
$stmt->bind_param("ss", $arrivaldate, $roomnumber);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting event: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
