function getLocalStorage(key) {
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
        var colTime = $('<div class="col-md-1 hour">' + diplayHours(i) + '</div>');

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

        getLocalStorage(i);
    }

    function diplayHours(hours) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ampm;
    }
    diplayHours();

// audit time slot to determine past, present, future and color accordingly (past=grey, present=red, future=green)
function auditSchedule(){
        var currentTime = new Date().getHours();
        for (var i = 8; i < 21; i++) { 
        console.log(currentTime, $(`#${i}`).data("time"));
        if ($(`#${i}`).data("time") == currentTime) {
            $(`#text${i}`).addClass("present");
        } else if (currentTime < $(`#${i}`).data("time")) {
            $(`#text${i}`).addClass("future");
        }
    }
}


//save time and input to local storage when save button is clicked
var saveBtn = $('.saveBtn');
saveBtn.on('click', function(){
    let eventId = $(this).attr('id');
    let eventText = $(this).siblings('.description').val();
    localStorage.setItem(eventId, eventText);
});

setInterval(function() {
    auditSchedule();
}, 1000);
});

