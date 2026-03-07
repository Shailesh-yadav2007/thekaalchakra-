import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-3 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <p className="font-medium animate-pulse">Loading...</p>
        </div>
    );
}
