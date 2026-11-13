L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
let partyPosition = [];

let viewZoom = localStorage.getItem('mapZoom') ?? lowestZoom;
let viewCenter = JSON.parse(localStorage.getItem('mapCenter') ?? JSON.stringify(mapCenter));

// Creating the Map
var map = L.map('map', { crs: L.CRS.Simple, minZoom: -2, }).setView(viewCenter, viewZoom);
var bounds = [[0,0], [5120,3264]];
var imageUrl = 'map/result.png';
L.imageOverlay(imageUrl, bounds).addTo(map);
map.fitBounds(bounds);
// Добавляем линейку на карту
// Настройки новой линейки
L.control.polylineMeasure({
    position: 'topright', // Положение кнопки
    unit: 'условных часов',   // Плагин требует указать единицы, но для CRS.Simple это не даст реальных км
    useSubunits: false,   // Отключаем метры/футы, чтобы не путаться
    showBearings: false,  // Углы (азимуты) можно отключить, если не нужны
    clearMeasurementsOnStop: true // Очищать линии при выключении линейки
}).addTo(map);
// Boundaries Variables
if (mapSouthWest && mapNorthEast && mapSouthWest.length > 0 && mapNorthEast.length > 0) {
  map.setMaxBounds(new L.LatLngBounds(mapSouthWest, mapNorthEast));
}

// Coordinate Finder (use to easily get lat and long from the map)
if (showLocationFinderMarker) {
  var coordinateFinderMarker = L.marker(mapCenter, {
    draggable: true, icon: L.AwesomeMarkers.icon({
      icon: "location-crosshairs",
      markerColor: "blue",
    }),
  }).addTo(map);
  coordinateFinderMarker.bindPopup('Lat Lng Marker');
  coordinateFinderMarker.on('dragend', function (e) {
    const { lat, lng } = coordinateFinderMarker.getLatLng();
    markerPos = [lat.toFixed(1), lng.toFixed(1)];
    coordinateFinderMarker.getPopup().setContent(markerPos.join(', ')).openOn(map);
  });
}

// Party position (saved to loalStorage for persistence)
if (showPartyMarker) {
  const initialPartyPosition = JSON.parse(localStorage.getItem('partyPosition') ?? JSON.stringify(initialPartyPositionOnMap));
  var partyMarker = L.marker(initialPartyPosition, {
    draggable: true, icon: L.AwesomeMarkers.icon({
      icon: "circle",
      markerColor: "lightgreen",
    }),
  }).addTo(map);
  partyMarker.bindPopup("You're here!");
  partyMarker.on('dragend', function (e) {
    partyCoordinates = partyMarker.getLatLng();
    partyPosition = [partyCoordinates.lat, partyCoordinates.lng];
    localStorage.setItem('partyPosition', JSON.stringify(partyPosition));
  });
}
