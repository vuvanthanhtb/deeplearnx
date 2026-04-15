package com.deeplearnx.infrastructure.persistence;

import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.entity.UserApproveStatus;
import com.deeplearnx.domain.entity.UserApprove;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserApproveRepository extends JpaRepository<UserApprove, Long> {

  Page<UserApprove> findByActionAndStatus(UserApproveAction action, UserApproveStatus status,
      Pageable pageable);

  Page<UserApprove> findByAction(UserApproveAction action, Pageable pageable);

  Page<UserApprove> findByStatus(UserApproveStatus status, Pageable pageable);
}
