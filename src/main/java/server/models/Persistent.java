package server.models;

import javax.persistence.*;


/**
 * Basisklasse aller persistenten Entities mit {@link Long} als Primärschlüssel.
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@MappedSuperclass
public class Persistent extends Related<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Version
    private long version;


    public Long getId() {
        return id;
    }


    public long getETag() {
        return version;
    }

}
