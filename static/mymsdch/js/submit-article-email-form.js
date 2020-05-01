function responseCallBack(jsonResponse) {
    var responseCode = '';

    if (jsonResponse == null || jsonResponse == 'undefined' || jsonResponse.responseCode != 'SUCCESS') {
        isArticleAvailable = false;
        isLastArticleAvailable = false;
        isDownloaded = false;
    }
    else if (jsonResponse.responseCode == 'SUCCESS' && jsonResponse.article.isAvailable === true) {
        isArticleAvailable = jsonResponse.article.isAvailable;
        isLastArticleAvailable = jsonResponse.article.isLastAvailable;
        isDownloaded = jsonResponse.article.isDownloaded;
        articleExternalUrl = jsonResponse.article.articleExternalUrl;
    }

    for (var d in jsonResponse) {
        if (d == 'responseCode') {
            responseCode = jsonResponse[d];
            break;
        }
    }
    //if success show the thanks message
    if (responseCode == 'SUCCESS') {
        alert('success');
        //$(".articleContent").empty();
        //$(".articleContent").append($("#successMessage").show());
    }
}

function sendArticleEmailDataToService(ArctlId) {
    //alert(ArctlId);
    var jsonRequestString = '';
    //SET json data property values
    var selectedRadioValue = $('input:radio[name=group_' + ArctlId + ']:checked').val();

    if (typeof selectedRadioValue != 'undefined') {
        var siteId = globalSiteId;
        var username = epublish.foundation.userData.username

        if (selectedRadioValue.length > 0 && selectedRadioValue == 'EMAIL') {
            emailIdTxtBox = $("#txtemail_" + ArctlId).val();
            if (emailIdTxtBox.length == 0) {
                alert('Por favor, introduzca la direcci\xF3n de correo electr\xF3nico v\xE1lida');
                return false;
            }
            var emailPattern = /^[_A-Za-z0-9\-\+]+([\._A-Za-z0-9\-\+]+)*@[A-Za-z0-9]+([\.A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
            if (emailPattern.test(emailIdTxtBox) != true) {
                alert('Please enter valid email address');
                return false;
            }

            // Validate email download counter
            validateEmailDownload(siteId, username, ArctlId);
            var messg = 'Has alcanzado el n\xFAmero m\xE1ximo de descargas.';
            if (!isValidEmailDownload) {
                alert(messg); return false;
            }

            var strArticleLink = $("#articleLink").val().substring(0, $("#articleLink").val().indexOf('articleId=') + 10);
            strArticleLink = strArticleLink + ArctlId;
            if(!!articleExternalUrl){strArticleLink=articleExternalUrl;}
            jsonRequestString = '{"siteId":"' + siteId + '","payload":{"articleId":"' + ArctlId + '","username":"' + username + '","action":"' + selectedRadioValue + '","toEmail":"' + emailIdTxtBox + '","articleLink":"' + strArticleLink + '"}}';
            // initiateService(0, '/service/articlereprints/download', 'POST', 0, 'Digest', 'wcmServiceUser');
            initiateService(0, '/service/articlereprints/email', 'POST', 0, 'Digest', 'wcmServiceUser');
            callSynchronousJsonService(jsonRequestString, responseCallBack);

            if (!isArticleAvailable) {
                DisableArticleAccess(ArctlId);
            }else if (isArticleAvailable && isLastArticleAvailable)
            {
                ChangeCaptionLastAvailable(ArctlId);
            }
            else if (isArticleAvailable && isDownloaded)
            {
                ChangeCaptionDownloaded(ArctlId);
            }

            $('#dialogcontent-' + ArctlId).hide();
            $('#dialogsuccessMessage-' + ArctlId).show();
            $('#btnSucMsgOk-' + ArctlId).click(function () {
                $('#dialogcontent-' + ArctlId).show();
                $('#dialogsuccessMessage-' + ArctlId).hide();
                $('#dialog-'+ArctlId).dialog().dialog('close');
            });

        }
        else if (selectedRadioValue.length > 0 && selectedRadioValue == 'PDF') {
            jsonRequestString = '{"siteId":"' + siteId + '","payload":{"articleId":"' + ArctlId + '","username":"' + username + '","action":"' + selectedRadioValue + '"}}';
            //alert("jsonRequestString : " + jsonRequestString);
            initiateService(0, '/service/articlereprint/download', 'POST', 0, 'Digest', 'wcmServiceUser');
            callSynchronousJsonService(jsonRequestString, validatePDFDownloadCallBack);

            if (!isArticleAvailable) {
                DisableArticleAccess(ArctlId);
            }
            else if (isArticleAvailable && isLastArticleAvailable)
            {
                ChangeCaptionLastAvailable(ArctlId);
            }
            else if (isArticleAvailable && isDownloaded)
            {
                ChangeCaptionDownloaded(ArctlId);
            }


            //window.open('/article/pdf/data?contentId=' + ArctlId, '_blank');
            if(articleUrl != null ){
                window.open(articleUrl, '_blank');}
            else if(articleExternalUrl != null){
                window.open(articleExternalUrl, '_blank');}
            $('#dialog-'+ArctlId).dialog().dialog('close');

        }
        $('#txtemail_' + ArctlId).val('');
        $('#rdpdf_' + ArctlId).prop('checked', false);
        $('#rdemail_' + ArctlId).prop('checked', false);
    }
    else { alert("Por favor, seleccione una casilla de verificaci\xF3n al menos"); }

}

function initializeSubmitArticleForm() {

    //bind on click event for submit button
    $(".articleContent .request-article input[type=button]").click(function () {
        sendArticleEmailDataToService(this.id);
    });
}

var isValidEmailDownload = false;
function validateEmailDownload(siteId, userName, articleId) {
    // Validate the download counter
    initiateService(0, '/service/articlereprints/validatedownload', 'POST', 0, 'Digest', 'wcmServiceUser');
    var jsonRequestStringForDownload = '{"siteId":"' + siteId + '","payload":{"articleId":"' + articleId + '","username":"' + userName + '"}}';
    //callJsonService(jsonRequestStringForDownload, validateEmailDownloadCallBack);
    callSynchronousJsonService(jsonRequestStringForDownload, validateEmailDownloadCallBack);
}

function validateEmailDownloadCallBack(jsonResponse) {
    isValidEmailDownload = false;
    if (jsonResponse == null || jsonResponse == 'undefined') {
        isValidEmailDownload = false;
        return;
    }
    else if (jsonResponse.responseCode == 'SUCCESS' && jsonResponse.available === true) {
        isValidEmailDownload = true;
        return;
    }
    return;
}

// Callback for PDF download
var isArticleAvailable = false;
var isLastArticleAvailable = false;
var isDownloaded = false;
var articleUrl = '';
var articleExternalUrl = '';
function validatePDFDownloadCallBack(jsonResponse) {
    if (jsonResponse == null || jsonResponse == 'undefined' || jsonResponse.responseCode != 'SUCCESS') {
        isArticleAvailable = false;
        isLastArticleAvailable = false;
        articleUrl = '';
        articleExternalUrl = '';
        isDownloaded=false;
        return;
    }
    else if (jsonResponse.responseCode == 'SUCCESS' && jsonResponse.article.isAvailable === true) {
        isArticleAvailable = jsonResponse.article.isAvailable;
        isLastArticleAvailable = jsonResponse.article.isLastAvailable;
        isDownloaded = jsonResponse.article.isDownloaded;
        articleUrl = jsonResponse.article.articleUrl;
        articleExternalUrl = jsonResponse.article.articleExternalUrl;
        return;
    }
    else {
        isArticleAvailable = jsonResponse.article.isAvailable;
        isLastArticleAvailable = jsonResponse.article.isLastAvailable;
        isDownloaded = jsonResponse.article.isDownloaded;
        articleUrl = jsonResponse.article.articleUrl;
        articleExternalUrl = jsonResponse.article.articleExternalUrl;

        return;
    }
}

function DisableArticleAccess(articleId) {
    var disableHTML = "<span class='document_state no-click-download'>Descargado</span><span class='button no-click-download'>Solicitar</span>";
    $("#articleAccess_"+articleId).html(disableHTML);
    $("#articleAccess_"+articleId).attr('style', 'cursor: default;padding-top:0px;');
    $("#articleAccess_"+articleId).unbind( "click" );
}


function ChangeCaptionLastAvailable(articleId) {
    var changeLastAvailableHTML = "<span class='document_state last_available'>\xdaltimas descargas</span><span class='button'>Solicitar</span>";
    $("#articleAccess_"+articleId).html(changeLastAvailableHTML);
}

function ChangeCaptionDownloaded(articleId) {
    var changeDownloadedHTML = "<span class='document_state registered no-click-download'>Descargado</span><span class='button'>Solicitar</span>";
    $("#articleAccess_"+articleId).html(changeDownloadedHTML);
    $("#articleAccess_"+articleId).attr('style', 'cursor: default;padding-top:0px;');
    $("#articleAccess_"+articleId).unbind( "click" );
}



$(document).ready(function () {
    initializeSubmitArticleForm();

});