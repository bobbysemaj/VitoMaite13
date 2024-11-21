let userMap;
let userMarker;

document.addEventListener("DOMContentLoaded", () => {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const userLat = parseFloat(params.get("lat"));
    const userLng = parseFloat(params.get("lng"));
    const userName = params.get("name");

    // Inicializar el mapa con la ubicación del usuario seleccionado
    initUserMap(userLat, userLng, userName);
});

function initUserMap(lat, lng, name) {
    const mapContainer = document.getElementById("user-map-container");

    if (!userMap) {
        userMap = new google.maps.Map(mapContainer, {
            zoom: 12, // Zoom inicial
            center: { lat, lng }, // Centrar el mapa en la ubicación del usuario
        });
    }

    // Crear un marcador para la ubicación del usuario
    if (userMarker) userMarker.setMap(null); // Eliminar marcador anterior si existe

    userMarker = new google.maps.Marker({
        position: { lat, lng },
        map: userMap,
        title: name, // Nombre del usuario
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
    });

    // Mostrar un InfoWindow con el nombre del usuario
    const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-size: 14px; padding: 5px;">
                    <strong>${name}</strong>
                  </div>`,
    });

    infoWindow.open(userMap, userMarker);
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


