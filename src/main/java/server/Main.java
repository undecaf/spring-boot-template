package server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 * Startet den Server für statische Inhalte und für das REST-API.
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@SpringBootApplication
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}

}
