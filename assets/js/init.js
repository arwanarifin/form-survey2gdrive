// building and destroying DOM
$(document).ready(function () {
  $("select").formSelect();
});
function init() {
  document.removeEventListener("DOMContentLoaded", init);
}
document.addEventListener("DOMContentLoaded", init);

var map = L.map("map", {
  zoom: 5,
  center: [-2.6, 118],
  zoomControl: false,
});

L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  //attribution: "&copy;Google Imagery",
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
}).addTo(map);

var marker = L.marker([0, 0], {
  draggable: true,
});

marker
  .on("dragend", function (e) {
    setLocation(marker.getLatLng().lat, marker.getLatLng().lng);
  })
  .addTo(map);

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);
map.on("click", onMapClick);

function onMapClick(e) {
  marker.setLatLng(e.latlng);
  setLocation(marker.getLatLng().lat, marker.getLatLng().lng);
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  setLocation(e.latlng.lat, e.latlng.lng);
  marker
    .setLatLng(e.latlng)
    .bindPopup("Radius akurasi " + radius + " meter")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

function setLocation(lat, lng) {
  document.querySelector("#latitude").value = lat;
  document.querySelector("#longitude").value = lng;
}
function getLocation() {
  map.locate({
    setView: true,
    maxZoom: 19,
  });
}

//show result
var hasilsurvey = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/icon/circle.png",
        iconSize: [21, 25],
        iconAnchor: [5, 15],
        popupAnchor: [0, -32],
      }),
      riseOnHover: true,
    });
  },

  onEachFeature: function (feature, layer) {
    var urltext = feature.properties.link;
    var match = urltext.match(/[^/?]*[^/?]/g);
    var originalUrl = "https://drive.google.com/file/d/" + match[4] + "/view";
    var newurl = "https://drive.google.com/thumbnail?sz=w1000&id=" + match[4];
    //console.log(text);
    //document.getElementById('foo').appendChild(makeUL(options[1]));

    layer.bindPopup(
      "<table class='table table-striped table-bordered table-condensed' style='font-size: small; width: 350px;'>" +
        "<tr><td>Nama</td><td>" +
        feature.properties.nama +
        "</td></tr>" +
        "<tr><td>Tanggal</td><td>" +
        feature.properties.tanggal +
        "</td></tr>" +
        "<tr><td>Foto</td><td> <a href='" + originalUrl + "' target='_blank'><img src='" +
        newurl +
        "' height='100' width='100'></a></td></tr>" + 
        "</table>",
      {
        maxWidth: 380,
      }
    );
  },
});

// URL to the Google Sheets CSV
const googleSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpjX3woM8-mPVKyqlRqUIozWyEWo4c8-37BE3bPVw6MBDQRoFo4xg4Ndo5xmUzlOCiF-ughPAuyxZq/pub?gid=0&single=true&output=csv';
// Fetch the data, then add it to the map
fetchAndConvertCsvToJson(googleSpreadsheetUrl)
  .then(data => {
    if (data && !data.error) {
      hasilsurvey.addData(data); // Add the GeoJSON data to the Leaflet layer
      hasilsurvey.addTo(map); // Add the layer to the map
    } else {
      console.error('Failed to load or parse CSV data.');
    }
  })
  .catch(error => {
    console.error('Error fetching or converting CSV data:', error);
  });

function _imageProperties(obj) {
  let count = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) ++count;
  }
  if (count == 0) {
    return "-";
  } else {
    let _photodom = "";
    for (var i = 0; i < count; i++) {
      _photodom +=
        `<img src='` + obj[i] + `' width='100' style='margin-right:5px;'/>`;
    }
    return _photodom;
  }
}

// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
  options: {
    position: "bottomleft",
    zoomInText: '<i class="fa fa-plus fa-lg" style="line-height:1.65;"></i>',
    zoomInTitle: "Zoom in",
    zoomOutText: '<i class="fa fa-minus fa-lg" style="line-height:1.65;"></i>',
    zoomOutTitle: "Zoom out",
    zoomHomeText: '<i class="fa fa-home fa-lg" style="line-height:1.65;"></i>',
    zoomHomeTitle: "Zoom home",
  },

  onAdd: function (map) {
    var controlName = "gin-control-zoom",
      container = L.DomUtil.create("div", controlName + " leaflet-bar"),
      options = this.options;

    this._zoomInButton = this._createButton(
      options.zoomInText,
      options.zoomInTitle,
      controlName + "-in",
      container,
      this._zoomIn
    );
    this._zoomHomeButton = this._createButton(
      options.zoomHomeText,
      options.zoomHomeTitle,
      controlName + "-home",
      container,
      this._zoomHome
    );
    this._zoomOutButton = this._createButton(
      options.zoomOutText,
      options.zoomOutTitle,
      controlName + "-out",
      container,
      this._zoomOut
    );

    this._updateDisabled();
    map.on("zoomend zoomlevelschange", this._updateDisabled, this);

    return container;
  },

  onRemove: function (map) {
    map.off("zoomend zoomlevelschange", this._updateDisabled, this);
  },

  _zoomIn: function (e) {
    this._map.zoomIn(e.shiftKey ? 3 : 1);
  },

  _zoomOut: function (e) {
    this._map.zoomOut(e.shiftKey ? 3 : 1);
  },

  _zoomHome: function (e) {
    var lat = -2.6;
    var lng = 118;
    var zoom = 5;
    map.setView([lat, lng], zoom);
  },

  _createButton: function (html, title, className, container, fn) {
    var link = L.DomUtil.create("a", className, container);
    link.innerHTML = html;
    link.href = "#";
    link.title = title;

    L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
      .on(link, "click", L.DomEvent.stop)
      .on(link, "click", fn, this)
      .on(link, "click", this._refocusOnMap, this);

    return link;
  },

  _updateDisabled: function () {
    var map = this._map,
      className = "leaflet-disabled";

    L.DomUtil.removeClass(this._zoomInButton, className);
    L.DomUtil.removeClass(this._zoomOutButton, className);

    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className);
    }
    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className);
    }
  },
});
// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);

var geolocate = document.querySelector("#geo");
geolocate.addEventListener("click", getLocation);

var modal = document.querySelector(".modal");
M.Modal.init(modal, {
  //onOpenStart: loadMap
});

let formulir = document.querySelector("form");
formulir.addEventListener("submit", (event) => {
  event.preventDefault();
  let file = formulir.elements.image.files[0];
  let fr = new FileReader();
  fr.addEventListener("loadend", () => {
    let res = fr.result;
    let spt = res.split("base64,")[1];
    let obj = {
      base64: spt,
      type: file.type,
      name: file.name,
      nama: formulir.elements.nama.value,
      tanggal: formulir.elements.tanggal.value,
      latitude: formulir.elements.latitude.value,
      longitude: formulir.elements.longitude.value,
    };
    fetch(
      "https://script.google.com/macros/s/AKfycbxe-_LQG_t-bE8tUK6pHRODuAQqk7wdXlx5QRg6KqOQ6VijAnF2HxqSEmMTV4w2ljiGgA/exec",
      {
        method: "POST",
        body: JSON.stringify(obj),
      }
    )
      .then((r) => r.text())
      .then((data) => console.log(data));
  });
  fr.readAsDataURL(file);
});

// function myFunction() {
//   //var element = document.getElementById("maprow");
//   //element.classList.toggle("hide");
//   console.log("submitted");
//   window.location.href = "#";
// }
