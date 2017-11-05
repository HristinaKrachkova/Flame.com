 $(function() {
     $('#chooseKM').slider({
         max: 5000,
         min: 1,
         value: 1,
         slide: function(e, ui) {
             $('#currentval').html(ui.value);
         }
     });

     $('#chooseAge').slider({
         range: true,
         min: 18,
         max: 90,
         values: [20, 30],
         slide: function(event, ui) {
             $('#rangeval').html(ui.values[0] + " - " + ui.values[1]);
         }
     });
 });