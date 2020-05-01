$(document).ready(function() {

    // Append the survey popup to the page
    /*$('#bottom').append('<div id="popupSurvey">' +
    '<div id="popUp-overlay">' + '</div>' +
    '<div id="popUp">' +
    '<p class="popUp-title">' + 'Please let us know what you think about MSD Connect in our short survey â€“ itâ€™s only three questions!' + '</p>' +
    '<div class="confirmationSurvey">' +
        '<a class="popUp-close" id="acceptSurvey" href="#" name="acceptSurvey">' + 'Yes' + '</a>' +
        '<a class="popUp-close" id="refuseSurvey" href="#" name="refuseSurvey">' + 'No' + '</a>' + '</div>' +
        '<p class="informationSurvey">'+ 'We will use the results of the multiple choice questions to make sure our content is relevant and valued by visitors. All answers are collected anonymously.' + '</p>' +
    '</div>' +
    '</div>');*/

    /*if(window.location.href.indexOf('/fr/') >-1){
            $('#bottom').append('<div id="popupSurvey">' +
    '<div id="popUp-overlay">' + '</div>' +
    '<div id="popUp">' +
    '<p class="popUp-title">' + 'SVP dites-nous ce que vous pensez de MSD connect dans notre bref sondage - il y a que trois questions!' + '</p>' +
    '<div class="confirmationSurvey">' +
        '<a class="popUp-close" id="acceptSurvey" href="#" name="acceptSurvey">' + 'Oui' + '</a>' +
        '<a class="popUp-close" id="refuseSurvey" href="#" name="refuseSurvey">' + 'Non' + '</a>' + '</div>' +
        '<p class="informationSurvey">'+ 'Les rÃ©sultats des questions Ã  choix multiples seront utilisÃ©es pour nous assurer que le contenu est pertinent et valorisÃ© par les visiteurs. Les donnÃ©es seront utilisÃ©es de faÃ§on anonyme.' + '</p>' +
    '</div>' +
    '</div>');
        }
        else if(window.location.href.indexOf('/de/') >-1){
            $('#bottom').append('<div id="popupSurvey">' +
    '<div id="popUp-overlay">' + '</div>' +
    '<div id="popUp">' +
    '<p class="popUp-title">' + 'Bitte teilen Sie uns in dieser kurzen Umfrage mit, wie Ihnen MSD Connect gefÃ¤llt â€“ es sind nur drei Fragen.' + '</p>' +
    '<div class="confirmationSurvey">' +
        '<a class="popUp-close" id="acceptSurvey" href="#" name="acceptSurvey">' + 'Ja' + '</a>' +
        '<a class="popUp-close" id="refuseSurvey" href="#" name="refuseSurvey">' + 'Nein' + '</a>' + '</div>' +
        '<p class="informationSurvey">'+ 'Aufgrund der Ergebnisse der Multiple-Choice-Fragen stellen wir sicher, dass unsere Inhalte fÃ¼r Sie und andere Besucher relevant und hilfreich sind. Alle Daten  sind anonym.' + '</p>' +
    '</div>' +
    '</div>');
        }*/

    var nextReminderDate = nexReminderDate();
    var userEmail = fetchUserEmail();
    var today = getDaysAdvanced("false");
    var loginPageName = ["index.xhtml", "login.xhtml", 'registereduser.xhtml'];

    /* the array loginPageName contains the url's of the pages that contain a login box, it should be configured per publication.
    Create an item in localStorage on those pages and when logged in check and delete it */
    if(!(window.location.href.indexOf('imtoken') >-1)){
        if ($.isEmptyObject(epublish.foundation.userData) != true && localStorage.loginPageOrigin == "true" && userEmail !== '') {
            // if logged in
            localStorage.removeItem("loginPageOrigin");

            var jsonRequestString = '{"siteId":"' + globalSiteId + '","userId":"' + userEmail + '","surveyId":"survey111"}';
            initiateService(0, '/fpxservice/queryservice/survey/fetchSurveyData?siteId=' + globalSiteId, 'POST', 0, 'Basic', 'wcmServiceUser');
            callSynchronousJsonService(jsonRequestString, fetchSurveyData);
        } else {
            function popupIsComing(){
                var aux = false;
                for (i in loginPageName){
                    if (window.location.href == window.location.origin + '/' + loginPageName[i]){ aux = true }
                }
                return aux;
            }
            if (popupIsComing() || window.location.href == window.location.origin + '/') {
                localStorage.setItem('loginPageOrigin', 'true');
            }
        }
    }

    $('#acceptSurvey').click(function() {
        //Redirects to survey page and opens actual page in new page
        var tomorrow = getDaysAdvanced("1");
        var jsonRequestString = '{"siteId":"' + globalSiteId + '","userId":"' + userEmail + '","surveyId":"survey111","optIn":"NO","optInDate": "' + today + '","remindMeAfter":"6 months","nextReminderDate": "' + tomorrow + '" }';
        initiateService(0, '/fpxservice/surveydata/save', 'POST', 0, 'Basic', 'wcmServiceUser');
        callSynchronousJsonService(jsonRequestString, savePositiveSurveyData);
        var win = window.open("" + window.location.href + "", '_blank');
        win.focus();
        if(window.location.href.indexOf('/fr/') >-1){
            location.href = '/fr/satisfaction-survey.xhtml';
        }
        else if(window.location.href.indexOf('/de/') >-1){
            location.href = '/de/satisfaction-survey.xhtml';
        }

    });

    $('#refuseSurvey').click(function() {
        //Save refusal and then exit survey cycle
        var sixMonths = getDaysAdvanced(nextReminderDate);
        var jsonRequestString = '{"siteId":"' + globalSiteId + '","userId":"' + fetchUserEmail() + '","surveyId":"survey111","optIn":"NO","optInDate": "' + today + '","remindMeAfter":"6 months","nextReminderDate": "' + sixMonths + '" }';
        initiateService(0, '/fpxservice/surveydata/save', 'POST', 0, 'Basic', 'wcmServiceUser');
        callSynchronousJsonService(jsonRequestString, saveNegativeSurveyData);
        location.href = window.location.href;
    });
});


//for Preview 2 days and for Live 6 months
function nexReminderDate() {
    if (window.location.href.indexOf("epublishmerck") > -1) { return 2 }
    else { return 182 }
}

//check if there is a parameter in URL for different pop up window
function checkLoginForPopup() {
    if (window.location.href.indexOf("pu=yes") > -1) {
        $("#popUpDiv").show();
        $(".popUp-close").click(function(event) {
            event.preventDefault();
            $("#popUpDiv").hide();
            location.href = '/index.xhtml';
        });
    }
}

//depending on the country, email field has a different name
function fetchUserEmail() {
    var userEmail = '';
    if (epublish.foundation.userData.email !== undefined) {
        userEmail = epublish.foundation.userData.email;
    } else if(epublish.foundation.userData.emailAddress !== undefined) {
        userEmail = epublish.foundation.userData.emailAddress;
    }
    return userEmail;
}

function savePositiveSurveyData(jsonResponse) {
    if (jsonResponse == null || jsonResponse == 'undefined') {
        console.log("FAILED CALL");
    } else {
        console.log(jsonResponse);
    }
}

function saveNegativeSurveyData(jsonResponse) {
    if (jsonResponse == null || jsonResponse == 'undefined') {
        console.log("FAILED CALL");
    } else {
        console.log(jsonResponse);
    }
}

//return today's date, tomorrow's or 6 months later's depending on the variable
function getDaysAdvanced(inputVariable) {
    if (inputVariable == "false") {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    } else {
        var today = new Date();
        var oneDay = 24 * 60 * 60 * 1000;
        var futureDate = Math.round(Math.abs((today.getTime() + (inputVariable * oneDay))));
        var d = new Date(futureDate);
        var dd = d.getDate();
        var mm = d.getMonth(); //January is 0!
        var yyyy = d.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        futureDate = yyyy + '-' + mm + '-' + dd + ' 01:00:00';
        return futureDate;
    }
}

function saveSuccessSurveyNowData(jsonResponse) {
    if (jsonResponse == null || jsonResponse == 'undefined') {
        console.log("FAILED CALL");
    } else {
        var lastItem = jsonResponse;
        console.log(lastItem);
    }
}

function fetchSurveyData(jsonResponse) {
    if ( (jsonResponse == undefined || jsonResponse.length == 0) && (jsonResponse.responseCode !== 'ERROR') ) {
        //Establish initial user
        var today = getDaysAdvanced("false");
        var todaySave = getDaysAdvanced("0");
        var jsonRequestString = '{"siteId":"' + globalSiteId + '","userId":"' + fetchUserEmail() + '","surveyId":"survey111","optIn":"NO","optInDate": "' + today + '","remindMeAfter":"6 months","nextReminderDate": "' + todaySave + '" }';
        initiateService(0, '/fpxservice/surveydata/save', 'POST', 0, 'Basic', 'wcmServiceUser');
        callSynchronousJsonService(jsonRequestString, savePositiveSurveyData);
        $("#popupSurvey").show();
    } else {
        var lastItem = jsonResponse.pop();
        var opt_in_date = lastItem.opt_in_date;
        var next_reminder_date = lastItem.next_reminder_date;

        if (opt_in_date !== "false") {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth(); //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) { dd = '0' + dd }
            if (mm < 10) { mm = '0' + mm }
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date(yyyy, mm, dd);
            var dateStr = next_reminder_date;
            dateStr = dateStr.split(" ");
            var dateRes = dateStr[0].split("-");
            var secondDate = new Date(dateRes[0], dateRes[1], dateRes[2]);
            var diffDays = Math.round((firstDate.getTime() - secondDate.getTime()) / (oneDay));
            if (diffDays >= 0) {
                //2 days (in Preview) / 6 months (Live) since last popup
                $("#popupSurvey").show();
            }
        } else {
            //user has never done a survey
            $("#popupSurvey").show();
        }
    }
}