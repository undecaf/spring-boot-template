package server.repositories;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import server.IntegrationTest;
import server.models.One;

import static org.junit.jupiter.api.Assertions.*;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@IntegrationTest
class OneRepositoryTest {

    private static One entity;

    private static One saved;

    @Autowired
    private OneRepository repository;


    @BeforeAll
    static void beforeAll() {
        entity = new One(null, RandomStringUtils.randomAlphanumeric(8));
    }


    @Test
    @Order(10)
    void persistsEntity() {
        saved = repository.save(entity);
    }


    @Test
    @Order(20)
    void findsEntity() {
        One found = repository.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals(saved, found);
        assertEquals(saved.getName(), found.getName());

        repository.deleteById(saved.getId());
    }


    @Test
    @Order(30)
    void deletesEntity() {
        assertTrue(repository.findById(saved.getId()).isEmpty());
    }

}