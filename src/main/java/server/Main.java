package server;

import de.invesdwin.instrument.DynamicInstrumentationLoader;
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
		SpringApplication application = new SpringApplication(Main.class);

		// Zuallererst den Java Instrumentation-Agent laden und weaven
		application.addInitializers(context -> {
			DynamicInstrumentationLoader.waitForInitialized();
			DynamicInstrumentationLoader.initLoadTimeWeavingContext();
		});

		application.run(args);
	}

}
