public void exportReportContractIssuanceForManager(
    String contractNumber,
    String legalId,
    String dao,
    String branch,
    String fromDate,
    String toDate,
    HttpServletResponse response
) throws Exception {

  Map<String, String> dateMap = null;

  // Validate điều kiện tìm kiếm
  if (DataUtils.isNullOrEmpty(contractNumber)
      && DataUtils.isNullOrEmpty(legalId)
      && DataUtils.isNullOrEmpty(dao)
      && DataUtils.isNullOrEmpty(branch)) {

    if (DataUtils.isNullOrEmpty(fromDate) && DataUtils.isNullOrEmpty(toDate)) {
      throw new Exception("Cần điền ít nhất 1 điều kiện tìm kiếm");

    } else if (DataUtils.isNullOrEmpty(fromDate) || DataUtils.isNullOrEmpty(toDate)) {
      throw new Exception("Điều kiện tìm kiếm Từ ngày/ Đến ngày không được để trống");

    } else {
      dateMap = setDateSearch(fromDate, toDate);
      fromDate = dateMap.get("fromDate");
      toDate = dateMap.get("toDate");
    }
  }

  // Lấy thông tin user
  KeyRedisLoginDTO keyData = getKeyRedisLoginDTO();
  List<Long> listStaffIds = keyData.getListIdStaffAia();

  if (!DataUtils.isNullOrEmpty(listStaffIds)) {
    listStaffIds.add(keyData.getId());
  }

  // Tạo tên file
  String fileName = DateUtils.dateToString(new Date(), "yyyyMMdd")
      + "_BAO_CAO_DANH_SACH_HOP_DONG_PHAT_HANH.xlsx";

  // Setup response
  response.setContentType(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  response.setHeader(
      "Content-Disposition",
      "attachment; filename=" + fileName
  );

  // Build SQL
  DynamicSqlBuilder sql = contractIssuanceSql.getExportContractIssuance(
      contractNumber,
      legalId,
      dao,
      branch,
      keyData.getListBranchAia(),
      listStaffIds,
      fromDate,
      toDate
  );

  AtomicInteger stt = new AtomicInteger(1);
  boolean isBanca = "BANCAS_HO".equals(keyData.getRoleAia());

  // Export Excel
  exporter.export(
      resourcePath + TEMPLATE_EXPORT_CONTRACT_ISSUANCE,
      4,
      sql.getSql().toString(),
      sql.getParams(),
      new ContractIssuanceExportMapper(),

      (excel, dto) -> excel.writeRow(
          stt.getAndIncrement(),
          dto.region(),
          dto.area(),
          dto.branch(),
          dto.branchName(),
          dto.contractNumber(),
          dto.customerName(),
          isBanca
              ? dto.customerLegalId()
              : StringUtils.maskDataSensitive(dto.customerLegalId()),
          dto.anpFee(),
          dto.fypFee(),
          dto.act3pPrem(),
          dto.staffCode(),
          dto.staffName(),
          dto.dao(),
          dto.contractStatus(),
          dto.issuanceDate(),
          dto.effectDate(),
          dto.leadSource(),
          dto.leadId(),
          dto.daoBanca(),
          dto.rlosCode()
      ),

      response.getOutputStream(),
      dateMap == null ? null : dateMap.get("fromDateSearch"),
      dateMap == null ? null : dateMap.get("toDateSearch")
  );
}