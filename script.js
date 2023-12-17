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
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

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
        if (data.roomNumbers !== null && data.roomNumbers.length > 0) {
          const roomNumbersHTML = data.roomNumbers.map((roomNumber) => `
            <div class="event">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">Room Number: ${roomNumber}</h3>
              </div>
              <div class="delete-container">
                <div class="delete-icon" onclick="deleteEvent(${date}, ${month + 1}, ${year}, '${roomNumber}')">
                  <i class="fas fa-trash"></i>
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







addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});


//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});



addEventSubmit.addEventListener("click", () => {
  console.log("Add Event button clicked");

  // Validate the form fields
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }

  // Your existing time validation code...

  // Create a FormData object to send data in the POST request
  const formData = new FormData();
  formData.append("eventTitle", eventTitle);
  formData.append("eventTimeFrom", eventTimeFrom);
  formData.append("eventTimeTo", eventTimeTo);

  // Append the selected date to the FormData
  formData.append(
    "selectedDate",
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
        // Event added successfully
        // Add the "has-event" class to the selected date's element
        const selectedDateElement = document.querySelector(`.day[data-day="${activeDay}"]`);
        if (selectedDateElement) {
          selectedDateElement.classList.add("bigText");
        }

        // Update the eventsArr with the new event
        const newEvent = {
          title: eventTitle,
          time: eventTimeFrom + " - " + eventTimeTo,
        };
        let eventAdded = false;
        if (eventsArr.length > 0) {
          eventsArr.forEach((item) => {
            if (
              item.day === activeDay &&
              item.month === month + 1 &&
              item.year === year
            ) {
              item.events.push(newEvent);
              eventAdded = true;
            }
          });
        }

        if (!eventAdded) {
          eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
          });
        }
        updateEvents(activeDay);
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
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
});

// ... (your existing code)




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

function deleteEvent(day, month, year, roomNumber) {
  // Prompt the user for confirmation before deleting the event
  const confirmDelete = confirm("Are you sure you want to delete this event?");
  
  if (!confirmDelete) {
    return; // Do nothing if the user cancels the deletion
  }

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Set up the request
  xhr.open("POST", "delete_event.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // Define the callback function to handle the response
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = xhr.responseText.trim();
        console.log("Server response:", data);
        if (data === 'success') {
          // Event deleted successfully

          // Call the callback function if provided
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          // Event deletion failed
          alert("Error deleting event. Please try again.");
        }
      } else {
        // Handle errors here (e.g., network issues)
        console.error("Error deleting event:", xhr.status, xhr.statusText);
      }
    }
  };

  // Create the request body with URL-encoded parameters
  const requestBody = `day=${day}&month=${month + 1}&year=${year}&roomNumber=${roomNumber}`;

  // Send the request
  xhr.send(requestBody);
  location.reload();
}



