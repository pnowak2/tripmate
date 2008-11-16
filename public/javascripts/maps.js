$(function(){
      if (GBrowserIsCompatible()) {
        var map = new GMap2($("#map_canvas")[0]);
        var geocoder = new GClientGeocoder();
        var center = new GLatLng(50.170693,18.904327);
        var lastMarker = null;
        
        map.setCenter(center, 14);

        GEvent.addListener(map, "click", function(overlay, latlng){
          if(latlng != null){
            var marker = lastMarker = new GMarker(latlng, {draggable: true});
            map.addOverlay(marker);
            geocoder.getLocations(latlng, showAddress);
            
            GEvent.addListener(marker, "click", function() {
              marker.openInfoWindowHtml(marker.value);
            });
            
            GEvent.addListener(marker, "dragstart", function() {
              map.closeInfoWindow();
            });

            GEvent.addListener(marker, "dragend", function(latlng) {
              lastMarker = marker;
              geocoder.getLocations(latlng, showAddress);
            });
          }
        });
        
        function showAddress(response) {
          if (!response || response.Status.code != 200) {
            alert("Status Code:" + response.Status.code);
          } else {
            var place = response.Placemark[0];
            point = new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]);
            var address = '<b>Address:</b>' + place.address + '<br>' +
                          '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode
            lastMarker.openInfoWindowHtml(address);
            lastMarker.value = address;
          }
        }
        
      }
      

      
});

