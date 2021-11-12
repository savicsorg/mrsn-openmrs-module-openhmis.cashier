<%@ page import="org.openmrs.module.openhmis.cashier.web.PrivilegeWebConstants" %>
<%@ include file="/WEB-INF/template/include.jsp"%>
<%--
  ~ The contents of this file are subject to the OpenMRS Public License
  ~ Version 2.0 (the "License"); you may not use this file except in
  ~ compliance with the License. You may obtain a copy of the License at
  ~ http://license.openmrs.org
  ~
  ~ Software distributed under the License is distributed on an "AS IS"
  ~ basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
  ~ the License for the specific language governing rights and
  ~ limitations under the License.
  ~
  ~ Copyright (C) OpenHMIS.  All Rights Reserved.
  --%>
<openmrs:require allPrivileges="<%=PrivilegeWebConstants.PAYMENTSMODES_PAGE_PRIVILEDGES%>" otherwise="/login.htm" redirect="/module/openhmis/cashier/paymentModes.form" />
<%@ include file="/WEB-INF/template/header.jsp"%>
<%@ include file="template/localHeader.jsp"%>
<%@ include file="template/linksHeader.jsp"%>
<openmrs:htmlInclude file="/moduleResources/openhmis/cashier/js/screen/paymentModes.js" />

<h2>
    <spring:message code="openhmis.cashier.admin.paymentModes" />
</h2>
<%@ include file="/WEB-INF/template/footer.jsp" %>
