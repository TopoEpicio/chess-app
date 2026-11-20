export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-[var(--color-border)] rounded-full h-2.5">
      <div className="bg-[var(--color-primary)] h-2.5 rounded-full" style={{ width: `${progress}%` }} />
    </div>
  );
};
