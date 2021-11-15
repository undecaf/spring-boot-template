package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.util.UUID;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
public class ManyUUID extends PersistentUUID {

    private String name;

    @ManyToOne
    private OneUUID one;


    public ManyUUID(UUID id, String name) {
        this.id = id;
        this.name = name;
    }


    public void setOneUUID(OneUUID one) {
        this.one = setManyToOne(this.one, one, OneUUID::getMany);
    }

}
