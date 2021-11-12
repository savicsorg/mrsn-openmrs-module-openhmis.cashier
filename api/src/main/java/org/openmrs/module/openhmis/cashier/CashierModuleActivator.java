/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and
 * limitations under the License.
 *
 * Copyright (C) OpenHMIS.  All Rights Reserved.
 */
package org.openmrs.module.openhmis.cashier;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.BaseModuleActivator;
import org.openmrs.module.Module;
import org.openmrs.module.ModuleFactory;
import static org.openmrs.module.openhmis.cashier.ModuleSettings.PAYMENT_CASH_PATIENT_TYPE_UUID;
import static org.openmrs.module.openhmis.cashier.ModuleSettings.PAYMENT_INSURANCE_COVERAGE_PERCENTAGE_UUID;
import static org.openmrs.module.openhmis.cashier.ModuleSettings.PAYMENT_INSURANNCE_PATIENT_TYPE_UUID;
import static org.openmrs.module.openhmis.cashier.ModuleSettings.PAYMENT_MODE_CASH_UUID;
import static org.openmrs.module.openhmis.cashier.ModuleSettings.PAYMENT_MODE_INSURANCE_UUID;
import org.openmrs.module.openhmis.cashier.api.util.RoundingUtil;
import org.openmrs.module.openhmis.cashier.web.CashierWebConstants;
import org.openmrs.module.web.WebModuleUtil;

/**
 * This class contains the logic that is run every time this module is either started or stopped.
 */
public class CashierModuleActivator extends BaseModuleActivator {

	private static final Log LOG = LogFactory.getLog(CashierModuleActivator.class);
	private AdministrationService adminService;

	/**
	 * @see BaseModuleActivator#contextRefreshed()
	 */
	@Override
	public void contextRefreshed() {
		LOG.info("OpenHMIS Cashier Module Module refreshed");
	}

	/**
	 * @see BaseModuleActivator#started()
	 */
	@Override
	public void started() {

		adminService = Context.getAdministrationService();
		GlobalProperty gp;

		String property = adminService.getGlobalProperty(PAYMENT_INSURANCE_COVERAGE_PERCENTAGE_UUID);
		if (property == null || property.isEmpty()) {
			gp = new GlobalProperty(PAYMENT_INSURANCE_COVERAGE_PERCENTAGE_UUID, "");
			gp.setDescription("OpenHMIS Cashier Module, Patient insurance coverage percentage Payment attibute type uuid");
			adminService.saveGlobalProperty(gp);
		}

		property = adminService.getGlobalProperty(PAYMENT_MODE_CASH_UUID);
		if (property == null || property.isEmpty()) {
			gp = new GlobalProperty(PAYMENT_MODE_CASH_UUID, "");
			gp.setDescription("OpenHMIS Cashier Module, Cash payment mode uuid");
			adminService.saveGlobalProperty(gp);
		}

		property = adminService.getGlobalProperty(PAYMENT_MODE_INSURANCE_UUID);
		if (property == null || property.isEmpty()) {
			gp = new GlobalProperty(PAYMENT_MODE_INSURANCE_UUID, "");
			gp.setDescription("OpenHMIS Cashier Module, insurance payment mode uuid");
			adminService.saveGlobalProperty(gp);
		}

		property = adminService.getGlobalProperty(PAYMENT_CASH_PATIENT_TYPE_UUID);
		if (property == null || property.isEmpty()) {
			gp = new GlobalProperty(PAYMENT_CASH_PATIENT_TYPE_UUID, "");
			gp.setDescription("OpenHMIS Cashier Module,Cash payment patient type uuid");
			adminService.saveGlobalProperty(gp);
		}

		property = adminService.getGlobalProperty(PAYMENT_INSURANNCE_PATIENT_TYPE_UUID);
		if (property == null || property.isEmpty()) {
			gp = new GlobalProperty(PAYMENT_INSURANNCE_PATIENT_TYPE_UUID, "");
			gp.setDescription("OpenHMIS Cashier Module,Insurance payment patient type uuid");
			adminService.saveGlobalProperty(gp);
		}

		RoundingUtil.setupRoundingDeptAndItem(LOG);

		LOG.info("OpenHMIS Cashier Module Module started");

	}

	/**
	 * @see BaseModuleActivator#stopped()
	 */
	@Override
	public void stopped() {
		Module module = ModuleFactory.getModuleById(CashierWebConstants.OPENHMIS_CASHIER_MODULE_ID);
		WebModuleUtil.unloadFilters(module);

		LOG.info("OpenHMIS Cashier Module Module stopped");
	}
}
