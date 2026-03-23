import {
  BaseDialog,
  BaseDialogAction,
  BaseDialogCancel,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from "@/components/ui/dialog";

type ConfirmSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export const Dialog: React.FC<ConfirmSubmitDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Submit form?",
  description = "Are you sure you want to submit this form?",
  confirmText = "Yes",
  cancelText = "No",
}) => {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <BaseDialogContent>
        <BaseDialogHeader>
          <BaseDialogTitle>{title}</BaseDialogTitle>
          <BaseDialogDescription>{description}</BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter>
          <BaseDialogCancel type="button">{cancelText}</BaseDialogCancel>
          <BaseDialogAction type="button" autoFocus onClick={onConfirm}>
            {confirmText}
          </BaseDialogAction>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  );
};
