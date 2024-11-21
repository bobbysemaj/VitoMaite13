document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("geoSearchModal");
    const btnHombre = document.getElementById("btnHombre");
    const btnMujer = document.getElementById("btnMujer");
    const btnAmbos = document.getElementById("btnAmbos");
    const distanceSlider = document.getElementById("distanceSlider");
    const distanceValue = document.getElementById("distanceValue");

    if (distanceSlider) {
        distanceSlider.addEventListener("input", () => {
            const selectedDistance = distanceSlider.value;

            // Actualizar el valor mostrado y ajustar el zoom
            distanceValue.textContent = `${selectedDistance} km`;
            actualizarZoomMapa(parseInt(selectedDistance));
        });
    }

    const volverBtnG = document.getElementById("volverBtnG"); // Mover antes de usar

    if (modal)
        modal.style.display = "block";

    if (btnHombre)
        btnHombre.addEventListener("click", () => setGenderPreference("hombre"));
    if (btnMujer)
        btnMujer.addEventListener("click", () => setGenderPreference("mujer"));
    if (btnAmbos)
        btnAmbos.addEventListener("click", () => setGenderPreference("both"));

    if (volverBtnG) {
        volverBtnG.addEventListener("click", () => {
            limpiarMarcadores();
            map = null;
        });
    }

    const params = new URLSearchParams(window.location.search);
    const shouldInitMap = params.get("initMap");
    if (shouldInitMap === "true") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                latRef = latitude;
                lonRef = longitude;

                // Inicializa el mapa después de obtener las coordenadas
                initMap();
            }, () => {
                console.error("Error al obtener la ubicación actual.");
            });
        } else {
            console.error("Geolocalización no está soportada por este navegador.");
        }
        initMap();
    }


});

let latRef = 0;
let lonRef = 0;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        latRef = latitude;
        lonRef = longitude;
    }, () => {
        console.error("Error al obtener la ubicación actual.");
    });
} else {
    console.error("Geolocalización no está soportada por este navegador.");
}
const radio = 100;
let map;
let markers = [];
let currentLocationMarker;
let dynamicCircle;

window.initMap = function () {
    const mapContainer = document.getElementById("mapa-google");

    if (!latRef || !lonRef) {
        console.error("No se encontraron coordenadas válidas para inicializar el mapa.");
        return;
    }

    if (!map) {
        map = new google.maps.Map(mapContainer, {
            zoom: 8,
            center: { lat: latRef, lng: lonRef },
        });
    }

    dynamicCircle =new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.2,
        map,
        center: { lat: latRef, lng: lonRef },
        radius: radio * 1000,
    });
    // Listener para actualizar el deslizador según el zoom
    google.maps.event.addListener(map, "zoom_changed", () => {
        const zoom = map.getZoom();
        actualizarCirculo();
        // Fórmula dinámica: ajusta los valores base y multiplicadores según necesidad
        const baseDistance = 100; // Distancia base en km para zoom 0
        const scale = 0.5; // Factor de escala por nivel de zoom
        const selectedDistance = Math.max(baseDistance * Math.pow(scale, zoom - 8), 1); // Distancia mínima 1 km

        distanceSlider.value = selectedDistance.toFixed(2); // Actualiza el valor del deslizador
        distanceValue.textContent = `${selectedDistance.toFixed(2)} km`; // Actualiza el texto mostrado
        
    });
    

    cargarUbicacionActual();
    cargarUsuarios(map);
};


// Limpia todos los marcadores y el marcador de ubicación actual
function limpiarMarcadores() {
    markers.forEach(marker => marker.setMap(null)); // Eliminar marcadores normales
    markers = []; // Vaciar lista de marcadores

    // Eliminar marcador de ubicación actual si existe
    if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null; // Reiniciar para evitar reutilización
    }
}

// Función para cargar la ubicación actual y asegurarse de que se actualice correctamente
function cargarUbicacionActual() {
    // Eliminar marcador de ubicación actual si existe
    if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null; // Reiniciar para evitar reutilización
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;

            // Limpiar marcador de ubicación actual existente antes de agregar uno nuevo
            if (currentLocationMarker)
                currentLocationMarker.setMap(null);

            currentLocationMarker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map,
                title: "Tu ubicación actual",
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                },
            });

            // Crear y mostrar el InfoWindow al lado del marcador
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="font-size: 14px; padding: 5px;">
                            <strong>Usted se encuentra aquí</strong>
                          </div>`,
            });

            // Abrir el InfoWindow junto al marcador
            infoWindow.open(map, currentLocationMarker);


            // Centrar el mapa en la ubicación actual
            map.setCenter({lat: latitude, lng: longitude});

            // Almacenar la ubicación actual en variables globales para usarla después
            window.currentLatitude = latitude;
            window.currentLongitude = longitude;
        }, () => {
            console.error("Error al obtener la ubicación actual.");
        });
    } else {
        console.error("Geolocalización no está soportada por este navegador.");
    }
}

function cargarUsuarios(map) {
    limpiarMarcadores();

    const solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");
        const request = store.getAll();

        request.onsuccess = function () {
            const usuarios = request.result;

            // Recuperar el usuario actual desde sessionStorage
            let usuarioActual = null;
            for (let i = 0; i < sessionStorage.length; i++) {
                let clave = sessionStorage.key(i);
                let usuario = JSON.parse(sessionStorage.getItem(clave));

                if (usuario && usuario.email) {
                    usuarioActual = usuario.email; // Asignar al usuario actual
                    break; // Detener la búsqueda cuando se encuentre
                }
            }

            if (!usuarioActual) {
                console.error("Usuario actual no encontrado en sessionStorage.");
                return;
            }

            usuarios.forEach((usuario) => {
                if (usuario.latitud && usuario.longitud) {
                    const distancia = calcularDistancia(
                            latRef,
                            lonRef,
                            usuario.latitud,
                            usuario.longitud
                            );

                    // Excluir al usuario actual basado en su email
                    if (usuario.email === usuarioActual) {
                        return;
                    } else if (distancia <= radio) {
                        const marker = new google.maps.Marker({
                            position: {lat: usuario.latitud, lng: usuario.longitud},
                            map,
                            title: usuario.nombre,
                        });

                        markers.push(marker);

                        const infoWindow = new google.maps.InfoWindow({
                            content: `<div>
                                        <strong>${usuario.nombre}</strong><br>
                                        Edad: ${usuario.edad}<br>
                                        Ciudad: ${usuario.ciudad}
                                      </div>`,
                        });

                        marker.addListener("click", () => {
                            infoWindow.open(map, marker);
                        });
                    }
                }
            });
        };

        request.onerror = function () {
            console.error("Error al obtener los usuarios de la base de datos.");
        };
    };

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
}



function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;

    const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function setGenderPreference(preference) {
    console.log(`Preferencia seleccionada: ${preference}`);
    const modal22 = document.getElementById("geoSearchModal");
    modal22.style.display = "none";

    cargarUsuariosConPreferencia(preference);
    cargarUbicacionActual();
}

function cargarUsuariosConPreferencia(preference) {
    limpiarMarcadores();

    const solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");
        const request = store.getAll();

        request.onsuccess = function () {
            const usuarios = request.result.filter(usuario => {
                if (preference === "hombre")
                    return usuario.genero === "H";
                if (preference === "mujer")
                    return usuario.genero === "M";
                return true;
            });
            // Recuperar el usuario actual desde sessionStorage
            let usuarioActual = null;
            for (let i = 0; i < sessionStorage.length; i++) {
                let clave = sessionStorage.key(i);
                let usuario = JSON.parse(sessionStorage.getItem(clave));

                if (usuario && usuario.email) {
                    usuarioActual = usuario.email; // Asignar al usuario actual
                    break; // Detener la búsqueda cuando se encuentre
                }
            }
            if (!usuarioActual) {
                console.error("Usuario actual no encontrado en sessionStorage.");
                return;
            }


            usuarios.forEach((usuario) => {
                if (usuario.latitud && usuario.longitud) {
                    const distancia = calcularDistancia(
                            latRef,
                            lonRef,
                            usuario.latitud,
                            usuario.longitud
                            );
                    // Excluir al usuario actual basado en su email
                    if (usuario.email === usuarioActual) {
                        return;
                    }
                    if (distancia <= radio) {
                        const marker = new google.maps.Marker({
                            position: {lat: usuario.latitud, lng: usuario.longitud},
                            map,
                            title: usuario.nombre,
                        });

                        markers.push(marker);

                        const infoWindow = new google.maps.InfoWindow({
                            content: `<div>
                                        <strong>${usuario.nombre}</strong><br>
                                        Edad: ${usuario.edad}<br>
                                        Ciudad: ${usuario.ciudad}
                                      </div>`,
                        });

                        marker.addListener("click", () => {
                            infoWindow.open(map, marker);
                        });
                    }
                }
            });
        };

        request.onerror = function () {
            console.error("Error al obtener los usuarios de la base de datos.");
        };
    };

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
    cargarUbicacionActual();
}
function actualizarZoomMapa(distancia) {
    if (map && currentLocationMarker && dynamicCircle) {
        dynamicCircle.setRadius(distancia * 1000); // Actualizar radio en metros

        const bounds = dynamicCircle.getBounds(); // Obtener los límites del círculo
        map.fitBounds(bounds); // Ajustar el zoom al área seleccionada
    }
}
// Función para actualizar el círculo dinámicamente
function actualizarCirculo() {
    if (dynamicCircle && map) {
        const zoom = map.getZoom();
        const baseDistance = 100; // Base en km para el zoom
        const scale = 0.5; // Escala por nivel de zoom
        const newDistance = Math.max(baseDistance * Math.pow(scale, zoom - 8), 1); // Mínimo 1 km

        dynamicCircle.setRadius(newDistance * 1000); // Actualizar radio en metros
    }
}
