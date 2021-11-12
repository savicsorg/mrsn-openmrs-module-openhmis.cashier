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
  ~
  --%>

<%-- The links section has been designed to be consistent with other 2.x header link sections.
     As opposed to having all inventory related links, it includes breadcrumbs which link to previous pages.
--%>
<%@ page import="org.openmrs.module.openhmis.cashier.web.CashierWebConstants" %>
<%@ page import="org.openmrs.module.openhmis.cashier.web.PrivilegeWebConstants" %>
<%@ include file="/WEB-INF/template/include.jsp"%>

<ul id="breadcrumbs">
	<li>
		<a href="${pageContext.request.contextPath}/index.htm">
			<i class="glyphicon glyphicon-home small"></i>
		</a>
	</li>
	<li>
		<i class="glyphicon glyphicon-menu-right link"></i>
		<a href="${pageContext.request.contextPath}/openhmis.cashier/cashierLanding.page">
			<openmrs:message code="openhmis.cashier.page"/>
		</a>
	</li>
	<li>
		<i class="glyphicon glyphicon-menu-right link"></i>
		<a href="${pageContext.request.contextPath}/openhmis.cashier/cashier/cashierManageModule.page">
			<openmrs:message code="openhmis.cashier.manage.module" />
		</a>
	</li>
	<li>
		<i class="glyphicon glyphicon-menu-right link"></i>
		<openmrs:message code="openhmis.cashier.admin.role" />
	</li>
</ul>
