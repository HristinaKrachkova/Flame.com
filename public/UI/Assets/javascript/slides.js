 $(function() {
     $('#chooseKM').slider({
         max: 5000,
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
         max: 90,
         values: [20, 30],
         slide: function(event, ui) {
             var minAge = ui.values[0];
             var maxAge = ui.values[1];
             $('#rangeval').html(minAge + " - " + maxAge);
             $('#rageval').attr('min', minAge);
             $('#rageval').attr('max', maxAge);
         }
     });
 });