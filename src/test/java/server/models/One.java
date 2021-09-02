package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Collection;
import java.util.HashSet;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@Entity
@NoArgsConstructor
@Setter
@Getter
public class One extends Persistent {

    private String name;

    @OneToMany(mappedBy = "one", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Many> many = new HashSet<>();


    public One(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
