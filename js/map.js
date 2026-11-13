L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
let partyPosition = [];

let viewZoom = localStorage.getItem('mapZoom') ?? lowestZoom;
let viewCenter = JSON.parse(localStorage.getItem('mapCenter') ?? JSON.stringify(mapCenter));

// Creating the Map
var map = L.map('map', { crs: L.CRS.Simple, minZoom: -3, }).setView(viewCenter, viewZoom);
var bounds = [[0,0], [5120,3264]];
var imageUrl = 'map/result.png';
L.imageOverlay(imageUrl, bounds).addTo(map);
map.fitBounds(bounds);
// Настройки линейки
var rulerOptions = {
    position: 'topright', // Положение кнопки на карте
    lengthUnit: {
        display: 'ед.',   // Что будет показано на карте после числа
        decimal: 2,       // Количество знаков после запятой
        factor: null,     // Оставьте null, так как у нас нет реального пересчёта из километров
        label: 'Расстояние:' // Подпись перед числом
    },
    angleUnit: {
        display: '°',     // Единица измерения угла (можно оставить)
        decimal: 2,
        factor: null
    }
};

// Добавляем линейку на карту
L.control.ruler(rulerOptions).addTo(map);
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
