declare module 'bitpay.js' {
	/** Allows you to display invoices created via https://test.bitpay.com. */
	const enableTestMode: (enable?: boolean) => void;

	/** Allows you to specify a function to be called right before the modal opens. */
	const onModalWillEnter: (customOnModalWillEnter: () => void) => void;

	/** Allows you to specify a function to be called when the user closes the modal. */
	const onModalWillLeave: (customOnModalWillLeave: () => void) => void;

	/** Displays invoice in modal. */
	const showInvoice: (invoiceId: string, params?: {animateEntrance: boolean}) => void;
}
