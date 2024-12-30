// ThreeDots component
export function ThreeDots() {
    return (
        <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full animate-loading-dot" />
            <div className="w-1 h-1 bg-black rounded-full animate-loading-dot delay-200" />
            <div className="w-1 h-1 bg-black rounded-full animate-loading-dot delay-300" />
        </div>
    );
}

export function LoadingPage(){
    return (
        <div className="w-screen h-screen flex justify-center items-center">
        <ThreeDots />
      </div>
    );
}