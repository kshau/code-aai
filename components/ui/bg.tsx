import type React from "react"

const AngledWavyLinesPattern: React.FC = () => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 5000 2000"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
        >
            <defs>
                <pattern
                    id="angledWavyLinesPattern"
                    patternUnits="userSpaceOnUse"
                    width="200"
                    height="200"
                    patternTransform="rotate(45)"
                >
                    <path
                        d="M-50 50 C 0 25, 50 75, 100 50 C 150 25, 200 75, 250 50 M-50 150 C 0 125, 50 175, 100 150 C 150 125, 200 175, 250 150"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.1)"
                        strokeWidth="2"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#angledWavyLinesPattern)" />
        </svg>
    )
}

export default AngledWavyLinesPattern

