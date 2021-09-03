package server.repositories;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import server.IntegrationTest;
import server.models.One;
import server.models.UserUUID;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@IntegrationTest
public class AuditingTest {

    private static String username1;

    private static String username2;

    private static String plainPassword;

    private static String password;

    private static UserUUID user1;

    private static UserUUID user2;

    private static Long id;

    private static Instant createdAt;

    private static Instant modifiedAt;


    @Autowired
    private UserUUIDRepository userRepository;

    @Autowired
    private OneRepository oneRepository;


    @BeforeAll
    static void beforeAll() {
        username1 = RandomStringUtils.randomAlphabetic(8);
        username2 = RandomStringUtils.randomAlphabetic(8);
        plainPassword = RandomStringUtils.randomAlphanumeric(8);
        password = new BCryptPasswordEncoder().encode(plainPassword);

        user1 = new UserUUID();
        user1.setUsername(username1);
        user1.setPassword(password);

        user2 = new UserUUID();
        user2.setUsername(username2);
        user2.setPassword(password);
    }


    @Test
    @Order(10)
    void persistUsers() {
        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
    }


    @Test
    @Order(20)
    void persistEntity() {
        authenticate(user1);
        One o = new One(null, "abc");
        o = oneRepository.save(o);
        id = o.getId();
        createdAt = o.getModifiedAt();

        // In Autoconfig: @EnableJpaAuditing(modifyOnCreate = true)
        assertNotNull(createdAt, "modifiedAt is null");
        assertEquals(SecurityContextHolder.getContext().getAuthentication().getPrincipal(), o.getModifiedBy());
    }


    @Test
    @Order(30)
    void retrieveEntity() {
        authenticate(user1);
        One o = oneRepository.findById(id).orElseThrow();

        // In Autoconfig: @EnableJpaAuditing(modifyOnCreate = true)
        assertEquals(createdAt, o.getModifiedAt());
        assertEquals(SecurityContextHolder.getContext().getAuthentication().getPrincipal(), o.getModifiedBy());
    }


    @Test
    @Order(40)
    void modifyEntity() {
        authenticate(user2);
        One o = oneRepository.findById(id).orElseThrow();
        o.setName(o.getName() + "x");
        o = oneRepository.save(o);
        modifiedAt = o.getModifiedAt();

        assertNotNull(modifiedAt);
        assertNotEquals(createdAt, modifiedAt);
        assertEquals(SecurityContextHolder.getContext().getAuthentication().getPrincipal(), o.getModifiedBy());
    }


    @Test
    @Order(50)
    void retrieveModifiedEntity() {
        authenticate(user1);
        One o = oneRepository.findById(id).orElseThrow();

        assertEquals(modifiedAt, o.getModifiedAt());
        assertEquals(username2, o.getModifiedBy().getUsername());
    }


    private void authenticate(UserUUID user) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user, plainPassword);
        SecurityContextHolder.getContext().setAuthentication(token);
    }

}
