// ConfirmDialogContainer - connects ConfirmDialog to Redux state

import { useAppSelector, useAppDispatch } from '../state/hooks';
import { hideConfirmDialog } from '../state/slices/uiSlice';
import ConfirmDialog from './ConfirmDialog';

export default function ConfirmDialogContainer() {
  const dialog = useAppSelector((state) => state.ui.confirmDialog);
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    dispatch(hideConfirmDialog());
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    dispatch(hideConfirmDialog());
  };

  return (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      title={dialog.title}
      message={dialog.message}
      confirmLabel={dialog.confirmLabel}
      cancelLabel={dialog.cancelLabel}
      variant={dialog.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
