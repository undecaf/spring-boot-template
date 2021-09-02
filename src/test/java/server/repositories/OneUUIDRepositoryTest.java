package server.repositories;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import server.IntegrationTest;
import server.models.OneUUID;

import static org.junit.jupiter.api.Assertions.*;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@IntegrationTest
class OneUUIDRepositoryTest {

    private static OneUUID entity;

    private static OneUUID saved;

    @Autowired
    private OneUUIDRepository repository;


    @BeforeAll
    static void beforeAll() {
        entity = new OneUUID(null, RandomStringUtils.randomAlphanumeric(8));
    }


    @Test
    @Order(10)
    void persistsEntity() {
        saved = repository.save(entity);
    }


    @Test
    @Order(20)
    void findsEntity() {
        OneUUID found = repository.findById(saved.getId()).orElse(null);

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