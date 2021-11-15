package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Collection;
import java.util.HashSet;
import java.util.UUID;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@Entity
@NoArgsConstructor
@Setter
@Getter
public class OneUUID extends PersistentUUID {

    private String name;

    @OneToMany(mappedBy = "one", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<ManyUUID> many = new HashSet<>();


    public OneUUID(UUID id, String name) {
        this.id = id;
        this.name = name;
    }


    public void setMany(Collection<ManyUUID> many) {
        setOneToMany(this.many, many, ManyUUID::setOne);
    }

}
