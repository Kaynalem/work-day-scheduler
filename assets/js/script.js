function loadTasks(key) {
    let value = localStorage.getItem(key);
    if (value) {
        $(`#text${key}`).text(value);
    } 
}

// display today's date in header
var date = moment().format("dddd, MMMM Do YYYY");

var displayDate = $("#currentDay");
    displayDate.html(date);
    
// build scheduler layout
$(document).ready(function() {
    for (let i = 8; i < 21; i++) {
    
        // create a schedule row
        var row = $(`<div data-time=${i} id='${i}' class="row time-block past">`);

        // create time column
        var colTime = $('<div class="col-md-1 hour">' + displayHours(i) + '</div>');

        //create event column
        var colTask = $(`<textarea id=text${i} class="col-md-10 description"></textarea>`);        
    
        //create save column
        var colSave = $(`<button class="btn saveBtn col-md-1" id=${i}><span class="fas fa-save"></span></button>`)
        
        // append columns to row
        row.append(colTime);
        row.append(colTask);
        row.append(colSave);

        // add rows to container
        $(".container").append(row);

        loadTasks(i);
    }

    function displayHours(hours) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ampm;
    }
    displayHours();

    // audit time slot to determine past, present, future and color accordingly (past=grey, present=red, future=green)
    function auditSchedule() {
        var now = new Date().getHours(); //current hour
            for (var i = 8; i < 21; i++) { 
            if ($(`#${i}`).data("time") == now) {
                $(`#text${i}`).addClass("present");
            } else if (now < $(`#${i}`).data("time")) {
                $(`#text${i}`).addClass("future");
            }
        }
    }
    auditSchedule(); //to run auditSchedule on load

    //save time and input to local storage when save button is clicked
    $('.saveBtn').on('click', function() {
        let eventTime = $(this).attr('id');
        let eventText = $(this).siblings('.description').val();
        //prevent null values from being saved to local storage
        if (eventText == "" || eventText === null || eventText.charAt(0) == " ") {             
            window.alert('Input cannot be blank or begin with a space " ". Please enter text to save to scheduler.')//prevents user from submitting blank or " " to local storage
            localStorage.removeItem(eventTime, eventText);//deletes previously saved event in local storage if user wants to hour to be cleared
        } else {
        localStorage.setItem(eventTime, eventText);
        }
    });
    
    // refresh page at midnight
    $(document).ready(function() { 
        function refreshAt(hours, minutes, seconds) {
            var now = new Date();
            var then = new Date();
        
            if (now.getHours() > hours ||
                (now.getHours() == hours && now.getMinutes() > minutes) ||
                now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
                then.setDate(now.getDate() + 1);
            }
            then.setHours(hours);
            then.setMinutes(minutes);
            then.setSeconds(seconds);
        
            var timeout = (then.getTime() - now.getTime());
            setTimeout(function() { window.location.reload(true); }, timeout);

        }  
        refreshAt(24,0,0);
        //clear local storage and input fields at midnight so schedule is empty on new day
        var now = new Date().getHours();
        if (now == 24) {
        localStorage.clear();
        $('.description').val("");
        }
        
    });    
    setInterval(function() {
        auditSchedule();
    }, 1000);
    
});