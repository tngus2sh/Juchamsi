package com.inet.juchamsi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class JuchamsiApplication {

	public static void main(String[] args) {
		SpringApplication.run(JuchamsiApplication.class, args);
	}

}
