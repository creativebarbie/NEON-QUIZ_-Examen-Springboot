package com.barbie.quiz.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barbie.quiz.model.Pregunta;
import com.barbie.quiz.model.Respuesta;
import com.barbie.quiz.repository.PreguntaRepository;
import com.barbie.quiz.repository.RespuestaRepository;

@RestController
@RequestMapping("/api")
public class QuizController {

    private final PreguntaRepository preguntaRepository;
    private final RespuestaRepository respuestaRepository;

    public QuizController(
            PreguntaRepository preguntaRepository,
            RespuestaRepository respuestaRepository) {
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
    }

    @GetMapping("/preguntas")
    public List<Pregunta> obtenerPreguntas() {
        return preguntaRepository.findAll();
    }

    @PostMapping("/respuestas")
    public Respuesta guardarRespuesta(@RequestBody Respuesta respuesta) {
        return respuestaRepository.save(respuesta);
    }
}