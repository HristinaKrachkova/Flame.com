function User(name, age, mail, password) {
    this.name = name;
    this.age = age;
    this.mail = mail;
    this.password = password;
}

var user1 = new User('Ivanka', 18, 'iv@abv.bg', 123456);
var user2 = new User('Mariicho', 28, 'ma@abv.bg', 654321);

$('#login').click = function() {
    function geoFindMe() {
        var output = document.getElementById('out');

        if (!navigator.geolocation) {
            output.innerHTML = '<p>За съжаление твоят браузър не поддържа локация.</p>';

            return;
        }

        function success(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

            var img = new Image();

            img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&size=300x300&sensor=false';

            output.appendChild(img);
        }

        function error() {
            output.innerHTML = 'Локацията не може да бъде установена.';
        }

        output.innerHTML = '<p>Локализиране...</p>';

        navigator.geolocation.getCurrentPosition(success, error);
    }

    // Calculating the distance from the visitor to me

    var Geolocation = {
        rad: function(x) {
            return x * Math.PI / 180;
        },

        // Distance in kilometers between two points using the Haversine algo.
        haversine: function(user1, user2) {
            var R = 6371;
            var dLat = this.rad(user2.latitude - user1.latitude);
            var dLong = this.rad(user2.longitude - user1.longitude);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.rad(user1.latitude)) * Math.cos(this.rad(user2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;

            return Math.round(d);
        }
    };
};
