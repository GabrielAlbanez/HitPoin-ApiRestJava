package tech.buildrun.springPonto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "tech.buildrun.springPonto")

public class SpringPontoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringPontoApplication.class, args);
	}

}
