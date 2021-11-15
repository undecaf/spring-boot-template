package server.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import server.UnitTest;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@UnitTest
class RelatedTest {

    private One null1, null2, o1a, o1b;
    private Many m1, m2, m3;

    @BeforeEach
    void beforeEach() {
        null1 = new One(null, "null");
        null2 = new One(null, "null");
        o1a = new One(1L, "one-1a");
        o1b = new One(1L, "one-1b");
        m1 = new Many(1L, "many-1");
        m2 = new Many(2L, "many-2");
        m3 = new Many(3L, "many-3");
    }

    @Test
    @Order(10)
    void whenBothIdsAreNull_thenEntitiesAreNeverEqual() {
        assertNotEquals(null1, null2);
    }


    @Test
    @Order(20)
    void anEntityIsAlwaysEqualToItself() {
        assertEquals(null1, null1);
        assertEquals(o1a, o1a);
    }


    @Test
    @Order(30)
    void whenIdsAreEqual_thenEntitiesAreAlwaysEqual() {
        assertEquals(o1a, o1b);
    }


    @Test
    @Order(40)
    void addsManyEntityToOneSide() {
        m1.setOne(m1.setManyToOne(m1.getOne(), o1a, One::getMany));

        assertEquals(1, o1a.getMany().size(), "collection is empty");
        assertTrue(o1a.getMany().contains(m1), "n-entity missing from collection");
        assertEquals(m1.getOne(), o1a, "1-entity not set");
    }


    @Test
    @Order(50)
    void removesManyEntityFromOneSide() {
        m1.setOne(m1.setManyToOne(m1.getOne(), o1a, One::getMany));
        m1.setOne(m1.setManyToOne(m1.getOne(), null, One::getMany));

        assertEquals(0, o1a.getMany().size(), "collection not empty");
        assertNull(m1.getOne(), "1-entity still set");
    }


    @Test
    @Order(50)
    void setsCollectionOnManySide() {
        o1a.setOneToMany(o1a.getMany(), new HashSet<Many>(Set.of(m1, m2)), Many::setOne);

        assertNotNull(o1a.getMany(), "collection is null");
        assertTrue(o1a.getMany().contains(m1), "n-entity missing from collection");
        assertTrue(o1a.getMany().contains(m2), "n-entity missing from collection");
        assertEquals(m1.getOne(), o1a, "1-entity not set");
        assertEquals(m2.getOne(), o1a, "1-entity not set");
    }


    @Test
    @Order(60)
    void replacesCollectionOnManySide() {
        o1a.setOneToMany(o1a.getMany(), new HashSet<Many>(Set.of(m1, m2)), Many::setOne);
        o1a.setOneToMany(o1a.getMany(), new HashSet<>(), Many::setOne);

        assertNotNull(o1a.getMany(), "collection is null");
        assertEquals(0, o1a.getMany().size(), "collection not empty");
        assertNull(m1.getOne(), "1-entity still set");
        assertNull(m2.getOne(), "1-entity still set");
    }

}