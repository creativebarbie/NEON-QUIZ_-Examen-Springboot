// =====================================================
// NEON QUIZ // MAIN SYSTEM
// =====================================================

let preguntas = [];
let preguntaActual = 0;
let puntuacion = 0;


// =====================================================
// MEZCLAR ARRAY
// Fisher-Yates
// =====================================================

function mezclar(array) {

    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] =
            [copia[j], copia[i]];
    }

    return copia;
}


// =====================================================
// CARGAR PREGUNTAS
// =====================================================

async function cargarPreguntas() {

    try {

        const respuesta =
            await fetch("/api/preguntas");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las preguntas"
            );

        }


        const datos =
            await respuesta.json();


        if (datos.length === 0) {

            throw new Error(
                "No hay preguntas disponibles"
            );

        }


        // =============================================
        // MEZCLAR LAS PREGUNTAS
        // =============================================

        preguntas = mezclar(datos);


        preguntaActual = 0;

        puntuacion = 0;


        mostrarPregunta();


    } catch (error) {

        console.error("ERROR:", error);


        document.getElementById(
            "pregunta"
        ).textContent =
            "ERROR // DATABASE CONNECTION FAILED";


        document.getElementById(
            "opciones"
        ).innerHTML = "";


        document.getElementById(
            "mensaje"
        ).textContent =
            "NO DATA AVAILABLE";
    }
}


// =====================================================
// MOSTRAR PREGUNTA
// =====================================================

function mostrarPregunta() {

    const pregunta =
        preguntas[preguntaActual];


    if (!pregunta) {

        return;

    }


    // =================================================
    // CONTADOR
    // =================================================

    document.getElementById(
        "contador"
    ).textContent =
        `QUESTION ${String(preguntaActual + 1).padStart(2, "0")} / ${preguntas.length}`;


    // =================================================
    // PUNTUACIÓN
    // =================================================

    document.getElementById(
        "puntuacion"
    ).textContent =
        `SCORE: ${String(puntuacion).padStart(2, "0")}`;


    // =================================================
    // PREGUNTA
    // =================================================

    const preguntaElemento =
        document.getElementById("pregunta");


    preguntaElemento.textContent =
        pregunta.pregunta;


    // Animación

    preguntaElemento.classList.remove(
        "question-enter"
    );


    void preguntaElemento.offsetWidth;


    preguntaElemento.classList.add(
        "question-enter"
    );


    // =================================================
    // PROGRESO
    // =================================================

    const progreso =
        ((preguntaActual + 1) /
            preguntas.length) * 100;


    const porcentaje =
        Math.round(progreso);


    document.getElementById(
        "progress-fill"
    ).style.width =
        `${progreso}%`;


    document.getElementById(
        "progress-percent"
    ).textContent =
        `${String(porcentaje).padStart(2, "0")}%`;


    // =================================================
    // CREAR OPCIONES
    // =================================================

    const opciones = [

        {
            texto: pregunta.opcionA,
            correcta:
                pregunta.respuestaCorrecta === "A"
        },

        {
            texto: pregunta.opcionB,
            correcta:
                pregunta.respuestaCorrecta === "B"
        },

        {
            texto: pregunta.opcionC,
            correcta:
                pregunta.respuestaCorrecta === "C"
        },

        {
            texto: pregunta.opcionD,
            correcta:
                pregunta.respuestaCorrecta === "D"
        }

    ];


    // =================================================
    // MEZCLAR OPCIONES
    // =================================================

    const opcionesMezcladas =
        mezclar(opciones);


    // =================================================
    // ASIGNAR NUEVAS LETRAS A/B/C/D
    // =================================================

    const letras = [
        "A",
        "B",
        "C",
        "D"
    ];


    // Guardamos las opciones para esta pregunta

    pregunta.opcionesMostradas =
        opcionesMezcladas.map(
            (opcion, indice) => ({

                letra: letras[indice],

                texto: opcion.texto,

                correcta: opcion.correcta

            })
        );


    // Encontrar cuál es ahora la letra correcta

    const opcionCorrecta =
        pregunta.opcionesMostradas.find(
            opcion => opcion.correcta
        );


    pregunta.respuestaCorrectaMostrada =
        opcionCorrecta.letra;


    // =================================================
    // PINTAR BOTONES
    // =================================================

    const contenedor =
        document.getElementById(
            "opciones"
        );


    contenedor.innerHTML = "";


    pregunta.opcionesMostradas.forEach(
        (opcion, indice) => {


            const boton =
                document.createElement(
                    "button"
                );


            boton.classList.add(
                "opcion"
            );


            // Animación escalonada

            boton.style.animationDelay =
                `${indice * 0.08}s`;


            // Texto

            boton.textContent =
                `${opcion.letra}. ${opcion.texto}`;


            // Click

            boton.addEventListener(
                "click",
                () => comprobarRespuesta(
                    opcion.letra
                )
            );


            contenedor.appendChild(
                boton
            );

        }
    );


    // =================================================
    // LIMPIAR MENSAJE
    // =================================================

    document.getElementById(
        "mensaje"
    ).textContent = "";


    // =================================================
    // OCULTAR NEXT
    // =================================================

    document.getElementById(
        "siguiente"
    ).hidden = true;
}


// =====================================================
// COMPROBAR RESPUESTA
// =====================================================

async function comprobarRespuesta(
    respuesta
) {

    const pregunta =
        preguntas[preguntaActual];


    const botones =
        document.querySelectorAll(
            ".opcion"
        );


    // =================================================
    // BLOQUEAR BOTONES
    // =================================================

    botones.forEach(
        boton => {
            boton.disabled = true;
        }
    );


    // =================================================
    // BOTÓN SELECCIONADO
    // =================================================

    let botonSeleccionado = null;


    botones.forEach(
        boton => {

            if (
                boton.textContent.startsWith(
                    `${respuesta}.`
                )
            ) {

                botonSeleccionado =
                    boton;

            }

        }
    );


    // =================================================
    // COMPROBAR
    // =================================================

    const esCorrecta =
        respuesta ===
        pregunta.respuestaCorrectaMostrada;


    // =================================================
    // CORRECTA
    // =================================================

    if (esCorrecta) {

        puntuacion++;


        if (botonSeleccionado) {

            botonSeleccionado.classList.add(
                "selected",
                "correct"
            );

        }


        document.getElementById(
            "mensaje"
        ).textContent =
            "✓ CORRECT // DATA ACCEPTED";

    }


    // =================================================
    // INCORRECTA
    // =================================================

    else {

        if (botonSeleccionado) {

            botonSeleccionado.classList.add(
                "selected",
                "incorrect"
            );

        }


        // Mostrar la correcta

        botones.forEach(
            boton => {

                if (
                    boton.textContent.startsWith(
                        `${pregunta.respuestaCorrectaMostrada}.`
                    )
                ) {

                    boton.classList.add(
                        "correct"
                    );

                }

            }
        );


        document.getElementById(
            "mensaje"
        ).textContent =
            `✕ INCORRECT // CORRECT ANSWER: ${pregunta.respuestaCorrectaMostrada}`;

    }


    // =================================================
    // ACTUALIZAR PUNTOS
    // =================================================

    document.getElementById(
        "puntuacion"
    ).textContent =
        `SCORE: ${String(puntuacion).padStart(2, "0")}`;


    // =================================================
    // GUARDAR EN MYSQL
    // =================================================

    await guardarRespuesta(
        respuesta,
        pregunta.id
    );


    // =================================================
    // MOSTRAR NEXT
    // =================================================

    document.getElementById(
        "siguiente"
    ).hidden = false;
}


// =====================================================
// GUARDAR RESPUESTA
// =====================================================

async function guardarRespuesta(
    respuesta,
    preguntaId
) {

    try {

        const resultado =
            await fetch(
                "/api/respuestas",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        respuesta:
                            respuesta,

                        preguntaId:
                            preguntaId

                    })

                }
            );


        if (!resultado.ok) {

            throw new Error(
                "No se pudo guardar la respuesta"
            );

        }


        console.log(
            `Respuesta ${respuesta} guardada para pregunta ${preguntaId}`
        );


    } catch (error) {

        console.error(
            "ERROR AL GUARDAR:",
            error
        );


        document.getElementById(
            "mensaje"
        ).textContent =
            "⚠ DATABASE SAVE ERROR";
    }
}


// =====================================================
// SIGUIENTE PREGUNTA
// =====================================================

document
    .getElementById("siguiente")
    .addEventListener(
        "click",
        () => {

            preguntaActual++;


            if (
                preguntaActual <
                preguntas.length
            ) {

                mostrarPregunta();

            } else {

                mostrarResultado();

            }

        }
    );


// =====================================================
// RESULTADO FINAL
// =====================================================

function mostrarResultado() {

    document.getElementById(
        "quiz"
    ).hidden = true;


    document.getElementById(
        "resultado"
    ).hidden = false;


    const porcentaje =
        Math.round(
            (puntuacion /
                preguntas.length) * 100
        );


    document.getElementById(
        "resultado-final"
    ).textContent =
        `HAS CONSEGUIDO ${puntuacion} PUNTOS DE ${preguntas.length}.`;


    document.getElementById(
        "final-score"
    ).textContent =
        `${porcentaje}%`;


    // =================================================
    // NIVEL
    // =================================================

    let nivel;


    if (porcentaje >= 90) {

        nivel = "LEGENDARY";

    } else if (porcentaje >= 75) {

        nivel = "MASTER";

    } else if (porcentaje >= 50) {

        nivel = "RUNNER";

    } else {

        nivel = "ROOKIE";

    }


    document.getElementById(
        "resultado"
    ).dataset.level =
        nivel;


    console.log(
        `FINAL RESULT: ${nivel}`
    );
}


// =====================================================
// REINICIAR
// =====================================================

document
    .getElementById("reiniciar")
    .addEventListener(
        "click",
        () => {

            preguntaActual = 0;

            puntuacion = 0;


            document.getElementById(
                "quiz"
            ).hidden = false;


            document.getElementById(
                "resultado"
            ).hidden = true;


            document.getElementById(
                "progress-fill"
            ).style.width =
                "0%";


            document.getElementById(
                "progress-percent"
            ).textContent =
                "00%";


            // Al reiniciar se vuelven
            // a mezclar preguntas y respuestas

            cargarPreguntas();

        }
    );


// =====================================================
// START SYSTEM
// =====================================================

cargarPreguntas();