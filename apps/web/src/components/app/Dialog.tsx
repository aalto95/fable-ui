import {
  BaseDialog,
  BaseDialogAction,
  BaseDialogCancel,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
  useDialog,
} from "manifest-ui";

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
