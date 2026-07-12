
import { useState, useRef } from "react";

function LiveAuctionGallery({ images = [], video = null, status = null }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [showVideo, setShowVideo] = useState(false);
    const imageRef = useRef(null);

    const allMedia = [
        ...images.map((src, i) => ({ type: "image", src, id: i })),
        ...(video ? [{ type: "video", src: video, id: images.length }] : []),
    ];

    const activeMedia = allMedia[activeIndex];

    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
        setIsZoomed(false);
        setShowVideo(false);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
        setIsZoomed(false);
        setShowVideo(false);
    };

    const handleThumbnailClick = (index) => {
        setActiveIndex(index);
        setIsZoomed(false);
        setShowVideo(false);
        if (allMedia[index].type === "video") setShowVideo(true);
    };

    return (
        <>
            {/* h-full so it stretches to match sibling panel height */}
            <div className="flex flex-col gap-3 h-full">

                {/* Main Viewer — flex-1 instead of aspect ratio */}
                <div className="relative w-full flex-1 min-h-80 rounded-xl overflow-hidden bg-[#0F172A] group">

                    {status === "live" && (
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#DC2626] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                        </div>
                    )}

                    {activeMedia?.type === "video" || showVideo ? (
                        <video
                            src={activeMedia.src}
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            ref={imageRef}
                            className="w-full h-full cursor-zoom-in relative overflow-hidden"
                            onClick={() => setIsZoomed((z) => !z)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <img
                                src={activeMedia?.src || "/placeholder-car.jpg"}
                                alt="Vehicle"
                                className="w-full h-full object-cover transition-transform duration-200"
                                style={
                                    isZoomed
                                        ? {
                                            transform: "scale(2.2)",
                                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                        }
                                        : {}
                                }
                            />
                            {isZoomed && (
                                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                    Click to zoom out
                                </div>
                            )}
                        </div>
                    )}

                    {allMedia.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                ‹
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                ›
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-3 right-3 bg-black/50 hover:bg-black/75 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 text-sm"
                        title="Fullscreen"
                    >
                        ⛶
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {activeIndex + 1} / {allMedia.length}
                    </div>
                </div>

                {/* Thumbnail Row */}
                {allMedia.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
                        {allMedia.map((media, index) => (
                            <button
                                key={media.id}
                                onClick={() => handleThumbnailClick(index)}
                                className={`relative shrink-0 w-20 h-14 md:w-24 md:h-17 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === index
                                        ? "border-[#D97706] scale-105"
                                        : "border-[#334155] hover:border-[#D97706]/60"
                                    }`}
                            >
                                {media.type === "video" ? (
                                    <div className="w-full h-full bg-[#0F172A] flex flex-col items-center justify-center gap-1">
                                        <span className="text-[#D97706] text-lg">▶</span>
                                        <span className="text-[#94A3B8] text-[10px]">Video</span>
                                    </div>
                                ) : (
                                    <img
                                        src={media.src}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal — unchanged */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button
                        className="absolute top-5 right-5 text-white text-2xl bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        ✕
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    >
                        ›
                    </button>
                    <img
                        src={activeMedia?.src}
                        alt="Fullscreen"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                        {allMedia.map((media, index) => (
                            <button
                                key={media.id}
                                onClick={(e) => { e.stopPropagation(); handleThumbnailClick(index); }}
                                className={`w-14 h-10 rounded overflow-hidden border-2 transition-all ${activeIndex === index ? "border-[#D97706]" : "border-white/20"
                                    }`}
                            >
                                {media.type === "video" ? (
                                    <div className="w-full h-full bg-[#1E293B] flex items-center justify-center">
                                        <span className="text-[#D97706] text-xs">▶</span>
                                    </div>
                                ) : (
                                    <img src={media.src} alt="" className="w-full h-full object-cover" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default LiveAuctionGallery;