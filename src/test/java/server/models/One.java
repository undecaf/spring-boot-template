package server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.Instant;
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
@EntityListeners(AuditingEntityListener.class)
public class One extends Persistent {

    private String name;

    @OneToMany(mappedBy = "one", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Many> many = new HashSet<>();

    @ManyToOne
    @LastModifiedBy
    private UserUUID modifiedBy;

    @LastModifiedDate
    private Instant modifiedAt;


    public One(Long id, String name) {
        this.id = id;
        this.name = name;
    }


    public void setMany(Collection<Many> many) {
        setOneToMany(this.many, many, Many::setOne);
    }

}
