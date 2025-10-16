import type { PropsWithChildren } from "react";


export default function Layout({ children }: PropsWithChildren) {
return (
<div className="min-h-screen">
<div className="max-w-3xl mx-auto px-4 py-6">
{children}
</div>
</div>
);
}