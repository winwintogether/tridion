$(document).ready(function () {
    $('.accordionDocuments .txtEnlazadorDocuments').hide();
    $('.accordionDocuments').find('.tituloPreguntaDocuments').removeClass("active");

    $('.accordionDocuments .tituloPreguntaDocuments').click(function () {

        $(this).next().slideToggle("slow")
            .siblings(".txtEnlazadorDocuments:visible").slideUp("slow");
        $(this).toggleClass("active");
        $(this).siblings(".tituloPreguntaDocuments").addClass("active");
    });

});



