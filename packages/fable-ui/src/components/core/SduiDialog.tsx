import {
  BaseDialog,
  BaseDialogAction,
  BaseDialogCancel,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from "@fable-ui/shared";
import { useDialog } from "@/contexts/dialog";

export const SduiDialog: React.FC = () => {
  const { config, setConfig } = useDialog();

  if (!config) {
    return null;
  }

  return (
    <BaseDialog
      open={!!config}
      onOpenChange={(open) => {
        if (!open) setConfig(null);
      }}
    >
      <BaseDialogContent>
        <BaseDialogHeader>
          <BaseDialogTitle>{config.title}</BaseDialogTitle>
          <BaseDialogDescription>{config.description}</BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter>
          {!config.hideCancel && (
            <BaseDialogCancel
              type="button"
              variant="outline"
              size="default"
              disabled={config.isPending}
              onClick={() => setConfig(null)}
            >
              {config.cancelText ?? "Cancel"}
            </BaseDialogCancel>
          )}
          <BaseDialogAction
            type="button"
            variant="default"
            size="default"
            autoFocus
            disabled={config.isPending}
            onClick={config.onConfirm}
          >
            {config.confirmText ?? "Save"}
          </BaseDialogAction>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  );
};
