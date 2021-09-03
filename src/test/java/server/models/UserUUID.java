package server.models;

import at.rennweg.htl.sew.autoconfig.UserInfo;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import java.util.UUID;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@Entity
@Getter
@Setter
public class UserUUID extends PersistentUUID implements UserInfo<UUID> {

    @Column(nullable = false, unique = true)
    @NotBlank
    private String username;

    private String password;

}
