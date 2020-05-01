

/* PEMCIYXQCK-6 cambios ux */
function closeOpenedNav() {
    var $trigger = $('ul.QC_Menu_Top .colapsed_menu span');

    //hide ul
    $trigger.next().hide();

    $trigger.next().children("li.node").each(function (z) {
        var level1 = $(this).children('a');
        if (level1.hasClass('active')) {
            level1.removeClass('active');
            level1.next().hide(); // hide subnode
        }
        level1.next().children('li.column').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).children('ul').hide(); // hide subsubnode
            }
        });
    });
}

var loaded = false;
var lastWindowWidth = window.outerWidth,
    lastWindowHeight = window.outerHeight;


$(window).on("resize", function (e) {
    var windowWidth = $(this).outerWidth(),
        windowHeight = $(this).outerHeight();
    if (lastWindowWidth != windowWidth && lastWindowHeight == windowHeight) {
        //only horizontal resize done
        topNavBigDevices();
    }
});

function topNavBigDevices() {
    // var win = window.outerWidth; //this = window
    var win = $(window).width(); //this = window
    if (win > 767) {
        if ($('ul.QC_Menu_Top ul#QC_Menu_Nodes').css("display") == "none") {
            $('ul.QC_Menu_Top ul#QC_Menu_Nodes').show();
            $('ul.QC_Menu_Top ul.subnode ul').show();
        }

        $('ul.QC_Menu_Top ul#QC_Menu_Nodes ul.subnode').css('height', 'auto');
    } else {
        $('ul.QC_Menu_Top ul#QC_Menu_Nodes').hide();
        $('ul.QC_Menu_Top ul.subnode').hide();
        //dropdownHeight();
    }
}

function dropdownHeight() {
    var total = window.outerHeight,
        difference = $('ul.QC_Menu_Top ul#QC_Menu_Nodes').outerHeight() + $('#topNav').outerHeight();
    $('ul.QC_Menu_Top ul#QC_Menu_Nodes ul.subnode').css('max-height', total - difference);
}

function closeTopNavMenu(menuToClose){
    win = window.outerWidth; //this = window

    menuToClose.children("a:first").next().hide(); // hide subnode
    if (win < 767) {
        $(this).children("a:first").next().find('ul').hide(); // hide subsubnode
    }
    menuToClose.children(".active").removeClass( "active" )
}

function closeMenuWhenClickAnywhere(){

    var subMenuListener = false;
    var subMenuOpen = false;

    $('.node').click(function(evt) {



        if (subMenuListener == false) {
            setTimeout(function() {

                subMenuOpen = true;
                subMenuListener = true;
                $(document).click(function(evt){
                    if(evt.target.id == "subnode"){
                        return;}
                    if($(evt.target).closest('a').length){
                        return;}
                    //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                    if($(evt.target).closest('.subnode').length)
                        return;

                    //Do processing of click event here for every element except with id menu_content
                    closeTopNavMenu($('.node:has(.active)'));
                    subMenuOpen = false;
                    subMenuListener = false;
                    $(document).unbind( "click" );
                });

            }, 500);

        }
    });

}

//Accordeon Menu Top
$(document).ready(function () {


    topNavBigDevices();
    onClickMenuEvents();

    $('.subnode_close').click(function () {
        $(this).parent(".subnode").slideToggle("fast");
        $(this).parent(".subnode").prev("a.active").removeClass("active");
    });

    $('#UserProfileMobile li.QC_Item span.icoUserProfile').click(function () {
        if ($('#SearcherUser li.QC_Item span.icon_search').hasClass('active')) {
            $('#SearcherUser li.QC_Item span.icon_search').removeClass('active');
        }
        if ($('#nav_bar_ul li.colapsed_menu span').hasClass('active')) {
            $('#nav_bar_ul li.colapsed_menu span').removeClass('active');
            closeOpenedNav();
        }
    });
    $('#SearcherUser li.QC_Item span.icon_search').click(function () {
        if ($('#UserProfileMobile li.QC_Item span.icoUserProfile').hasClass('active')) {
            $('#UserProfileMobile li.QC_Item span.icoUserProfile').removeClass('active');
        }
        if ($('#nav_bar_ul li.colapsed_menu span').hasClass('active')) {
            $('#nav_bar_ul li.colapsed_menu span').removeClass('active');
            closeOpenedNav();
        }
    });

    closeMenuWhenClickAnywhere();
});

function onClickMenuEvents(){
    // click in mobile menu button - showing level 1
    $('ul.QC_Menu_Top .colapsed_menu span').click(function () {
        // if it has active class, we are going to close the dd
        if ($(this).hasClass('active')) {
            //remove active state to menu button
            $(this).removeClass('active');

            //remove noscroll class from #default to allow scroll again
            $('#default').removeClass('noscroll');

            // if we are closing the menu dropdown - close everything within the main navigation and remove active states
            closeOpenedNav();

            $(this).next().slideUp("fast");
        } else {
            //add active state to menu button
            $(this).addClass('active');

            //add noscroll class from #default to prevent scroll again
            $('#default').addClass('noscroll');

            //before opening the dropdown menu, remove active state from user / search dd
            if ($('#SearcherUser li.QC_Item span.icon_search').hasClass('active')) {
                $('#SearcherUser li.QC_Item span.icon_search').removeClass('active');
            }
            if ($('#UserProfileMobile li.QC_Item span.icoUserProfile').hasClass('active')) {
                $('#UserProfileMobile li.QC_Item span.icoUserProfile').removeClass('active');
            }

            $(this).next().slideDown("fast");
        }


    });

    // click on level 1 button - showing level 2
    $('ul.QC_Menu_Top li.node > a').click(function () {
        if ($(this).hasClass('elementDirect') == false) {
            var controlAnchor = $(this),
                controlLi = controlAnchor.parent(".node"),
                win = window.outerWidth; //this = window

            //closing subnavigation
            controlLi.parent("ul").children("li.node").each(function (z) {
                if ($(this)[0] != controlLi[0]) {
                    closeTopNavMenu($(this));
                }
            });
            // hide subnode
            $(this).next().slideToggle("fast");
            $(this).toggleClass("active");


            $('ul.QC_Menu_Top li.node > a').each(function (z) {
                if ($(this)[0] != controlAnchor[0]) {
                    $(this).removeClass("active");
                }
            });
        }
    });

    // click on level 2 button - showing level 3
    $('ul.QC_Menu_Top li.node > ul > li.column').click(function () {
        var win = window.outerWidth; //this = window
        if (win < 767) {
            var controlLi = $(this);

            //closing subnavigation
            controlLi.parent("ul").children("li.column").each(function (z) {
                if ($(this)[0] != controlLi[0]) {
                    $(this).children("a:first").next().hide(); // hide subnode
                    if (win < 767) {
                        $(this).children("a:first").next().find('ul').hide(); // hide subsubnode
                    }
                }
            });
            // show/hide subnode
            if (!controlLi.hasClass('active')) {
                //show subnode
                var total = window.outerHeight,
                    difference = $('#topNav').outerHeight();
                $('ul.QC_Menu_Top ul#QC_Menu_Nodes ul.subnode').css('height', total - difference);

                controlLi.children("ul").slideDown("fast");
                controlLi.parent("ul").addClass("active");
                controlLi.addClass("active");
            } else {
                //hide
                $('ul.QC_Menu_Top ul#QC_Menu_Nodes ul.subnode').css('height', 'auto');

                controlLi.children("ul").slideUp("fast");
                controlLi.parent("ul").removeClass("active");
                controlLi.removeClass("active");
            }

            $('ul.QC_Menu_Top li.node > ul > li.column').each(function (z) {
                if ($(this)[0] != controlLi[0]) {
                    $(this).removeClass("active");
                }
            });
        }
    });


};

//Accordeon Menu Left
$(document).ready(function () {


    $('ul.QC_Menu .QC_Item span.ico_menu:first').click(function () {
        if ($(this).next().css("display") != "none") {
            $(this).next().find('li.QC_Item .QC_Item_Open').hide();
            $(this).next().find('span').removeClass('active');
        }
    });


    //$('ul.QC_Menu ul.QC_Item_Open').hide();
    $('ul.QC_Menu li.QC_Item span').click(function (e) {

        if ($(this).next().hasClass('QC_Item_Open')) e.preventDefault();

        var controlLi = $(this).parent(".QC_Item");
        var controlPrincipal = controlLi.parents('ul')[controlLi.parents('ul').length - 1];
        var controlEach = null;


        controlLi.parent("ul").children("li.QC_Item").each(function (z) {
            if ($(this)[0] != controlLi[0]) {
                $(this).children("span:first").next().hide();
            }
        });
        $(this).next('ul.QC_Item_Open').slideToggle("fast");
        $(this).toggleClass("active");
        var controlSpan = $(this);
        $('ul.QC_Menu li.QC_Item span').each(function (z) {

            controlEach = $(this).parents('ul')[$(this).parents('ul').length - 1];
            if ($(this)[0] != controlSpan[0]) {
                if (controlPrincipal == controlEach) {
                    $(this).removeClass("active");
                }
            }
        });
    });
});



/* PEMCIYXQCK-6 cambios ux */