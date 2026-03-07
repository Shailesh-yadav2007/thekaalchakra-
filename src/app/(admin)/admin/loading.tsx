import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-3 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            <p className="font-medium">Loading...</p>
        </div>
    );
}
