const calendar = document.querySelector(".calendar"),
date = document.querySelector(".date"),
daysContainer = document.querySelector(".days"),
prev = document.querySelector(".prev"),
next = document.querySelector(".next"),
todayBtn = document.querySelector(".today-btn"),
gotoBtn = document.querySelector(".goto-btn"),
dateInput = document.querySelector(".date-input"),
eventDay = document.querySelector(".event-day"),
eventDate = document.querySelector(".event-date"),
eventsContainer = document.querySelector(".events"),
addEventBtn = document.querySelector(".add-event"),
addEventWrapper = document.querySelector(".add-event-wrapper "),
addEventCloseBtn = document.querySelector(".close "),

  // addEventTitle = document.querySelector(".event-name "),
  // addEventFrom = document.querySelector(".event-time-from "),
  // addEventTo = document.querySelector(".event-time-to "),

addEventSubmit = document.querySelector(".add-event-btn");
addRoomBtn = document.querySelector('.add-room-btn');
selectRoom = document.querySelector('.select-room');
// const clickedSelect = document.querySelectorAll(".calendar .days .day");
// console.log(clickedSelect);


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const eventsArr = [];


async function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  // Create an array of days in the current month
  const daysInMonth = Array.from({ length: lastDate }, (_, index) => index + 1);

  // Fetch room numbers for the entire month
  const roomNumbersAvailable = await hasRoomNumbers(daysInMonth);


  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const dayAvailability = roomNumbersAvailable.find((item) => item.day === i)?.availability || 0;
  
    const roomNumbersAvailableForDay = dayAvailability === 1 ? " bigText" : "";
    let event = false;
    let eventClass = '';
  
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
  
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        eventClass = 'today active event';
      } else {
        eventClass = 'today active';
      }
    } else {
      if (event) {
        eventClass = 'event';
      }
    }
  
    // Check if there is a single event for the day
    if (roomNumbersAvailableForDay.length === 1) {
      eventClass += ' ${roomNumbersAvailableForDay}'; // Add a specific class for room number availability
    }
  
    days += `<div class="day ${eventClass}${roomNumbersAvailableForDay}" data-day="${i}">${i}</div>`;
  }
  

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListener();
}


async function hasRoomNumbers() {
  const fetchURL = `fetch_events.php?month=${month + 1}&year=${year}`;

  try {
    const response = await fetch(fetchURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.roomNumbers || {};
  } catch (error) {
    console.error('Error fetching events:', error);
    return {};
  }
}



function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const selectedDay = e.target.innerHTML;
      
      // Update the global month and year variables
      month = month;
      year = year;
      
      getActiveDay(selectedDay);
      updateEvents(Number(selectedDay));
      activeDay = Number(selectedDay);
      
      // Remove active from all days
      days.forEach((day) => {
        day.classList.remove("active");
      });
      
      // If clicked prev-date or next-date, switch to that month
      if (e.target.classList.contains("prev-date") || e.target.classList.contains("next-date")) {
        initCalendar();
      } else {
        // Add active to the clicked day
        e.target.classList.add("active");
      }
    });
  });
}


todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}


function updateEvents(date) {
  // Clear the events container
  eventsContainer.innerHTML = '';

  // Fetch events for the selected date
  const fetchURL = `fetcheventsforparticulardate.php?day=${date}&month=${month + 1}&year=${year}`;

  fetch(fetchURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.error('Error fetching events:', data.error);
        // Handle error, e.g., display an error message
      } else {
        // Display each room number individually
        console.log(data);
        if (data.bookingData !== null && data.bookingData.length > 0) {
          const roomNumbersHTML = data.bookingData.map((booking) => `
            <div class="event">
              <div class="event-container" >
                <div onclick="showEventDetails(${date}, ${month + 1}, ${year}, '${booking.roomnumber}', '${booking.bookingid}')">
                  <div class="title" >
                  <i class="fas fa-circle"></i>
                  <h3 class="event-title">Room Number: ${booking.roomnumber}</h3>
                  <h3 class="event-title">Member Name: ${booking.memname}</h3>
                  <h3 class="event-title">Contact No: ${booking.memphone}</h3>
                  <h3 class="event-title">Contact No: ${booking.arrivaldate}</h3>
                </div>
                </div>

                <div class="delete-container">
                  <div class="delete-icon">
                    <i class="fas fa-trash" onclick="deleteEvent('${booking.arrivaldate}', '${booking.roomnumber}', '${booking.departuredate}')"></i>
                  </div>
                </div>
              </div>
            </div>
          `).join('');

          eventsContainer.innerHTML = roomNumbersHTML;
        } else {
          // If no room numbers found, display an appropriate message
          eventsContainer.innerHTML = `<div class="no-event">
            <h3>No Room Numbers Available</h3>
          </div>`;
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
      // Handle error, e.g., display an error message
    });
}


function showEventDetails(date, month, year, roomNumber, bookingid) {
  // Fetch event details using another API endpoint or method
  const memberDetailsURL = `alldataforaparticularbooking.php?day=${date}&month=${month + 1}&year=${year}&roomNumber=${roomNumber}&bookingid=${bookingid}`;

  fetch(memberDetailsURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.events && data.events.length > 0) {
        const eventDetails = data.events[0]; // Assuming there's only one event in the array
        console.log(eventDetails);
        alert(`Event Details\nRoom Number: ${roomNumber}\nArrival Date: ${eventDetails.arrivaldate}\nDeparture Date: ${eventDetails.departuredate.slice(0, 10)}\nMember Name: ${eventDetails.memname}\nMember Code: ${eventDetails.memphone}\nMember Code: ${eventDetails.memcode}\nBooking Date: ${eventDetails.bookingdate.slice(0, 10)}`);
      } else {
        // Handle case where no events are returned
        console.error('No event details found');
        alert('No event details found');
      }
    })
    .catch((error) => {
      console.error('Error fetching event details:', error);
      // Handle error, e.g., display an error message
    });
}






addEventBtn.addEventListener("click", async () => {
  addEventWrapper.classList.toggle("active");
  const roomDetails = await fetchRoomsAndTypes();
  // console.log(roomDetails);
  updateSelectRooms(roomDetails);
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

addRoomBtn.addEventListener('click', async function () {
  // Get the entered room number and room type
  let newRoomNumber;
  do {
    const roomNumberInput = prompt('Enter Room Number');

    // Check if the user clicked "Cancel"
    if (roomNumberInput === null) {
      return; // Cancel the operation
    }

    newRoomNumber = parseInt(roomNumberInput);

    if (isNaN(newRoomNumber)) {
      alert('Please enter a valid integer for the room number.');
    }
  } while (isNaN(newRoomNumber));

  const newRoomType = prompt('Enter Room Type');

  if (newRoomType !== null) {
    try {
      // Add the new room
      const response = await fetch('addroom.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'roomNumber=' + encodeURIComponent(newRoomNumber) + '&roomType=' + encodeURIComponent(newRoomType),
      });

      const data = await response.text();
      console.log(data); // Display response from the PHP script

      // Fetch and update rooms and room types
      const roomDetails = await fetchRoomsAndTypes();
      console.log(roomDetails);
      updateSelectRooms(roomDetails);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});


// Function to fetch and update rooms and room types
async function fetchRoomsAndTypes() {
  try {
    var day1 = activeDay;
    var month1 = month+1;
    var year1 = year;
    const queryString = `?clickedDay=${day1}/${month1}/${year1}`;
    const response = await fetch(`fetchrooms.php${queryString}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      const rooms = data.data;
      return data;
    } else {
      console.error('Error fetching data:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}


function updateSelectRooms(roomDetails) {
  // Clear existing options
  selectRoom.innerHTML = '';

  // Check if the data retrieval was successful
  if (roomDetails.success && roomDetails.data) {
    // Iterate through the data and add options to the select element
    roomDetails.data.forEach(room => {
      const option = document.createElement('option');
      option.value = room.roomnumber;
      option.text = `${room.roomtype} - ${room.roomnumber}`;
      selectRoom.appendChild(option);
    });
  } else {
    // Handle the case where data retrieval was not successful
    console.error('Error retrieving room details:', roomDetails.message);
  }
}





addEventSubmit.addEventListener("click", () => {
    console.log("Add Event button clicked");

    const roomNumber = document.getElementById("roomNumber").value;
    console.log(roomNumber + "hello bello");
    let bookingDate = document.getElementById("bookingDate").value;
    let departureDate = document.getElementById("departureDate").value;
    const memberPhone = document.querySelector(".member-phone[placeholder='Member Phone']").value;
    const memberCode = document.querySelector(".member-code[placeholder='Member Code']").value;
    const memberName = document.querySelector(".member-name[placeholder='Member Name']").value;

    if (bookingDate === "" || departureDate === "" || memberName === "" || memberPhone === "" || memberCode === "") {
      alert("Please fill all the fields");
      return;
    }

    // Your existing time validation code...

    // Create a FormData object to send data in the POST request
    const formData = new FormData();
    formData.append("roomNumber", roomNumber);
    formData.append("bookingDate", bookingDate);
    formData.append("departureDate", departureDate);
    formData.append("memberName", memberName);
    formData.append("memberPhone", memberPhone);
    formData.append("memberCode", memberCode);

    // Append the selected date to the FormData
    formData.append(
      "clickedDay",
      activeDay + "/" + (month + 1) + "/" + year
    );

    // Make a POST request to the server
    fetch("add_events.php", {
      method: "POST",
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server response:", data);
      if (data.success) {
        addEventWrapper.classList.remove("active");
        initCalendar();

        // clickedSelect.classList.add('bigtext');
      } else {
        // Event addition failed
        alert("Error adding event: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error submitting the event:", error);
      // Optionally, display an error message to the user
    });

    // Clear the form fields
    document.getElementById("roomNumber").value="";
    document.getElementById("bookingDate").value="";
    document.getElementById("departureDate").value="";
    document.querySelector(".member-phone[placeholder='Member Phone']").value="";
    document.querySelector(".member-code[placeholder='Member Code']").value="";
    document.querySelector(".member-name[placeholder='Member Name']").value="";
  
});



function formatDate(rawDate) {
  const date = new Date(rawDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}`;
}




function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

// function deleteEvent(day, month, year, roomNumber) {
//   // Prompt the user for confirmation before deleting the event
//   const confirmDelete = confirm("Are you sure you want to delete this event?");
  
//   if (!confirmDelete) {
//     return; // Do nothing if the user cancels the deletion
//   }

//   // Create a new XMLHttpRequest object
//   const xhr = new XMLHttpRequest();

//   // Set up the request
//   xhr.open("POST", "delete_event.php", true);
//   xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

//   // Define the callback function to handle the response
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       if (xhr.status === 200) {
//         const data = xhr.responseText.trim();
//         console.log("Server response:", data);
//         if (data === 'success') {
//           // Event deleted successfully
//           // ... (rest of your code)
//         } else {
//           // Event deletion failed
//           alert("Error deleting event. Please try again.");
//         }
//       } else {
//         // Handle errors here (e.g., network issues)
//         console.error("Error deleting event:", xhr.status, xhr.statusText);
//       }
//     }
//   };

//   // Create the request body with URL-encoded parameters
//   const requestBody = `day=${day}&month=${month + 1}&year=${year}&roomNumber=${roomNumber}`;

//   // Send the request
//   xhr.send(requestBody);

// }

async function deleteEvent(arrivaldate, roomnumber, departuredate) {
  const confirmDelete = confirm("Are you sure you want to delete this event?");
  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch("delete_event.php", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: `arrivaldate=${arrivaldate}&roomnumber=${roomnumber}&departuredate=${departuredate}`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Server response:", responseData);

    if (responseData.success) {
      // Event deleted successfully
      alert("Event deleted successfully.");

      // Update the calendar after successful deletion
      month = month; // Retain the current month
      year = year; // Retain the current year
      initCalendar();
    } else {
      // Event deletion failed
      alert(`Error deleting event. Please try again. Server message: ${responseData.message}`);
    }
  }catch (error) {
    console.error("Error deleting event:", error.message);
  
    // Log the entire response to understand the issue
    console.log("Full response:", await response.text());
  }
  
}







