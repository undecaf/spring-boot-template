package server.models;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import server.IntegrationTest;
import server.repositories.ManyRepository;
import server.repositories.OneRepository;

import static org.junit.jupiter.api.Assertions.*;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@IntegrationTest
class OneToManyTest {

    private static String manyName1;

    private static String manyName2;

    private static One saved;

    private static Many m1;

    private static Many m2;


    @Autowired
    private ManyRepository manyRepository;

    @Autowired
    private OneRepository oneRepository;


    @BeforeAll
    static void beforeAll() {
        manyName1 = RandomStringUtils.randomAlphanumeric(8);
        manyName2 = RandomStringUtils.randomAlphanumeric(8);
    }


    @Test
    @Order(10)
    void persistOneToMany() {
        One o = new One(null, "one");
        m1 = new Many(null, manyName1);
        m2 = new Many(null, manyName2);

        m1.setOne(m1.setManyToOne(m1.getOne(), o, One::getMany));
        m2.setOne(m2.setManyToOne(m2.getOne(), o, One::getMany));

        saved = oneRepository.save(o);
    }


    @Test
    @Order(20)
    void persistingOneCascadesToMany() {
        assertEquals(saved, oneRepository.findById(saved.getId()).orElse(null), "saved 1-entity not found");
        assertNotNull(manyRepository.findByName(manyName1), "saved n-entity not found");
        assertNotNull(manyRepository.findByName(manyName2), "saved n-entity not found");
    }


    @Test
    @Order(30)
    void removeMany() {
        // m2 verwaisen lassen
        One o = m2.getOne();
        m2.setOne(m2.setManyToOne(o, null, One::getMany));

        saved = oneRepository.save(o);
    }


    @Test
    @Order(40)
    void orphanWasDeleted() {
        assertNull(manyRepository.findByName(manyName2), "orphaned n-entity still found");
    }


    @Test
    @Order(90)
    void deleteOne() {
        oneRepository.deleteById(saved.getId());
    }


    @Test
    @Order(100)
    void deletingOneCascadesToMany() {
        assertTrue(oneRepository.findById(saved.getId()).isEmpty(), "deleted 1-entity still found");
        assertNull(manyRepository.findByName(manyName1), "deleted n-entity still found");
        assertNull(manyRepository.findByName(manyName2), "deleted n-entity still found");
    }

}