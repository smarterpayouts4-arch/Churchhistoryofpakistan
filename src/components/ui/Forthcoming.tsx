type ForthcomingProps = {
  title: string;
  children: React.ReactNode;
};

export function Forthcoming({ title, children }: ForthcomingProps) {
  return (
    <div className="forthcoming" role="status">
      <strong>{title}</strong>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </div>
  );
}
