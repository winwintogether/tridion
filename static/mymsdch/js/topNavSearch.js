
// GLOBAL SEARCH RESULTS SCRIPT
var defaultSearchText = 'Text…';
if(window.location.href.indexOf('/fr/') >-1) {
    defaultSearchText = "Texte…";
}else if(window.location.href.indexOf('/de/') >-1){
    defaultSearchText = "Text…";
}
var searchText = "";
if(window.location.href.split('q=').reverse()[0].indexOf("%") > -1){
    searchText = window.location.href.split('q=').reverse()[0].split('%20AND')[0];
}
else {
    //some browsers like IE take space instead of %20 in the query
    searchText = window.location.href.split('q=').reverse()[0].split(' AND')[0];
}
// var searchText = window.location.href.split('q=').reverse()[0].split('%')[0];
function redirectToSearchPage(searchKey){
    if ($.trim(searchKey) != '' && searchKey != defaultSearchText ){

        if(window.location.href.indexOf('/fr/') >-1) {
            window.location.href = "/fr/genericsearch.xhtml?rows=10&start=0&q=" + encodeURIComponent(searchKey + " AND url:*/fr/*");
        }else if(window.location.href.indexOf('/de/') >-1){
            window.location.href = "/de/genericsearch.xhtml?rows=10&start=0&q=" + encodeURIComponent(searchKey + " AND url:*/de/*");
        }

    }
}

$(document).ready(function () {

    if(window.location.href.indexOf('genericsearch.xhtml') > -1){
        if(searchText.indexOf("%20") > -1){
            searchText = decodeURI(searchText);
        }
        $('*[data-device]').val(searchText);
    } //testing search text

    $('*[data-device]').focus(function () { if ($(this).val() == defaultSearchText) { $(this).val(''); } });


    $('*[data-device]').keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            redirectToSearchPage($(this).val());
        }
    });
    $('*[data-device]').blur(function () { if ($(this).val() == '' || $(this).val() == defaultSearchText) { $(this).val(defaultSearchText); } });


    $('#gen_search_de, #search_result_icon_de, #gen_search_fr, #search_result_icon_fr').on('click',function(){
        var _keyword = $(this).siblings("*[data-device]").val();
        console.log(_keyword);
        redirectToSearchPage(_keyword);
    });
    /*$('#btnSearch').click(function () { redirectToSearchPage(); });*/

    /*$('#btnSearch').click(function () {
     placeholderVal=$("#searchText").attr("placeholder");
     redirectToSearchPage(placeholderVal);
      });*/

});
// GLOBAL SEARCH RESULTS SCRIPT


function appendSSOToken(elem) {
    if (epublish.foundation.userData.ssoToken != null) {
        elem.href = elem.href + '?params=' + epublish.foundation.userData.ssoToken;
    }
}