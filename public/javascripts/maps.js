$(function(){

  $("#search").click(function(){
    searchAddress($("#place").val());
  });

  if (GBrowserIsCompatible()) {
    var map = new GMap2($("#map_canvas")[0]);
    var geocoder = new GClientGeocoder();
    var center = new GLatLng(50.170693,18.904327);
    var lastMarker = null;
    
    map.openInfoWindow(center ,"Witaj w tripmate<br/>Kliknij aby wybrać lokalizację");
    
    map.setCenter(center, 14);

    GEvent.addListener(map, "click", function(overlay, latlng){
      if(latlng != null){
        var marker = createMarker(latlng);
        map.addOverlay(marker);
        geocoder.getLocations(latlng, showAddress);
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
        $("#places").html(address + "<br/>");
      }
    }
    
    function searchAddress(address) {
      geocoder.getLatLng(
        address,
        function(point) {
          if (!point) {
            alert(address + " not found");
          } else {
            map.setCenter(point, 13);
            var marker = createMarker(point);
            map.addOverlay(marker);
            marker.openInfoWindowHtml(address);
            lastMarker.value = address;
            $("#places").slideDown().html(address + "<br/>");
          }
        }
      );
    }
    
    function createMarker(latlng){
      var marker = lastMarker = new GMarker(latlng, {draggable: true});
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
      
      return marker;
    }
    
  }
      

      
});

