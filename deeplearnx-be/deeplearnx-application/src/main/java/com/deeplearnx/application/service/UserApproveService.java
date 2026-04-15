package com.deeplearnx.application.service;

import com.deeplearnx.application.dto.request.CreateUserRequest;
import com.deeplearnx.application.dto.request.UpdateUserRequest;
import com.deeplearnx.application.dto.response.BulkActionResult;
import com.deeplearnx.application.dto.response.UserApproveResponse;
import com.deeplearnx.core.response.PageResponse;
import java.util.List;

public interface UserApproveService {

  PageResponse<UserApproveResponse> findAll(String action, String status, String createdBy,
      String fromDate, String toDate, int page, int size);

  UserApproveResponse findById(Long id);

  UserApproveResponse create(CreateUserRequest request);

  UserApproveResponse update(Long id, UpdateUserRequest request);

  UserApproveResponse delete(Long id);

  UserApproveResponse lock(Long id);

  UserApproveResponse unlock(Long id);

  UserApproveResponse approve(Long id);

  UserApproveResponse reject(Long id);

  BulkActionResult bulkApprove(List<Long> ids);

  BulkActionResult bulkReject(List<Long> ids);
}
