package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.domain.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  boolean existsByUsernameAndIdNot(String username, Long id);

  boolean existsByEmailAndIdNot(String email, Long id);
}
