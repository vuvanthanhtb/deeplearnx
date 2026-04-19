package com.deeplearnx.application.service.impl;

import com.deeplearnx.application.dto.request.CreateUserRequest;
import com.deeplearnx.application.dto.request.RegisterRequest;
import com.deeplearnx.application.dto.request.UpdateUserRequest;
import com.deeplearnx.application.dto.response.BulkActionResult;
import com.deeplearnx.application.dto.response.BulkActionResult.BulkActionFailure;
import com.deeplearnx.application.dto.response.UserApproveResponse;
import com.deeplearnx.application.mapper.UserApproveMapper;
import com.deeplearnx.application.service.UserApproveService;
import com.deeplearnx.core.entity.Role;
import com.deeplearnx.core.entity.UserApproveAction;
import com.deeplearnx.core.exception.ForbiddenException;
import com.deeplearnx.core.entity.UserApproveStatus;
import com.deeplearnx.core.entity.UserStatus;
import com.deeplearnx.core.exception.BadRequestException;
import com.deeplearnx.core.exception.ConflictException;
import com.deeplearnx.core.exception.NotFoundException;
import com.deeplearnx.core.response.PageResponse;
import com.deeplearnx.domain.entity.User;
import com.deeplearnx.domain.entity.UserApprove;
import com.deeplearnx.infrastructure.persistence.UserApproveQueryRepository;
import com.deeplearnx.infrastructure.persistence.UserApproveRepository;
import com.deeplearnx.infrastructure.persistence.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserApproveServiceImpl implements UserApproveService {

  private final UserApproveRepository userApproveRepository;
  private final UserApproveQueryRepository userApproveQueryRepository;
  private final UserRepository userRepository;
  private final UserApproveMapper userApproveMapper;
  private final PasswordEncoder passwordEncoder;

  @Override
  public PageResponse<UserApproveResponse> findAll(String action, String status, String createdBy,
      String fromDate, String toDate, int page, int size) {
    return PageResponse.of(
        userApproveQueryRepository.search(action, status, createdBy, fromDate, toDate,
            PageRequest.of(page, size)),
        userApproveMapper::toResponse);
  }

  @Override
  public UserApproveResponse findById(Long id) {
    return userApproveQueryRepository.findById(id)
        .map(userApproveMapper::toResponse)
        .orElseThrow(() -> new NotFoundException("User approval request not found"));
  }

  @Override
  @Transactional
  public UserApproveResponse create(CreateUserRequest request) {
    log.info("Create user approve request for username={}, roles={}", request.username(), request.roles());
    if (userRepository.existsByUsername(request.username())) {
      throw new ConflictException("Username already exists");
    }
    if (userRepository.existsByEmail(request.email())) {
      throw new ConflictException("Email already exists");
    }
    CreateUserRequest encodedRequest = new CreateUserRequest(
        request.username(),
        request.email(),
        passwordEncoder.encode(request.password()),
        request.fullName(),
        request.roles()
    );
    UserApprove approve = buildApprove(null, UserApproveAction.CREATE, null);
    approve.setUsername(request.username());
    approve.setEmail(request.email());
    approve.setFullName(request.fullName());
    approve.setRoles(request.roles() != null ? request.roles() : List.of());
    return saveAndFetch(approve);
  }

  @Override
  @Transactional
  public UserApproveResponse update(Long id, UpdateUserRequest request) {
    log.info("Update user approve request for userId={}", id);
    User user = getUser(id);
    checkAdminNotPrivilegedTarget(user);
    UpdateUserRequest sanitized = isPrivilegedCurrentUser() ? request
        : new UpdateUserRequest(request.fullName(), request.email(), null);
    UserApprove approve = buildApproveForUser(id, user, UserApproveAction.UPDATE, null);
    return saveAndFetch(approve);
  }

  @Override
  @Transactional
  public UserApproveResponse delete(Long id) {
    log.info("Delete user approve request for userId={}", id);
    checkSuperAdminNotSelf(id);
    User user = getUser(id);
    checkAdminNotPrivilegedTarget(user);
    return saveAndFetch(buildApproveForUser(id, user, UserApproveAction.DELETE, null));
  }

  @Override
  @Transactional
  public UserApproveResponse lock(Long id) {
    log.info("Lock user approve request for userId={}", id);
    checkSuperAdminNotSelf(id);
    User user = getUser(id);
    checkAdminNotPrivilegedTarget(user);
    return saveAndFetch(buildApproveForUser(id, user, UserApproveAction.LOCK, null));
  }

  @Override
  @Transactional
  public UserApproveResponse unlock(Long id) {
    log.info("Unlock user approve request for userId={}", id);
    checkSuperAdminNotSelf(id);
    User user = getUser(id);
    checkAdminNotPrivilegedTarget(user);
    return saveAndFetch(buildApproveForUser(id, user, UserApproveAction.UNLOCK, null));
  }

  @Override
  @Transactional
  public UserApproveResponse approve(Long id) {
    log.info("Approving user approve id={}", id);
    UserApprove approve = getApprove(id);
    if (approve.getStatus() != UserApproveStatus.APPROVING) {
      throw new BadRequestException("This approval request has already been processed");
    }
    switch (approve.getAction()) {
      case REGISTER -> applyRegister(approve);
      case CREATE   -> applyCreate(approve);
      case UPDATE   -> applyUpdate(approve);
      case DELETE   -> applyDelete(approve);
      case LOCK     -> applyLock(approve);
      case UNLOCK   -> applyUnlock(approve);
    }
    approve.setStatus(UserApproveStatus.APPROVED);
    userApproveRepository.save(approve);
    log.info("Approved user approve id={}, action={}", id, approve.getAction());
    return findById(id);
  }

  @Override
  @Transactional
  public UserApproveResponse reject(Long id) {
    log.info("Rejecting user approve id={}", id);
    UserApprove approve = getApprove(id);
    if (approve.getStatus() != UserApproveStatus.APPROVING) {
      throw new BadRequestException("This approval request has already been processed");
    }
    approve.setStatus(UserApproveStatus.REJECTED);
    userApproveRepository.save(approve);
    return findById(id);
  }

  @Override
  @Transactional
  public BulkActionResult bulkApprove(List<Long> ids) {
    log.info("Bulk approve {} requests", ids.size());
    return executeBulk(ids, this::approve);
  }

  @Override
  @Transactional
  public BulkActionResult bulkReject(List<Long> ids) {
    log.info("Bulk reject {} requests", ids.size());
    return executeBulk(ids, this::reject);
  }

  private BulkActionResult executeBulk(List<Long> ids,
      java.util.function.Function<Long, UserApproveResponse> action) {
    List<BulkActionFailure> failures = new ArrayList<>();
    int success = 0;
    for (Long id : ids) {
      try {
        action.apply(id);
        success++;
      } catch (Exception e) {
        log.warn("Bulk action failed for id={}: {}", id, e.getMessage());
        failures.add(new BulkActionFailure(id, e.getMessage()));
      }
    }
    log.info("Bulk action done: total={}, success={}, failed={}", ids.size(), success, failures.size());
    return new BulkActionResult(ids.size(), success, failures.size(), failures);
  }

  private void applyRegister(UserApprove approve) {
    try {
//      RegisterRequest request = objectMapper.readValue(approve.getPayload(), RegisterRequest.class);
//      saveNewUser(request.username(), request.email(), request.password(), request.fullName(),
//          List.of(Role.USER));
    } catch (Exception e) {
      throw new BadRequestException("Failed to apply register: " + e.getMessage());
    }
  }

  private void applyCreate(UserApprove approve) {
    try {
//      CreateUserRequest request = objectMapper.readValue(approve.getPayload(),
//          CreateUserRequest.class);
//      saveNewUser(request.username(), request.email(), request.password(), request.fullName(),
//          request.roles() != null ? request.roles() : List.of());
    } catch (Exception e) {
      throw new BadRequestException("Failed to apply create: " + e.getMessage());
    }
  }

  private void saveNewUser(String username, String email, String password, String fullName,
      List<Role> roles) {
    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);
    user.setFullName(fullName);
    user.setRoles(roles);
    user.setStatus(UserStatus.ACTIVE);
    userRepository.save(user);
  }

  private void applyUpdate(UserApprove approve) {
    User user = getUser(approve.getUserId());
    try {
//      UpdateUserRequest request = objectMapper.readValue(approve.getPayload(),
//          UpdateUserRequest.class);
//      if (StringUtils.hasText(request.email())) {
//        user.setEmail(request.email());
//      }
//      if (StringUtils.hasText(request.fullName())) {
//        user.setFullName(request.fullName());
//      }
//      if (request.roles() != null) {
//        user.setRoles(request.roles());
//      }
      userRepository.save(user);
    } catch (Exception e) {
      throw new BadRequestException("Failed to apply update: " + e.getMessage());
    }
  }

  private void applyDelete(UserApprove approve) {
    getUser(approve.getUserId());
    userRepository.deleteById(approve.getUserId());
  }

  private void applyLock(UserApprove approve) {
    User user = getUser(approve.getUserId());
    user.setStatus(UserStatus.LOCKED);
    userRepository.save(user);
  }

  private void applyUnlock(UserApprove approve) {
    User user = getUser(approve.getUserId());
    user.setStatus(UserStatus.ACTIVE);
    user.setFailedLoginAttempts(0);
    userRepository.save(user);
  }

  private User getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      return null;
    }
    return (User) auth.getPrincipal();
  }

  private boolean isPrivilegedCurrentUser() {
    User currentUser = getCurrentUser();
    return currentUser != null && currentUser.getRoles() != null
        && (currentUser.getRoles().contains(Role.ADMIN)
            || currentUser.getRoles().contains(Role.SUPERADMIN));
  }

  private void checkAdminNotPrivilegedTarget(User target) {
    User currentUser = getCurrentUser();
    if (currentUser == null) {
      return;
    }
    boolean isAdmin = currentUser.getRoles() != null
        && currentUser.getRoles().contains(Role.ADMIN)
        && !currentUser.getRoles().contains(Role.SUPERADMIN);
    if (!isAdmin) {
      return;
    }
    boolean targetIsPrivileged = target.getRoles() != null
        && (target.getRoles().contains(Role.ADMIN)
            || target.getRoles().contains(Role.SUPERADMIN));
    if (targetIsPrivileged) {
      throw new ForbiddenException("Admin cannot perform this action on a privileged account");
    }
  }

  private void checkSuperAdminNotSelf(Long targetUserId) {
    User currentUser = getCurrentUser();
    if (currentUser == null) {
      return;
    }
    boolean isSuperAdmin = currentUser.getRoles() != null
        && currentUser.getRoles().contains(Role.SUPERADMIN);
    if (isSuperAdmin && Objects.equals(currentUser.getId(), targetUserId)) {
      throw new ForbiddenException("Superadmin cannot perform this action on their own account");
    }
  }

  private UserApprove buildApprove(Long userId, UserApproveAction action, String payload) {
    UserApprove approve = new UserApprove();
    approve.setUserId(userId);
    approve.setAction(action);
    approve.setStatus(UserApproveStatus.APPROVING);
    approve.setPayload(payload);
    return approve;
  }

  private UserApprove buildApproveForUser(Long userId, User user, UserApproveAction action,
      String payload) {
    UserApprove approve = buildApprove(userId, action, payload);
    approve.setUsername(user.getUsername());
    approve.setEmail(user.getEmail());
    approve.setFullName(user.getFullName());
    approve.setRoles(user.getRoles());
    return approve;
  }

  private UserApproveResponse saveAndFetch(UserApprove approve) {
    UserApprove saved = userApproveRepository.save(approve);
    return findById(saved.getId());
  }

  private User getUser(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("User not found"));
  }

  private UserApprove getApprove(Long id) {
    return userApproveRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("User approval request not found"));
  }
}
