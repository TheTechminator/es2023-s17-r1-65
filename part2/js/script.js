btConcertScheduleWeb.addEventListener("click", (e) => {
    showConcertSchedule();
});

btConcertScheduleMobile.addEventListener("click", (e) => {
    showConcertSchedule();
});

function showConcertSchedule () {
    concertSchedule.style = "";
}

function hideConcertSchedule () {
    concertSchedule.style = "display: none;";
}


let faqAnswers = document.getElementsByClassName("faqAnswer");
let faqTitles = document.getElementsByClassName("faqTitle");
let faqButtons = document.getElementsByClassName("faqButton");

for(let i = 0; i<faqAnswers.length; i++) {
    faqAnswers[i].style = "display: none;";
    faqTitles[i].style = "border-radius: 15px;";

    faqButtons[i].addEventListener("click", (e) => {
        let element = e.target.parentNode.nextElementSibling;

        if(element.style.display == "none") {
            e.target.parentNode.style = "";
            element.style.display = "block";
            e.target.innerHTML = "-";
        } else {
            element.style.display = "none";
            e.target.parentNode.style = "border-radius: 15px;";
            e.target.innerHTML = "+";
        }

    });
}

concertSchedule.addEventListener("click", (e) => {
    hideConcertSchedule();
})