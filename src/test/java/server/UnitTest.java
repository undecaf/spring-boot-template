package server;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;


/**
 * Führt den annotierten Test als Unit-Test aus.
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@EnabledIfEnvironmentVariable(named = "UNIT_TESTS", matches = "\\S+")
public @interface UnitTest {
}
