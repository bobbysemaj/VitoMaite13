/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
document.addEventListener('DOMContentLoaded', function () {
    cargarUsuarios();
    obtenerHobbiesDesdeIndexedDB();

    document.getElementById('matchedBtn').onclick = function () {
        mostrarLikesBidireccionales();
        closeProfileModal();
    };
    document.getElementById('likedBtn').onclick = function () {
        mostrarLikesRecibidos();
        closeProfileModal();
    };
    document.getElementById('visitorsBtn').onclick = function () {
        mostrarVisitas();
        closeProfileModal();
    };
    const closeVisitasModalBtn = document.getElementById('closeVisitasModalBtn');
    closeVisitasModalBtn.addEventListener('click', function () {
        closeVisitasModal();
    });

    // Botón de cierre para el modal de likes recibidos
    const closeRLikesModalBtn = document.getElementById('closeRLikesModalBtn');
    closeRLikesModalBtn.addEventListener('click', function () {
        closeRLikesModal();
    });

    // Botón de cierre para el modal de likes dados
    const closeDLikesModalBtn = document.getElementById('closeDLikesModalBtn');
    closeDLikesModalBtn.addEventListener('click', function () {
        closeDLikesModal();
    });
    document.getElementById('profileLink').onclick = function () {
        document.getElementById('profileModal').style.display = "block";
    }
    var ageMinSlider = document.getElementById('ageMin');
    var ageMaxSlider = document.getElementById('ageMax');

    ageMinSlider.addEventListener('input', function () {
        updateAgeMin(ageMinSlider.value);
    });

    ageMaxSlider.addEventListener('input', function () {
        updateAgeMax(ageMaxSlider.value);
    });

    document.getElementById('logoutBtn').onclick = function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    };

    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        // Verificar que el objeto tenga la propiedad 'email' y mostrarla
        if (usuario && usuario.nombre && usuario.genero) {
            console.log(usuario.email);
            var currentUserName = usuario.nombre;
            var currentUserGender = usuario.genero;
            var foto = usuario.foto;
            actualizarHeaderUsuario(currentUserName, currentUserGender, foto);
            break; // Rompe el bucle si solo necesitas el primer email
        }
    }
    document.getElementById("modProfBtn").addEventListener("click", function () {
        // Limpiar el campo de selección de archivo
        document.getElementById("newPhoto").value = "";

        // Desmarcar todos los checkboxes de ciudad
        const checkboxes = document.querySelectorAll('.city-option input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
        document.getElementById("editProfileModal").style.display = "block";
    });

    // Botón para cerrar el modal de perfil
    document.getElementById("closeProfileModalBtn").addEventListener("click", function () {
        document.getElementById("profileModal").style.display = "none";
    });

    // Botón para cerrar el modal de edición de perfil
    document.getElementById("closeEditProfileModalBtn").addEventListener("click", function () {
        document.getElementById("editProfileModal").style.display = "none";
    });

    document.getElementById('saveProfileBtn').addEventListener('click', function () {
        // Obtener el email del usuario actual desde sessionStorage
        let emailUsuarioActual;
        for (let i = 0; i < sessionStorage.length; i++) {
            let clave = sessionStorage.key(i);
            let usuario = JSON.parse(sessionStorage.getItem(clave));
            if (usuario && usuario.email) {
                emailUsuarioActual = usuario.email;
                break; // Rompe el bucle si se encuentra el primer usuario con email
            }
        }

        if (emailUsuarioActual) {
            // Obtener la imagen seleccionada
            const fileInput = document.getElementById('newPhoto');
            const file = fileInput.files[0];
            let nuevaFoto = null;

            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    nuevaFoto = event.target.result; // Base64 de la imagen
                    guardarCambios(emailUsuarioActual, nuevaFoto);
                };
                reader.readAsDataURL(file); // Convierte el archivo a base64 para guardar en IndexedDB
            } else {
                guardarCambios(emailUsuarioActual, null); // Sin nueva foto
            }
        } else {
            alert("No se encontró al usuario actual.");
        }
    });
    document.getElementById("newPhoto").addEventListener("change", function () {
        const fileInput = this;
        const file = fileInput.files[0];
        const preview = document.getElementById("photoPreview");

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = "block"; // Mostrar la imagen
            };
            reader.readAsDataURL(file); // Leer el archivo y mostrar la imagen
        } else {
            preview.src = "";
            preview.style.display = "none"; // Ocultar la imagen si no hay archivo
        }
    });

    document.getElementById("modHobbiesBtn").addEventListener("click", function () {
        // Obtener el email del usuario actual desde sessionStorage
        let emailUsuarioActual;
        for (let i = 0; i < sessionStorage.length; i++) {
            let clave = sessionStorage.key(i);
            let usuario = JSON.parse(sessionStorage.getItem(clave));
            if (usuario && usuario.email) {
                emailUsuarioActual = usuario.email;
                break; // Rompe el bucle si se encuentra el primer usuario con email
            }
        }

        if (emailUsuarioActual) {
            cargarYMarcarHobbies(emailUsuarioActual);
            document.getElementById("editHobbiesModal").style.display = "block";
        } else {
            alert("No se encontró al usuario actual.");
        }
    });

    document.getElementById("closeEditHobbiesModalBtn").addEventListener("click", function () {
        document.getElementById("editHobbiesModal").style.display = "none";
    });

    document.getElementById("saveHobbiesBtn").addEventListener("click", function () {
        let emailUsuarioActual;
        for (let i = 0; i < sessionStorage.length; i++) {
            let clave = sessionStorage.key(i);
            let usuario = JSON.parse(sessionStorage.getItem(clave));
            if (usuario && usuario.email) {
                emailUsuarioActual = usuario.email;
                break; // Rompe el bucle si se encuentra el primer usuario con email
            }
        }
        guardarHobbies(emailUsuarioActual);
    });

    document.getElementById("closeSuccessModalBtn").addEventListener("click", function () {
        document.getElementById("successModal").style.display = "none";
    });
    // Agregar evento de clic al botón de búsqueda
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', buscarUsuarios);

    // Agregar evento de clic al botón de desplegable
    const dropdownButton = document.getElementById('dropdownButton');
    dropdownButton.addEventListener('click', toggleDropdown);

    // Evento para cerrar el modal de perfil
    const closeModal = document.getElementById('closeModal');
    closeModal.addEventListener('click', closeUserProfileModal);




    document.getElementById('dropdown-content').addEventListener('click', function (event) {
        // Check if the click happened on a checkbox
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            // Let the default browser behavior handle the checkbox state
            return;
        }

        // If the click happened on a label, let the label toggle the checkbox as usual
        if (event.target.tagName === 'LABEL') {
            const checkbox = event.target.querySelector('input[type="checkbox"]');
            if (checkbox) {
                // Do not toggle manually; let the label handle it
                return;
            }
        }

        // Handle other clicks as needed
    });




});
function cargarUsuarios() {
    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaction = db.transaction(["Usuarios"], "readonly");
        var store = transaction.objectStore("Usuarios");
        // Obtener todos los registros de la tienda "Usuarios"
        var request = store.getAll();
        request.onsuccess = function () {
            var usuarios = request.result;
            actualizarGaleria(usuarios);
        };
        request.onerror = function () {
            console.error("Error al obtener los usuarios de la base de datos.");
        };
    };
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
}

function actualizarGaleria(usuarios) {
    // Obtener el email del usuario actual desde sessionStorage
    let emailUsuarioActual;
    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));
        if (usuario && usuario.email) {
            emailUsuarioActual = usuario.email;
            break; // Rompe el bucle si se encuentra el primer usuario con email
        }
    }

    // Filtrar la lista de usuarios para excluir al propio usuario actual
    const usuariosFiltrados = usuarios.filter(usuario => usuario.email !== emailUsuarioActual);

    // Ordenar la lista de usuarios por edad de menor a mayor
    usuariosFiltrados.sort((a, b) => a.edad - b.edad);

    var galeria = document.querySelector('.image-gallery');
    galeria.innerHTML = ''; // Limpiar la galería antes de agregar nuevos elementos

    usuariosFiltrados.forEach(function (usuario) {
        var container = document.createElement('div');
        container.className = 'image-container';

        // Crear la imagen de usuario y el nombre de usuario
        var userImg = document.createElement('img');
        userImg.src = usuario.foto;
        userImg.className = 'user-image';
        var userName = document.createElement('p');
        userName.className = 'user-namePr';
        userName.textContent = '@' + usuario.nickname + ', ' + usuario.edad;

        // Agregar evento de clic para abrir el perfil y registrar la visita
        userImg.addEventListener('click', function () {
            openUserProfile(usuario.foto, usuario.nickname, usuario.email);
        });
        userName.addEventListener('click', function () {
            openUserProfile(usuario.foto, usuario.nickname, usuario.email);
        });

        container.appendChild(userImg);
        container.appendChild(userName);


        // Agregar el contenedor a la galería
        galeria.appendChild(container);
    });
}



function buscarUsuarios() {
// Obtener los valores seleccionados del formulario
    var hobbyCheckboxes = document.querySelectorAll('.hobby-options input[type="checkbox"]:checked');
    var hobbiesSeleccionados = Array.from(hobbyCheckboxes).map(cb => cb.value);
    var ciudadCheckboxes = document.querySelectorAll('.city-options input[type="checkbox"]:checked');
    var ciudadesSeleccionadas = Array.from(ciudadCheckboxes).map(cb => cb.value);
    var edadMin = document.getElementById('ageMin').value;
    var edadMax = document.getElementById('ageMax').value;
    var generoCheckboxes = document.querySelectorAll('.gender-options input[type="checkbox"]:checked');
    // Mapeamos los valores de los checkboxes a los valores usados en la BD
    var generosSeleccionados = Array.from(generoCheckboxes).map(cb => {
        switch (cb.value) {
            case 'hombre':
                return 'H';
            case 'mujer':
                return 'M';
            case 'otro':
                return 'O';
            default:
                return '';
        }
    });
    // Llamar a la función para cargar usuarios con los criterios seleccionados
    cargarUsuariosConCriterios(hobbiesSeleccionados, ciudadesSeleccionadas, edadMin, edadMax, generosSeleccionados);
}



function cargarUsuariosConCriterios(hobbies, ciudades, edadMin, edadMax, generos) {
    // Verificar que la edad mínima es menor o igual a la máxima
    
    if (edadMin > edadMax) {
        alert("La edad mínima debe ser menor o igual que la edad máxima.");
        return;
    }

    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;

        // Iniciar una transacción de solo lectura para acceder a la tienda "Usuarios"
        var transaction = db.transaction("Usuarios", "readonly");
        var usuariosStore = transaction.objectStore("Usuarios");

        // Obtener todos los registros de la tienda "Usuarios"
        var usuariosRequest = usuariosStore.getAll();
        usuariosRequest.onsuccess = function () {
            var usuarios = usuariosRequest.result;

            // Filtrar usuarios por los criterios seleccionados
            var usuariosFiltrados = usuarios.filter(function (usuario) {
                var cumpleEdad = usuario.edad >= edadMin && usuario.edad <= edadMax;
                var cumpleCiudad = ciudades.length === 0 || ciudades.includes(usuario.ciudad);
                var cumpleGenero = generos.length === 0 || generos.includes(usuario.genero);
                return cumpleEdad && cumpleCiudad && cumpleGenero;
            });

            if (hobbies.length > 0) {
                var usuariosConHobby = [];

                // Iniciar una transacción de solo lectura para "Hobby" y "UsuarioHobby"
                var transaction = db.transaction(["Hobby", "UsuarioHobby"], "readonly");
                var hobbyStore = transaction.objectStore("Hobby");
                var usuarioHobbyStore = transaction.objectStore("UsuarioHobby");

                // Obtener los IDs de las opciones elegidas en la tabla "Hobby"
                var hobbyIdPromises = hobbies.map(function (hobbyName) {
                    return new Promise(function (resolve, reject) {
                        var index = hobbyStore.index("nombreHobby");
                        var request = index.get(hobbyName);

                        request.onsuccess = function (event) {
                            var result = event.target.result;
                            if (result) {
                                resolve(result.id);
                            } else {
                                console.warn("No se encontró un hobby con el nombre:", hobbyName);
                                resolve(null);
                            }
                        };

                        request.onerror = function () {
                            console.error("Error al obtener el ID del hobby.");
                            reject();
                        };
                    });
                });

                // Obtener los IDs de los hobbies y luego buscar en "UsuarioHobby"
                Promise.all(hobbyIdPromises).then(function (hobbyIds) {
                    // Filtrar IDs no nulos
                    var validHobbyIds = hobbyIds.filter(id => id !== null);

                    if (validHobbyIds.length > 0) {
                        var usuarioPromises = validHobbyIds.map(function (hobbyId) {
                            return new Promise(function (resolve, reject) {
                                var index = usuarioHobbyStore.index("idHobby");
                                var request = index.openCursor(IDBKeyRange.only(hobbyId));

                                request.onsuccess = function (event) {
                                    var cursor = event.target.result;
                                    if (cursor) {
                                        var emailUsuario = cursor.value.email;
                                        var usuario = usuariosFiltrados.find(u => u.email === emailUsuario);
                                        if (usuario && !usuariosConHobby.some(u => u.email === usuario.email)) {
                                            usuariosConHobby.push(usuario);
                                        }

                                        cursor.continue();
                                    } else {
                                        // Finaliza la promesa cuando el cursor ha terminado
                                        resolve();
                                    }
                                };

                                request.onerror = function () {
                                    console.error("Error al buscar usuarios por idHobby.");
                                    reject();
                                };
                            });
                        });

                        Promise.all(usuarioPromises).then(function () {
                            actualizarGaleria(usuariosConHobby);
                        });
                    } else {
                        console.warn("No se encontraron IDs válidos de hobbies para las opciones elegidas.");
                        actualizarGaleria([]);
                    }
                });
            } else {
                actualizarGaleria(usuariosFiltrados);
            }
        };

        usuariosRequest.onerror = function () {
            console.error("Error al obtener los usuarios de la base de datos.");
        };
    };

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
}
function registrarVisita(emailVisitado) {
    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        if (usuario && usuario.email) {
            console.log(usuario.email);
            var emailVisitante = usuario.email; // Obtener email del visitante
            break; // Terminar bucle una vez encontrado
        }
    }

    const fechaHoraActual = new Date().toISOString();

    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaction = db.transaction("UsuarioVisitas", "readwrite");
        var visitasStore = transaction.objectStore("UsuarioVisitas");
        var index = visitasStore.index("emailVisitante"); // Índice para buscar visitas previas

        // Buscar visitas previas con emailVisitante
        var query = index.openCursor(IDBKeyRange.only(emailVisitante));

        query.onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                var visita = cursor.value;
                if (visita.emailVisitado === emailVisitado) {
                    // Si la visita existe, actualizar la última fecha
                    visita.ultVez = fechaHoraActual;
                    var updateRequest = visitasStore.put(visita);
                    updateRequest.onsuccess = function () {
                        console.log("Visita actualizada con éxito.");
                    };
                    updateRequest.onerror = function () {
                        console.error("Error al actualizar la visita.");
                    };
                    return; // Terminar aquí si ya se actualizó
                }
                cursor.continue(); // Continuar iterando si no es la visita buscada
            } else {
                // Si el cursor termina y no encuentra la visita, agregar una nueva
                var nuevaVisita = {
                    emailVisitante: emailVisitante,
                    emailVisitado: emailVisitado,
                    ultVez: fechaHoraActual,
                };
                var addRequest = visitasStore.add(nuevaVisita);
                addRequest.onsuccess = function () {
                    console.log("Visita registrada con éxito.");
                };
                addRequest.onerror = function (evento) {
                    console.error("Error al registrar la visita:", evento.target.error);
                };
            }
        };

        query.onerror = function (evento) {
            console.error("Error al buscar la visita en la base de datos.");
        };
    };

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
}
function openUserProfile(imageSrc, nickname, emailVisitado) {
    // Configurar la imagen y el nombre del perfil
    document.getElementById('profileNickname').innerText = nickname;
    document.getElementById('profileImage').src = imageSrc;

    // Abrir la base de datos
    const solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;

        // Transacción para acceder a la tienda de "Usuarios"
        const transaction = db.transaction(["Usuarios", "UsuarioHobby", "Hobby"], "readonly");
        const usuariosStore = transaction.objectStore("Usuarios");
        const usuarioHobbyStore = transaction.objectStore("UsuarioHobby");
        const hobbyStore = transaction.objectStore("Hobby");

        // Obtener la información del usuario
        const requestUsuario = usuariosStore.index("email").get(emailVisitado);
        requestUsuario.onsuccess = function () {
            const usuario = requestUsuario.result;
            if (usuario) {
                // Mostrar la edad, ciudad y hobbies del usuario
                document.getElementById('profileAge').innerText = `Edad: ${usuario.edad}`;
                document.getElementById('profileCity').innerText = `Ciudad: ${usuario.ciudad}`;
                // Obtener los ID de los hobbies del usuario
                const requestHobbiesUsuario = usuarioHobbyStore.index("email").getAll(emailVisitado);
                requestHobbiesUsuario.onsuccess = function () {
                    const hobbiesUsuario = requestHobbiesUsuario.result;
                    if (hobbiesUsuario.length > 0) {
                        const hobbyIds = hobbiesUsuario.map(hobbyEntry => hobbyEntry.idHobby);
                        const nombresHobbies = [];

                        // Obtener los nombres de los hobbies de la tienda "Hobby"
                        const cursorRequest = hobbyStore.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            const cursor = event.target.result;
                            if (cursor) {
                                if (hobbyIds.includes(cursor.value.id)) {
                                    nombresHobbies.push(cursor.value.nombreHobby);
                                }
                                cursor.continue();
                            } else {
                                // Mostrar los hobbies en el modal una vez que se han obtenido todos
                                document.getElementById('profileHobbies').innerText = `Hobbies: ${nombresHobbies.join(', ')}`;
                            }
                        };
                    } else {
                        document.getElementById('profileHobbies').innerText = 'Hobbies: No tiene hobbies asignados';
                    }
                };
                requestHobbiesUsuario.onerror = function () {
                    console.error('Error al obtener los hobbies del usuario.');
                };

                // Mostrar la ubicación en el mapa
                const profileMapContainer = document.getElementById('profileMapContainer');
                if (usuario.latitud && usuario.longitud) {
                    profileMapContainer.style.display = "block";
                    initProfileMap(usuario.latitud, usuario.longitud, usuario.nickname);
                } else {
                    profileMapContainer.style.display = "none";
                }
            } else {
                console.error('Usuario no encontrado.');
            }
        };

        requestUsuario.onerror = function () {
            console.error('Error al obtener los datos del usuario.');
        };
    };

    solicitud.onerror = function () {
        console.error('Error al abrir la base de datos.');
    };

    // Mostrar el modal
    document.getElementById('userProfileModal').style.display = "block";
    registrarVisita(emailVisitado);
}


function openUserProfile1(imageSrc, nickname, emailVisitado) {
    // Configurar la imagen y el nombre del perfil
    document.getElementById('profileNickname').innerText = nickname;
    document.getElementById('profileImage').src = imageSrc;

    // Abrir la base de datos
    const solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;

        // Transacción para acceder a la tienda de "Usuarios"
        const transaction = db.transaction(["Usuarios", "UsuarioHobby", "Hobby"], "readonly");
        const usuariosStore = transaction.objectStore("Usuarios");
        const usuarioHobbyStore = transaction.objectStore("UsuarioHobby");
        const hobbyStore = transaction.objectStore("Hobby");

        // Obtener la información de ciudad y edad del usuario
        const requestUsuario = usuariosStore.index("email").get(emailVisitado);
        requestUsuario.onsuccess = function () {
            const usuario = requestUsuario.result;
            if (usuario) {
                // Mostrar la edad y la ciudad en el modal
                document.getElementById('profileAge').innerText = `Edad: ${usuario.edad}`;
                document.getElementById('profileCity').innerText = `Ciudad: ${usuario.ciudad}`;

                // Obtener los ID de los hobbies del usuario
                const requestHobbiesUsuario = usuarioHobbyStore.index("email").getAll(emailVisitado);
                requestHobbiesUsuario.onsuccess = function () {
                    const hobbiesUsuario = requestHobbiesUsuario.result;
                    if (hobbiesUsuario.length > 0) {
                        const hobbyIds = hobbiesUsuario.map(hobbyEntry => hobbyEntry.idHobby);
                        const nombresHobbies = [];

                        // Obtener los nombres de los hobbies de la tienda "Hobby"
                        const cursorRequest = hobbyStore.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            const cursor = event.target.result;
                            if (cursor) {
                                if (hobbyIds.includes(cursor.value.id)) {
                                    nombresHobbies.push(cursor.value.nombreHobby);
                                }
                                cursor.continue();
                            } else {
                                // Mostrar los hobbies en el modal una vez que se han obtenido todos
                                document.getElementById('profileHobbies').innerText = `Hobbies: ${nombresHobbies.join(', ')}`;
                            }
                        };
                    } else {
                        document.getElementById('profileHobbies').innerText = 'Hobbies: No tiene hobbies asignados';
                    }
                };
                requestHobbiesUsuario.onerror = function () {
                    console.error('Error al obtener los hobbies del usuario.');
                };
            } else {
                console.error('Usuario no encontrado.');
            }
        };
        requestUsuario.onerror = function () {
            console.error('Error al obtener los datos del usuario.');
        };
    };
    solicitud.onerror = function () {
        console.error('Error al abrir la base de datos.');
    };

    // Mostrar el modal
    document.getElementById('userProfileModal').style.display = "block";
    registrarVisita(emailVisitado);
}



// Función para mostrar las visitas al perfil del usuario actual
function mostrarVisitas() {
// Iterar sobre todas las claves en sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        // Verificar que el objeto tenga la propiedad 'email' y mostrarla
        if (usuario && usuario.email) {
            console.log(usuario.email);
            var currentUserEmail = usuario.email;// Imprime el email encontrado
            break; // Rompe el bucle si solo necesitas el primer email
        }
    }

// Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        // Iniciar una transacción de solo lectura para el almacén "UsuarioVisitas"
        var transaction = db.transaction(["UsuarioVisitas", "Usuarios"], "readonly");
        var visitasStore = transaction.objectStore("UsuarioVisitas");
        var usuariosStore = transaction.objectStore("Usuarios");
        // Crear un índice para buscar las visitas por emailVisitado
        var visitasIndex = visitasStore.index("emailVisitado");
        var query = visitasIndex.openCursor(IDBKeyRange.only(currentUserEmail));
        // Limpiar la lista de visitas antes de llenarla
        var visitasList = document.getElementById('visitasList');
        visitasList.innerHTML = '';
        query.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var visita = cursor.value;
                // Buscar el usuario que realizó la visita en la tienda de "Usuarios"
                var usuarioQuery = usuariosStore.index("email").get(visita.emailVisitante);
                usuarioQuery.onsuccess = function () {
                    var usuarioVisitante = usuarioQuery.result;
                    if (usuarioVisitante) {
                        // Crear un elemento de lista para mostrar la visita
                        var listItem = document.createElement('li');
                        listItem.textContent = `${usuarioVisitante.nombre} (@${usuarioVisitante.nickname}) - Última visita: ${new Date(visita.ultVez).toLocaleString()}`;
                        visitasList.appendChild(listItem);
                    }
                };
                // Continuar con el siguiente cursor
                cursor.continue();
            }
        };
        query.onerror = function () {
            console.error("Error al buscar visitas en la base de datos.");
        };
    };
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
    // Mostrar el modal de visitas
    document.getElementById('visitasModal').style.display = "block";
}

// Función para cerrar el modal de visitas
function closeVisitasModal() {
    document.getElementById('visitasModal').style.display = "none";
}

function registrarLike(emailLikeado) {
    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        // Verificar que el objeto tenga la propiedad 'email' y mostrarla
        if (usuario && usuario.email) {
            console.log(usuario.email);
            var currentUserEmail = usuario.email;// Imprime el email encontrado
            break; // Rompe el bucle si solo necesitas el primer email
        }
    }

// Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        // Iniciar una transacción de lectura/escritura
        var transaction = db.transaction("Likes", "readwrite");
        var likesStore = transaction.objectStore("Likes");
        // Crear un índice compuesto para buscar por emailLikeador y emailLikeado
        var index = likesStore.index("emailLikeador");
        var query = index.openCursor(IDBKeyRange.only(emailLikeador));
        query.onsuccess = function (event) {
            var cursor = event.target.result;
            var encontrado = false;
            while (cursor) {
                var like = cursor.value;
                if (like.emailLikeado === emailLikeado) {
                    encontrado = true;
                    break; // Salir del loop si encontramos la tupla
                }
                cursor.continue();
            }

            if (encontrado) {

            } else {
                // Si no existe, agregamos una nueva tupla de visita
                var nuevoLike = {
                    emailLikeador: emailLikeador,
                    emailLikeado: emailLikeado,
                };
                var addRequest = likesStore.add(nuevoLike);
                addRequest.onsuccess = function () {
                    console.log("Like registrado con éxito.");
                };
                addRequest.onerror = function (evento) {
                    console.error("Error al registrar el like:", evento.target.error);
                };
            }
        };
        query.onerror = function (evento) {
            console.error("Error al buscar el like en la base de datos.");
        };
    };
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
}

// Función para mostrar las visitas al perfil del usuario actual
function mostrarLikesRecibidos() {
    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        // Verificar que el objeto tenga la propiedad 'email' y mostrarla
        if (usuario && usuario.email) {
            console.log(usuario.email);
            var currentUserEmail = usuario.email;// Imprime el email encontrado
            break; // Rompe el bucle si solo necesitas el primer email
        }
    }

// Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        // Iniciar una transacción de solo lectura para el almacén "UsuarioVisitas"
        var transaction = db.transaction(["Likes", "Usuarios"], "readonly");
        var likesStore = transaction.objectStore("Likes");
        var usuariosStore = transaction.objectStore("Usuarios");
        // Crear un índice para buscar las visitas por emailVisitado
        var likesIndex = likesStore.index("emailLikeado");
        var query = likesIndex.openCursor(IDBKeyRange.only(currentUserEmail));
        // Limpiar la lista de visitas antes de llenarla
        var likesList = document.getElementById('likesList');
        likesList.innerHTML = '';
        query.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var like = cursor.value;
                // Buscar el usuario que realizó la visita en la tienda de "Usuarios"
                var usuarioQuery = usuariosStore.index("email").get(like.emailLikeador);
                usuarioQuery.onsuccess = function () {
                    var usuarioLikeador = usuarioQuery.result;
                    if (usuarioLikeador) {
                        // Crear un elemento de lista para mostrar la visita
                        var listItem = document.createElement('li');
                        listItem.textContent = `${usuarioLikeador.nombre} (@${usuarioLikeador.nickname})`;
                        likesList.appendChild(listItem);
                    }
                };
                // Continuar con el siguiente cursor
                cursor.continue();
            }
        };
        query.onerror = function () {
            console.error("Error al buscar likes en la base de datos.");
        };
    };
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
    // Mostrar el modal de visitas
    document.getElementById('likesRModal').style.display = "block";
}
// Función para mostrar solo los likes bidireccionales
function mostrarLikesBidireccionales() {

    for (let i = 0; i < sessionStorage.length; i++) {
        let clave = sessionStorage.key(i);
        let usuario = JSON.parse(sessionStorage.getItem(clave));

        // Verificar que el objeto tenga la propiedad 'email' y mostrarla
        if (usuario && usuario.email) {
            console.log(usuario.email);
            var currentUserEmail = usuario.email;// Imprime el email encontrado
            break; // Rompe el bucle si solo necesitas el primer email
        }
    }

    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite13", 1);
    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        // Iniciar una transacción de solo lectura para el almacén "Likes" y "Usuarios"
        var transaction = db.transaction(["Likes", "Usuarios"], "readonly");
        var likesStore = transaction.objectStore("Likes");
        var usuariosStore = transaction.objectStore("Usuarios");

        // Crear un índice para buscar las visitas por emailLikeado
        var likesIndex = likesStore.index("emailLikeado");
        var query = likesIndex.openCursor(IDBKeyRange.only(currentUserEmail));

        // Limpiar la lista de visitas antes de llenarla
        var likesDList = document.getElementById('likesDList');
        likesDList.innerHTML = '';

        query.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var like = cursor.value;
                var emailLikeador = like.emailLikeador;

                // Verificar si existe la relación inversa (bidireccional)
                var reverseQuery = likesStore.index("emailLikeado").openCursor(IDBKeyRange.only(emailLikeador));
                reverseQuery.onsuccess = function (reverseEvent) {
                    var reverseCursor = reverseEvent.target.result;
                    var isBidirectional = false;

                    while (reverseCursor) {
                        var reverseLike = reverseCursor.value;
                        if (reverseLike.emailLikeador === currentUserEmail) {
                            isBidirectional = true;
                            break;
                        }
                        reverseCursor.continue();
                        // Asegúrate de que el cursor no intente continuar si es null
                        if (!reverseCursor) {
                            return;
                        }
                    }

                    if (isBidirectional) {
                        // Buscar el usuario que realizó el like en la tienda de "Usuarios"
                        var usuarioQuery = usuariosStore.index("email").get(emailLikeador);
                        usuarioQuery.onsuccess = function () {
                            var usuarioLikeador = usuarioQuery.result;
                            if (usuarioLikeador) {
                                // Crear un elemento de lista para mostrar el like bidireccional
                                var listItem = document.createElement('li');
                                listItem.textContent = `${usuarioLikeador.nombre} (@${usuarioLikeador.nickname})`;
                                likesDList.appendChild(listItem);
                            }
                        };
                    }
                };

                // Continuar con el siguiente cursor
                cursor.continue();
            }
        };

        query.onerror = function () {
            console.error("Error al buscar likes en la base de datos.");
        };
    };

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };

    // Mostrar el modal de likes
    document.getElementById('likesDModal').style.display = "block";
}

function closeDLikesModal() {
    document.getElementById('likesDModal').style.display = "none";
}
// Función para alternar el "like" en el perfil
// Función para alternar el "like" en el perfil

function closeRLikesModal() {
    document.getElementById('likesRModal').style.display = "none";
}



function obtenerHobbiesDesdeIndexedDB() {
// Abrir conexión a la base de datos
    const request = indexedDB.open('vitomaite13', 1);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['Hobby'], 'readonly');
        const objectStore = transaction.objectStore('Hobby');
        const hobbiesContainer = document.querySelector('.hobby-options');
        hobbiesContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const hobby = cursor.value.nombreHobby; // Asumiendo que la columna 'nombre' tiene el nombre del hobby
                // Crear un checkbox para cada hobby
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'hobbies';
                checkbox.value = hobby;
                // Listener para el checkbox
                checkbox.addEventListener('click', function () {
                    console.log(`Hobby seleccionado: ${hobby}`);
                });

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(hobby));
                hobbiesContainer.appendChild(label);
                cursor.continue();
            }
        };
    };
    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}
function toggleDropdown() {
    var dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
// Cerrar el modal de perfil
function closeProfileModal() {
    document.getElementById('profileModal').style.display = "none";
}




// Función para actualizar el valor de la edad mínima
function updateAgeMin(value) {
    document.getElementById('min-age-label').textContent = value;
}

// Función para actualizar el valor de la edad máxima
function updateAgeMax(value) {
    document.getElementById('max-age-label').textContent = value;
}








// Función para cerrar el modal de perfil
function closeUserProfileModal() {
    // Cambiar el display del modal para que se oculte
    document.getElementById('userProfileModal').style.display = "none";
}






// Código para rotar las imágenes de fondo
const images = ["img/map.jpg", "img/map1.jpg", "img/map2.jpg"];
let currentIndex = 0;

function rotateBackgroundImage() {
    const mapImageElement = document.querySelector(".map-image");
    mapImageElement.src = images[currentIndex];
    currentIndex = (currentIndex + 1) % images.length; // Ciclo entre las imágenes
}

// Cambiar la imagen cada 5 segundos (5000 milisegundos)
setInterval(rotateBackgroundImage, 5000);


// Función para actualizar el header basado en el nombre y género del usuario
function actualizarHeaderUsuario(nombre, genero, foto) {
    // Selecciona el elemento del header donde aparece el saludo
    const headerElement = document.querySelector('.welcome-header');

    // Crea el contenido del saludo
    let saludo = '';
    if (genero.toUpperCase() === 'M') {
        saludo = `Hola ${nombre}, bienvenida a VitoMaite.`;
    } else if (genero.toUpperCase() === 'H') {
        saludo = `Hola ${nombre}, bienvenido a VitoMaite.`;
    } else {
        saludo = `Hola ${nombre}, bienvenid@ a VitoMaite.`;
    }

    // Crea el contenedor de la imagen
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('user-photo-container'); // Asigna la clase CSS

    if (foto) {
        const imgElement = document.createElement('img');
        imgElement.src = foto;
        imgElement.alt = 'Foto de usuario';
        imgElement.classList.add('user-photo'); // Asigna la clase CSS para la imagen
        imgContainer.appendChild(imgElement);
    }
    headerElement.textContent = ''; // Limpia el texto actual
    headerElement.appendChild(imgContainer);
    headerElement.appendChild(document.createTextNode(saludo));

}


function handleLogin(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Obtener el email y la contraseña introducidos en el formulario
    var email = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Abrir la base de datos para verificar las credenciales
    var request = indexedDB.open("vitomaite13", 1);
    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(["Usuarios"], "readonly");
        var store = transaction.objectStore("Usuarios");
        var index = store.index("email");

        // Buscar el email introducido en la base de datos
        var query = index.get(email);
        query.onsuccess = function () {
            var user = query.result;
            // Comprobar si el usuario con este email existe y si la contraseña coincide
            if (user && user.password === password) {
                // Guardar los datos del usuario en sessionStorage en formato JSON
                sessionStorage.setItem(email, JSON.stringify(user));

                // Comprobar el estado de la suscripción premium
                if (user.premium === "true") {
                    // Usuario premium, redirigir a indexPremium.html
                    window.location.href = 'indexPremium.html';
                } else {
                    // Usuario no premium, redirigir a indexLogueado.html
                    window.location.href = 'indexLogueado.html';
                }
            } else {
                // Mostrar un mensaje de error si las credenciales son incorrectas
                alert("Email o contraseña incorrectos. Inténtalo de nuevo.");
            }
        };
        query.onerror = function () {
            // Mostrar un mensaje de error si algo sale mal
            alert("Ocurrió un error al verificar tus credenciales.");
        };
    };
    request.onerror = function (event) {
        // Mostrar un mensaje de error si hay un problema al abrir la base de datos
        alert("No se pudo acceder a la base de datos.");
    };
    obtenerHobbiesUsuario(email);

}
function modificarUsuarioFoto(email, nuevaFoto) {
    var solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaction = db.transaction(["Usuarios"], "readwrite");
        var usuariosStore = transaction.objectStore("Usuarios");

        // Buscar al usuario por su email
        var indice = usuariosStore.index("email");
        var solicitudUsuario = indice.get(email);

        solicitudUsuario.onsuccess = function () {
            var usuario = solicitudUsuario.result;

            if (usuario) {
                // Actualizar la foto o la ciudad si se proporcionan nuevos valores
                if (nuevaFoto)
                    usuario.foto = nuevaFoto;


                // Guardar los cambios en la base de datos
                var solicitudActualizacion = usuariosStore.put(usuario);
                sessionStorage.setItem(email, JSON.stringify(usuario));
                solicitudActualizacion.onsuccess = function () {
                    console.log("Usuario actualizado con éxito:", usuario);


                };
                solicitudActualizacion.onerror = function (evento) {
                    console.error("Error al actualizar el usuario:", evento.target.error);
                };
            } else {
                alert("Usuario no encontrado.");
            }
        };

        solicitudUsuario.onerror = function () {
            console.error("Error al buscar el usuario.");
        };
    };

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };

}
function modificarUsuarioCiudad(email, nuevaCiudad) {
    var solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaction = db.transaction(["Usuarios"], "readwrite");
        var usuariosStore = transaction.objectStore("Usuarios");

        // Buscar al usuario por su email
        var indice = usuariosStore.index("email");
        var solicitudUsuario = indice.get(email);

        solicitudUsuario.onsuccess = function () {
            var usuario = solicitudUsuario.result;

            if (usuario) {
                // Actualizar la foto o la ciudad si se proporcionan nuevos valores
                if (nuevaCiudad)
                    usuario.ciudad = nuevaCiudad;


                // Guardar los cambios en la base de datos
                var solicitudActualizacion = usuariosStore.put(usuario);
                sessionStorage.setItem(email, JSON.stringify(usuario));
                solicitudActualizacion.onsuccess = function () {
                    console.log("Usuario actualizado con éxito:", usuario);


                };
                solicitudActualizacion.onerror = function (evento) {
                    console.error("Error al actualizar el usuario:", evento.target.error);
                };
            } else {
                alert("Usuario no encontrado.");
            }
        };

        solicitudUsuario.onerror = function () {
            console.error("Error al buscar el usuario.");
        };
    };

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };

}
function guardarCambios(email, nuevaFoto) {
    const ciudadSeleccionada = document.querySelector('.city-option input[type="checkbox"]:checked');
    const nuevaCiudad = ciudadSeleccionada ? ciudadSeleccionada.value : null;
    let x = 0;
    if (nuevaFoto) {
        // Llamar a la función para modificar el usuario
        modificarUsuarioFoto(email, nuevaFoto);
        x = 1;
        limpiarVistaPrevia();
        for (let i = 0; i < sessionStorage.length; i++) {
            let clave = sessionStorage.key(i);
            let usuario = JSON.parse(sessionStorage.getItem(clave));

            // Verificar que el objeto tenga la propiedad 'email' y mostrarla
            if (usuario && usuario.nombre && usuario.genero) {
                console.log(usuario.email);
                var currentUserName = usuario.nombre;
                var currentUserGender = usuario.genero;

                actualizarHeaderUsuario(currentUserName, currentUserGender, nuevaFoto);
                break; // Rompe el bucle si solo necesitas el primer email
            }
        }
    } else {
        if (nuevaCiudad) {
            modificarUsuarioCiudad(email, nuevaCiudad);
            limpiarCheckboxesCiudad();
            x = 1;
        }


    }
    if (x === 1) {
        mostrarSuccessModal();
    }

}
function obtenerHobbiesUsuario(emailUsuario) {
    const request = indexedDB.open('vitomaite13', 1);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['UsuarioHobby', 'Hobby'], 'readonly');
        const usuarioHobbyStore = transaction.objectStore('UsuarioHobby');
        const hobbyStore = transaction.objectStore('Hobby');

        // Obtener los registros de UsuarioHobby asociados al email del usuario
        const usuarioHobbiesRequest = usuarioHobbyStore.index('email').getAll(emailUsuario);
        usuarioHobbiesRequest.onsuccess = function () {
            const usuarioHobbyEntries = usuarioHobbiesRequest.result;
            const usuarioHobbyIds = usuarioHobbyEntries.map(entry => entry.idHobby);
            console.log('En usuarioHobby...');
            if (usuarioHobbyIds.length > 0) {
                // Crear un mapa de IDs de hobbies y nombres de la tienda Hobby
                const hobbiesMap = new Map();
                hobbyStore.openCursor().onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        const hobby = cursor.value;
                        hobbiesMap.set(hobby.id, hobby.nombreHobby);
                        console.log('Cargando hobbies en el modal2...');
                        cursor.continue();
                    } else {
                        // Generar los checkboxes dinámicamente en el contenedor de opciones de hobbies
                        const checkboxContainer = document.querySelector('.hobby-options1');
                        checkboxContainer.innerHTML = ''; // Limpiar cualquier contenido existente

                        hobbiesMap.forEach((nombreHobby, idHobby) => {
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.value = nombreHobby;
                            checkbox.id = `hobby-${idHobby}`;

                            const label = document.createElement('label');
                            label.htmlFor = `hobby-${idHobby}`;
                            label.textContent = nombreHobby;

                            checkboxContainer.appendChild(checkbox);
                            checkboxContainer.appendChild(label);
                            checkboxContainer.appendChild(document.createElement('br'));

                            // Verificar si el hobby está en la lista de hobbies del usuario
                            if (usuarioHobbyIds.includes(idHobby)) {
                                checkbox.checked = true;
                            }
                        });

                        console.log('Cargando hobbies en el modal1...');
                    }
                };

                hobbyStore.openCursor().onerror = function () {
                    console.error('Error al abrir el cursor para Hobby.');
                };
            } else {
                console.warn('El usuario no tiene hobbies asignados.');
            }
        };

        usuarioHobbiesRequest.onerror = function () {
            console.error('Error al obtener los hobbies del usuario.');
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}


function limpiarVistaPrevia() {
    const fileInput = document.getElementById("newPhoto");
    const preview = document.getElementById("photoPreview");

    // Limpiar el input de archivo
    fileInput.value = "";

    // Limpiar la vista previa de la imagen
    preview.src = "";
    preview.style.display = "none"; // Ocultar la imagen
}

function limpiarCheckboxesCiudad() {
    const checkboxes = document.querySelectorAll('.city-option input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Desmarcar cada checkbox
    });
}
function mostrarSuccessModal() {
    document.getElementById("successModal").style.display = "flex";
}

function cargarYMarcarHobbies(emailUsuario) {
    const request = indexedDB.open('vitomaite13', 1);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['Hobby', 'UsuarioHobby'], 'readonly');
        const hobbyStore = transaction.objectStore('Hobby');
        const usuarioHobbyStore = transaction.objectStore('UsuarioHobby');
        const hobbiesContainer = document.querySelector('.hobby-options1');
        hobbiesContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        // Obtener los hobbies del usuario actual
        const usuarioHobbiesRequest = usuarioHobbyStore.index('email').getAll(emailUsuario);
        usuarioHobbiesRequest.onsuccess = function () {
            const usuarioHobbyEntries = usuarioHobbiesRequest.result;
            const usuarioHobbyIds = usuarioHobbyEntries.map(entry => entry.idHobby);

            // Obtener todos los hobbies y crear los checkboxes
            hobbyStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const hobby = cursor.value;

                    // Crear un ID único para evitar conflictos
                    const uniqueId = `user-hobby-${hobby.id}`;

                    // Crear y configurar el checkbox
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = `user-hobbies-${hobby.id}`; // Name único
                    checkbox.value = hobby.id; // ID del hobby como valor
                    checkbox.id = uniqueId; // ID único para cada checkbox

                    // Verificar si el hobby está en la lista del usuario y marcarlo
                    if (usuarioHobbyIds.includes(hobby.id)) {
                        checkbox.checked = true;
                    }

                    // Agregar checkbox y label al contenedor
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(hobby.nombreHobby));
                    hobbiesContainer.appendChild(label);
                    hobbiesContainer.appendChild(document.createElement('br'));

                    cursor.continue();
                }
            };
        };

        usuarioHobbiesRequest.onerror = function () {
            console.error('Error al obtener los hobbies del usuario.');
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}

function guardarHobbies(emailUsuario) {
    console.log(emailUsuario);
    const checkboxes = document.querySelectorAll('.hobby-options1 input[type="checkbox"]');
    const hobbiesSeleccionados = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            hobbiesSeleccionados.push(checkbox.value); // Obtener el ID del hobby seleccionado
        }
    });

    console.log('Hobbies seleccionados:', hobbiesSeleccionados);

    const request = indexedDB.open('vitomaite13', 1);
    request.onsuccess = function (event) {
        const db = event.target.result;

        // Obtener los hobbies actuales del usuario desde la base de datos
        const usuarioHobbyStore = db.transaction(['UsuarioHobby'], 'readonly').objectStore('UsuarioHobby');
        const usuarioHobbiesRequest = usuarioHobbyStore.index('email').getAll(emailUsuario);

        usuarioHobbiesRequest.onsuccess = function () {
            const usuarioHobbyEntries = usuarioHobbiesRequest.result;
            const hobbiesActuales = usuarioHobbyEntries.map(entry => entry.idHobby); // IDs de hobbies actuales en la base de datos

            // Identificar hobbies a eliminar y hobbies a añadir
            const hobbiesAEliminar = hobbiesActuales.filter(hobbyId => !hobbiesSeleccionados.includes(hobbyId.toString()));
            const hobbiesANuevos = hobbiesSeleccionados.filter(hobbyId => !hobbiesActuales.includes(Number(hobbyId)));

            console.log('Hobbies a eliminar:', hobbiesAEliminar);
            console.log('Hobbies nuevos:', hobbiesANuevos);

            // Transacción para eliminar hobbies
            const deleteTransaction = db.transaction(['UsuarioHobby'], 'readwrite');
            const deleteStore = deleteTransaction.objectStore('UsuarioHobby');

            hobbiesAEliminar.forEach(hobby => {
                const deleteRequest = deleteStore.index('email').openCursor(IDBKeyRange.only(emailUsuario));
                deleteRequest.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor && cursor.value.idHobby === hobby) {
                        cursor.delete(); // Eliminar el registro del hobby para el usuario específico
                        console.log(`He borrado el hobby con ID ${hobby} para el usuario ${emailUsuario}`);
                    }
                    if (cursor)
                        cursor.continue();
                };
                deleteRequest.onerror = function () {
                    console.error(`Error al intentar borrar el hobby con ID ${hobby} para el usuario ${emailUsuario}`);
                };
            });

            deleteTransaction.oncomplete = function () {
                console.log('Eliminación de hobbies completada.');

                // Transacción para agregar nuevos hobbies
                const addTransaction = db.transaction(['UsuarioHobby'], 'readwrite');
                const addStore = addTransaction.objectStore('UsuarioHobby');

                hobbiesANuevos.forEach(hobbyId => {
                    addStore.add({
                        email: emailUsuario,
                        idHobby: Number(hobbyId),
                    }).onsuccess = function () {
                        console.log(`Hobby agregado con ID ${hobbyId} para el usuario ${emailUsuario}`);
                    };
                });

                addTransaction.oncomplete = function () {
                    console.log('Adición de nuevos hobbies completada.');
                    document.getElementById("editHobbiesModal").style.display = "none"; // Cerrar el modal al guardar
                    mostrarSuccessModal(); // Mostrar el modal de éxito
                };

                addTransaction.onerror = function () {
                    console.error('Error al agregar nuevos hobbies.');
                };
            };

            deleteTransaction.onerror = function () {
                console.error('Error al eliminar hobbies.');
            };
        };

        usuarioHobbiesRequest.onerror = function () {
            console.error('Error al obtener los hobbies actuales del usuario.');
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
}


function agregarUsuarioHobby(nombreHobby, emailUsuario) {
    const solicitud = indexedDB.open("vitomaite13", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaction = db.transaction(["Hobby", "UsuarioHobby"], "readwrite");
        const hobbyStore = transaction.objectStore("Hobby");
        const usuarioHobbyStore = transaction.objectStore("UsuarioHobby");

        // Buscar el ID del hobby por su nombre
        const cursorRequest = hobbyStore.openCursor();
        let hobbyEncontrado = false;

        cursorRequest.onsuccess = function (evento) {
            const cursor = evento.target.result;
            if (cursor) {
                if (cursor.value.nombreHobby === nombreHobby) {
                    hobbyEncontrado = true;
                    const idHobby = cursor.value.id; // Usar la clave primaria 'id'

                    // Verificar si la combinación idHobby-email ya existe en UsuarioHobby
                    const query = usuarioHobbyStore.index("email").openCursor(IDBKeyRange.only(emailUsuario));
                    let existe = false;

                    query.onsuccess = function (evento) {
                        const resultCursor = evento.target.result;

                        if (resultCursor) {
                            if (resultCursor.value.idHobby === idHobby) {
                                existe = true;
                                console.log(`El usuario ${emailUsuario} ya tiene el hobby con ID ${idHobby}.`);
                            }
                            resultCursor.continue(); // Continuar solo si el cursor no ha terminado
                        } else {
                            if (!existe) {
                                // Añadir el registro a UsuarioHobby si no existe
                                usuarioHobbyStore.add({idHobby: idHobby, email: emailUsuario})
                                        .onsuccess = function () {
                                            console.log(`Hobby con ID ${idHobby} añadido para el usuario ${emailUsuario}.`);
                                        };
                            }
                        }
                    };

                    query.onerror = function () {
                        console.error("Error al verificar si ya existe el hobby para el usuario.");
                    };

                    return; // Terminar la búsqueda una vez encontrado
                }
                cursor.continue(); // Continuar buscando
            } else {
                if (!hobbyEncontrado) {
                    console.log(`El hobby '${nombreHobby}' no existe en la tabla de Hobbies. No se ha añadido.`);
                }
            }
        };

        cursorRequest.onerror = function () {
            console.error("Error al buscar en la tabla de hobbies.");
        };
    };

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos.");
    };
}

// Funciones para cerrar los modales (debes definir estas funciones en tu JS si no lo has hecho ya)
function closeVisitasModal() {
    document.getElementById('visitasModal').style.display = 'none';
}

function closeRLikesModal() {
    document.getElementById('likesRModal').style.display = 'none';
}

function closeDLikesModal() {
    document.getElementById('likesDModal').style.display = 'none';
}

// Define las funciones si no están definidas aún
function closeUserProfileModal() {
    document.getElementById('userProfileModal').style.display = 'none';
}

let profileMap;
let profileMarker;

function initProfileMap(lat, lng, nickname) {
    const mapContainer = document.getElementById('profileMapContainer');

    if (!profileMap) {
        profileMap = new google.maps.Map(mapContainer, {
            zoom: 12, // Zoom inicial
            center: {lat, lng}, // Centrar el mapa en la ubicación del usuario
        });
    } else {
        profileMap.setCenter({lat, lng}); // Actualizar el centro del mapa
    }

    // Crear o actualizar el marcador
    if (profileMarker)
        profileMarker.setMap(null); // Eliminar marcador anterior si existe
    profileMarker = new google.maps.Marker({
        position: {lat, lng},
        map: profileMap,
        title: nickname, // Mostrar el nombre del usuario
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
    });
}
