type ForthcomingProps = {
  title: string;
  children: React.ReactNode;
};

export function Forthcoming({ title, children }: ForthcomingProps) {
  return (
    <div className="forthcoming" role="status">
      <strong>{title}</strong>
      <div className="forthcomingBody">{children}</div>
    </div>
  );
}
