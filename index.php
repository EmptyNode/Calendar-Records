<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Stay organized with our user-friendly Calendar featuring events, reminders, and a customizable interface. Built with HTML, CSS, and JavaScript. Start scheduling today!"
    />
    <meta
      name="keywords"
      content="calendar, events, reminders, javascript, html, css, open source coding"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
      integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="style.css" />
    <title>Calendar with Events</title>
  </head>
  <body>
    <div class="container">
      <div class="left">
        <div class="calendar">
          <div class="month">
            <i class="fas fa-angle-left prev"></i>
            <div class="date">december 2015</div>
            <i class="fas fa-angle-right next"></i>
          </div>
          <div class="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div class="days"></div>
          <div class="goto-today">
            <div class="goto">
              <input type="text" placeholder="mm/yyyy" class="date-input" />
              <button class="goto-btn">Go</button>
            </div>
            <button class="today-btn">Today</button>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="today-date">
          <div class="event-day">wed</div>
          <div class="event-date">12th december 2022</div>
        </div>
        <div class="events"></div>
        <div class="add-event-wrapper">
          <div class="add-event-header">
            <div class="title">Book Room</div>
            <i class="fas fa-times close"></i>
          </div>
            <div class="add-event-body">
              <div class="add-event-input">
                <input type="text" placeholder="Room No" class="event-name" />
              </div>
              <div class="add-event-input">
                <input placeholder="Booking Date" class="textbox-n" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="bookingDate" />
              </div>
              <div class="add-event-input">
                <input placeholder="Departure Date" class="textbox-n" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="departureDate" />
              </div>
              <div class="add-event-input">
                <input type="text" placeholder="Member Name" class="event-name" id="memberName"/>
              </div>
              <div class="add-event-input">
                <input type="text" placeholder="Member Phone" class="event-name" id="memberPhone"/>
              </div>
              <div class="add-event-input">
                <input type="text" placeholder="Member Code" class="event-name" id="memberCode"/>
              </div>
            </div>
            <div class="add-event-footer">
              <button class="add-event-btn">Book</button>
            </div>
        </div>
      </div>
      <button class="add-event">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    
    <script src="script.js"></script>
  </body>
</html>
