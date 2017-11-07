$(function() {
    $(document).ready(function() {
        $(document).on("scroll", onScroll);

        //smoothscroll
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            $(document).off("scroll");

            $('a').each(function() {
                $(this).removeClass('active');
            })
            $(this).addClass('active');

            var target = this.hash,
                menu = target;
            $target = $(target);
            if ($(window).width() < 900) {
                var topDistance = 250;
            } else {
                var topDistance = 50;
            }
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - topDistance
            }, 500, 'swing', function() {
                $(document).on("scroll", onScroll);
            });
        });
    });

    function onScroll(event) {
        var scrollPos = $(document).scrollTop();
        $('#userOptions a').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('#userOptions ul li a').removeClass("active");
                currLink.addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    }

    $('#chooseKM').slider({
        max: 200,
        min: 1,
        value: 1,
        slide: function(e, ui) {
            var maxDistance = ui.value;

            $('#currentval').html(maxDistance);
            $('#currentval').val(maxDistance);
        }
    });

    $('#chooseAge').slider({
        range: true,
        min: 18,
        max: 70,
        values: [20, 30],
        slide: function(event, ui) {
            var minAge = ui.values[0];
            var maxAge = ui.values[1];

            $('#rangeval').html(minAge + ' - ' + maxAge);
            $('#rageval').attr('min', minAge);
            $('#rageval').attr('max', maxAge);
        }
    });
});