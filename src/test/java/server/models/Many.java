package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Many extends Persistent {

    private String name;

    @ManyToOne
    private One one;


    public Many(Long id, String name) {
        this.id = id;
        this.name = name;
    }


    public void setOne(One one) {
        this.one = setManyToOne(this.one, one, One::getMany);
    }

}
