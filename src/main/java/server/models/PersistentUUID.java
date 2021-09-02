package server.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import java.util.UUID;


/**
 * Basisklasse aller persistenten Entities mit {@link UUID} als Primärschlüssel.
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@MappedSuperclass
public class PersistentUUID extends Related<UUID> {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    protected UUID id;

    @Version
    private long version;


    public UUID getId() {
        return id;
    }


    public long getETag() {
        return version;
    }

}
