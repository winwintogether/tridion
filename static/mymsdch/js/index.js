
(function() {
    var getCookie = function(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for(var i = 0; i < cookies.length; i++) {
            var c = cookies[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    if (getCookie('language')) {
        janrain.settings.language = getCookie('language');
    }

    /*var onLoad = function() {
        var selectElement = document.getElementById('janrainSelectLanguage');
        selectElement.onchange = function() {
            document.cookie = 'language=' + selectElement.options[selectElement.selectedIndex].value + '; path=/';
            window.location.reload();
        };

        for (var i=0; i<selectElement.options.length; i++) {
            if (selectElement.options[i].value == janrain.settings.language) {
                selectElement.selectedIndex = i;
            }
        }
    }*/

    /*if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", onLoad, false);
    } else {
        window.attachEvent('onload', onLoad);
    }*/
})();