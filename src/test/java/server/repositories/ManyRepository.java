package server.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import server.models.Many;


/**
 *
 * @author F. Kasper, ferdinand.kasper@bildung.gv.at
 */
@RepositoryRestResource
public interface ManyRepository extends CrudRepository<Many, Long> {

    Many findByName(String name);

}
