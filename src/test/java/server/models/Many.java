package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.SneakyThrows;
import org.apache.commons.lang3.reflect.FieldUtils;

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
        setId(id);
        this.name = name;
    }


    @SneakyThrows
    public void setId(Long id) {
        FieldUtils.writeField(this, "id", id, true);
    }


    public void setOne(One one) {
        this.one = setManyToOne(this.one, one, One::getMany);
    }

}
