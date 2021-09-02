package server.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import server.models.One;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@RepositoryRestResource
public interface OneRepository extends CrudRepository<One, Long> {

}
