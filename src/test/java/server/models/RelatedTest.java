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

    private One o1a, o1b;
    private Many null1, null2, m1, m2;

    @BeforeEach
    void beforeEach() {
        o1a = new One(1L, "one-1a");
        o1b = new One(1L, "one-1b");
        null1 = new Many(null, "null");
        null2 = new Many(null, "null");
        m1 = new Many(1L, "many-1");
        m2 = new Many(2L, "many-2");
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
        m1.setOne(o1a);

        assertEquals(1, o1a.getMany().size(), "collection has wrong size");
        assertTrue(o1a.getMany().contains(m1), "n-entity missing from collection");
        assertEquals(m1.getOne(), o1a, "1-entity not set");
    }


    @Test
    @Order(45)
    void addsManyEntityWithNullIdToOneSide() {
        null1.setOne(o1a);

        assertEquals(1, o1a.getMany().size(), "collection has wrong size");
        assertTrue(o1a.getMany().contains(null1), "n-entity missing from collection");
        assertEquals(null1.getOne(), o1a, "1-entity not set");
    }


    @Test
    @Order(50)
    void removesManyEntityFromOneSide() {
        m1.setOne(o1a);
        m1.setOne(null);

        assertEquals(0, o1a.getMany().size(), "collection not empty");
        assertNull(m1.getOne(), "1-entity still set");
    }


    /**
     * This situation may occur in the course of a Hibernate session
     * if a detached many-entity is persisted *after* it was added to
     * a one-entity.
     */
    @Test
    @Order(60)
    void removesManyEntityFromOneSideIfManyIdInitiallyNull() {
        null1.setOne(o1a);
        Long id = 42L;
        null1.setId(id);
        assertFalse(o1a.getMany().contains(null1), "modified n-entity still found in collection");

        null1.setOne(null);

        assertEquals(0, o1a.getMany().size(), "collection not empty");
        assertNull(null1.getOne(), "1-entity still set");
        assertEquals(null1.getId(), id);
    }


    @Test
    @Order(70)
    void setsCollectionOnManySide() {
        o1a.setMany(new HashSet<>(Set.of(m1, m2)));

        assertNotNull(o1a.getMany(), "collection is null");
        assertTrue(o1a.getMany().contains(m1), "n-entity missing from collection");
        assertTrue(o1a.getMany().contains(m2), "n-entity missing from collection");
        assertEquals(m1.getOne(), o1a, "1-entity not set");
        assertEquals(m2.getOne(), o1a, "1-entity not set");
    }


    @Test
    @Order(80)
    void replacesCollectionOnManySide() {
        o1a.setMany(new HashSet<>(Set.of(m1, m2)));
        o1a.setMany(new HashSet<>());

        assertNotNull(o1a.getMany(), "collection is null");
        assertEquals(0, o1a.getMany().size(), "collection not empty");
        assertNull(m1.getOne(), "1-entity still set");
        assertNull(m2.getOne(), "1-entity still set");
    }

}