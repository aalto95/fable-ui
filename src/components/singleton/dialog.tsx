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
import { useDialog } from "@/contexts/dialog";

export const Dialog: React.FC = () => {
  const { config, setConfig } = useDialog();

  if (!config) {
    return null;
  }

  return (
    <BaseDialog open={!!config}>
      <BaseDialogContent>
        <BaseDialogHeader>
          <BaseDialogTitle>{config.title}</BaseDialogTitle>
          <BaseDialogDescription>{config.description}</BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter>
          {!config.hideCancel && (
            <BaseDialogCancel
              type="button"
              disabled={config.isPending}
              onClick={() => setConfig(null)}
            >
              {config.cancelText ?? "Cancel"}
            </BaseDialogCancel>
          )}
          <BaseDialogAction
            type="button"
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
