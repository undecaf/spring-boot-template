package server.models;

import org.springframework.util.ObjectUtils;

import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;


/**
 * Abstrakte Basisklasse für persistente Entities mit Methoden, die für
 * 1:n-Beziehungen hilfreich sind.
 * <p/>
 * Implementiert {@link #equals(Object)} und {@link #hashCode()} auf Basis
 * von {@link #getId() id}s, damit man Entities in {@link Set}s verwenden kann.
 * Erleichtert die bidirektionalen Updates von 1:n-Beziehungen zwischen Entities.
 *
 * @param <ID> Datentyp des Primärschlüssels
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@MappedSuperclass
public abstract class Related<ID extends Serializable> {

    public abstract ID getId();


    /**
     * Vergleicht Entities auf Basis ihrer {@link #getId() id}s.
     * Entities mit {@code null}-{@link #getId()} id}s gelten
     * als verschieden.
     */
    @Override
    public boolean equals(Object other) {
        return (other == this)
            || ((getId() != null)
            && (other != null)
            && getClass().equals(other.getClass())
            && getId().equals(((Related<ID>) other).getId()));
    }


    /**
     * Passend zu {@link #equals(Object)}.
     */
    @Override
    public int hashCode() {
        return ObjectUtils.nullSafeHashCode(getId());
    }


    /**
     * Hilfsmethode für die 1-Seite einer 1:n-Beziehung, die auch die n-Seite aktualisiert.
     *
     * Pro 1:n-Beziehung entweder diese Methode verwenden oder {@link #setManyToOne(Related, Related, Function)},
     * aber nicht beide.
     *
     * @param <O>
     *      Datentyp der 1-Seite
     * @param <M>
     *      Datentyp der n-Seite
     * @param <C>
     *      {@link Collection} oder Subklasse
     * @param many
     *      derzeitige {@link Collection} von n-Entities auf der 1-Seite
     * @param newMany
     *      {@link Collection} von n-Entities, die der 1-Seite zugewiesen werden soll
     * @param setOne
     *      {@linkplain BiConsumer set-Methode} der n-Seite für die Entity der 1-Seite
     * @return
     *      {@link Collection} von n-Entities, die zugewiesen wurde
     */
    protected <O extends Related<ID>, M extends Related<ID>,C extends Collection<M>>
    void setOneToMany(C many, C newMany, BiConsumer<M, O> setOne) {

        // Soll überhaupt eine andere Collection zugewiesen werden?
        if (newMany != many) {
            // Gibt es derzeit eine Collection von n-Entities?
            if (many != null) {
                // Alle bisherigen n-Entities entfernen, ConcurrentModificationException vermeiden
                new ArrayList<M>(many).forEach(e -> setOne.accept(e, null));
            }

            // Wurde eine neue Collection von n-Entities angegeben?
            if (newMany != null) {
                // Alle neuen n-Entities hinzufügen, ConcurrentModificationException vermeiden
                new ArrayList<>(newMany).forEach(e -> setOne.accept(e, (O) this));
            }
        }
    }


    /**
     * Hilfsmethode für die n-Seite einer 1:n-Beziehung, die auch die 1-Seite aktualisiert.
     *
     * Pro 1:n-Beziehung entweder diese Methode verwenden oder {@link #setOneToMany(Collection, Collection, BiConsumer)},
     * aber nicht beide.
     *
     * @param <O>
     *      Datentyp der 1-Seite
     * @param <M>
     *      Datentyp der n-Seite
     * @param <C>
     *      {@link Collection} oder Subklasse
     * @param one
     *      derzeitige 1-Entity auf der n-Seite
     * @param newOne
     *      1-Entity, die der n-Seite zugewiesen werden soll
     * @param getMany
     *      {@linkplain Function get-Methode} der 1-Seite für die {@link Collection} der n-Entities
     * @return
     *      1-Entity, die zugewiesen wurde
     */
    protected <O extends Related<ID>, M extends Related<ID>, C extends Collection<M>>
    O setManyToOne(O one, O newOne, Function<O, C> getMany) {

        // Soll überhaupt eine andere Entity zugewiesen werden?
        if (newOne != one) {
            C many;

            // Gibt es derzeit eine 1-Entity, und gibt es dort eine Collection von n-Entities?
            if ((one != null) && ((many = getMany.apply(one)) != null)) {
                // Diese Entity von der bisherigen 1-Entity entfernen
                many.remove(this);
            }

            // Wurde eine neue 1-Entity angegeben, und besitzt diese eine Collection von n-Entities?
            if (newOne != null) {
                if ((many = getMany.apply(newOne)) != null) {
                    // Diese Entity zur neuen 1-Entity hinzufügen
                    many.add((M) this);

                } else {
                    // Collection von n-Entities fehlt auf der 1-Seite
                    throw new IllegalStateException("@ManyToOne: no collection at One-side");
                }
            }
        }

        return newOne;
    }

}
