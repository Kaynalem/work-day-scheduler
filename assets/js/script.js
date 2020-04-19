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
        var colSave = $(`<button class="btn saveBtn col-md-1" id=${i}><span class="oi oi-document"></span></button>`)
        
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
        if (eventText == "") {
            window.alert("Input cannot be blank. Please enter text to save to scheduler.")
            localStorage.removeItem(eventTime, eventText);//deletes previously saved event in local storage if user wants to hour to be cleared
        } else {
        localStorage.setItem(eventTime, eventText);
        }
    });
    
        
    setInterval(function() {
        auditSchedule();
    }, 1000);

    
});