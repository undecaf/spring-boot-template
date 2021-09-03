package server.repositories;

import at.rennweg.htl.sew.autoconfig.UserInfoRepository;
import server.models.UserUUID;

import java.util.UUID;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
public interface UserUUIDRepository extends UserInfoRepository<UserUUID, UUID> {

}
