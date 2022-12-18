// Setup Dates
module.exports.getDate = getDate;

function getDate() {
const today = new Date(Date.now());

let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
};
var day = today.toLocaleDateString("en-US", options)
return day;
}

module.exports.getDay = getDay

function getDay() {
    const today = new Date(Date.now());
    
    let options = {
        weekday: "long",
     
    };
    var day = today.toLocaleDateString("en-US", options)
    return day;
    }