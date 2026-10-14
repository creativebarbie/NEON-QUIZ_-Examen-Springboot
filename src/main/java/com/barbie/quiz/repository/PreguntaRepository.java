package com.barbie.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbie.quiz.model.Pregunta;

public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {

}