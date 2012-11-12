curl(
	{ baseUrl: openhmis.config.wwwUrlRoot + 'js/' },
	[
		'lib/jquery',
		'view/patient',
		'lib/i18n',
		'view/bill',
		'view/payment',
		'model/lineItem'
	],
	function($, openhmis, __) {
		var billUuid = openhmis.getQueryStringParameter("billUuid");
		var patientUuid = openhmis.getQueryStringParameter("patientUuid");
		
		var patientView = new openhmis.PatientView();
		// Set up patient search selection handler
		openhmis.doSelectionHandler = patientView.takeRawPatient;
		
		var billView;

		// Callback in case we need to load a bill or patient first		
		var displayBillView = function(billView, patientView) {
			$(document).ready(function() {
				// Easy access to status enumeration
				var BillStatus = billView.bill.BillStatus;
				
				// Automatic receipt printing
				if (openhmis.getQueryStringParameter("print") === "true")
					billView.printReceipt();
				
				// Patient View
				if (billView.bill.get("status") !== BillStatus.PENDING)
					patientView.readOnly = true;
				patientView.setElement($('#patient-view'));
				patientView.render();
				
				billView.on("save paid adjusted", function(bill) {
					window.location = openhmis.config.pageUrlRoot + 'bill.form?billUuid=' + bill.id;
				});
				billView.on("saveAndPrint", function(bill) {
					var url = openhmis.config.pageUrlRoot + 'bill.form?billUuid=' + bill.id;
					url = openhmis.addQueryStringParameter(url, "print=true");
					window.location = url;
				});
				billView.setElement($('#bill'));
				billView.render();
				
				$saveButton = $('#saveBill');
				$printButton = $("#printReceipt");
				switch (billView.bill.get("status")) {
					case BillStatus.PENDING:
						$saveButton.val(__("Save Bill"));
						$saveButton.click(function() { billView.saveBill() });
						$printButton.val(__("Save & Print"));
						$printButton.click(function() { billView.saveBill({ print: true }) });
						$printButton.show();
						break;
					case BillStatus.PAID:
						$saveButton.val(__("Adjust Bill"));
						$saveButton.click(function() { billView.adjustBill() });
						$printButton.show();
						$printButton.click(billView.printReceipt);
						break;
					case BillStatus.ADJUSTED:
						$saveButton.remove();
						break;
				}
				
				if (billView.bill.get("status") === BillStatus.PENDING)
					billView.setupNewItem();
				
				patientView.on('selected', billView.patientSelected);
				patientView.on('editing', billView.blur);
				
				// Payment View
				var readOnly = billView.bill.get("status") !== BillStatus.PENDING;
				var paymentView = new openhmis.PaymentView({
					paymentCollection: billView.bill.get("payments"),
					processCallback: billView.processPayment,
					readOnly: readOnly
				});
				// Disable add event when the bill is saving to prevent
				// unsettling page drawing
				billView.on("save", function() { paymentView.model.off("add"); });
				paymentView.paymentCollection.on("remove", billView.updateTotals);
				paymentView.setElement($('#payment'));
				paymentView.render();
				
				window.onbeforeunload = function() {
					if (billView.bill.isUnsaved())
						return __("There are unsaved changes.");
					return null;
				}
				
				if (billView.bill.get("patient"))
					billView.focus();
				else
					$('#inputNode').focus();
			});			
		}
		
		// If a bill is specified
		if (billUuid) {
			// Load the bill
			var bill = new openhmis.Bill({ uuid: billUuid });
			bill.fetch({ silent: true, success: function(bill, resp) {
				billView = new openhmis.BillView({ bill: bill });
				patientView.model = new openhmis.Patient(bill.get("patient"));
				displayBillView(billView, patientView);
			}});
		}
		// If a patient is specified
		else if (patientUuid) {
			var patient = new openhmis.Patient({ uuid: patientUuid });
			patient.fetch({ silent: true, success: function(patient, resp) {
				billView = new openhmis.BillView();
				billView.bill.set("patient", patient);
				patientView.model = patient;
				displayBillView(billView, patientView);				
			}});
		}
		else {
			billView = new openhmis.BillView();
			displayBillView(billView, patientView);
		}
	}
);
