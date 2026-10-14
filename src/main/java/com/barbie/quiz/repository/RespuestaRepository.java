package com.barbie.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbie.quiz.model.Respuesta;

public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {

}