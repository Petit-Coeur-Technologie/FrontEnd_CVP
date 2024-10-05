import React from "react";

const SkeletonPme = () => {
    return (
        <>
            <div className="infosPME-Wrapper">
                <div className="infosPME_header animate-pulse">
                <div className="logo-pme-info bg-gray-300 h-36 w-36"></div>
                    <div className="pme-info">
                        <div className="pme-title bg-gray-300 h-8 w-1/2 mb-2"></div>
                        <div className="rating-stars bg-gray-300 h-4 w-1/3 mb-2"></div>
                        <div className="all-p">
                            <div className="pPme bg-gray-300 h-20 w-full mb-2"></div>
                            <div className="pPme bg-gray-300 h-4 w-4/5 mb-2"></div>
                            <div className="pPme bg-gray-300 h-4 w-3/4 mb-2"></div>
                            <div className="pPme bg-gray-300 h-4 w-2/3 mb-2"></div>
                        </div>
                        <div className="bg-gray-300  h-10 w-1/4 mb-2"></div>
                    </div>
                </div>

                <div className="commentaires animate-pulse">
                    {/* Commentaire 1 */}
                    <div className="comment1">
                        <div className="commentaire1">
                            <div className="comment-img1 bg-gray-300 h-12 w-12 rounded-full"></div>
                            <div className="bg-gray-300 h-6 w-1/3"></div>
                        </div>
                        <div className="ecriture bg-gray-300 h-4 w-full mb-2"></div>
                        <div className="rating-stars1 bg-gray-300 h-4 w-1/2"></div>
                        <div className="date1 bg-gray-300 h-4 w-1/4"></div>
                    </div>

                    {/* Commentaire 2 */}
                    <div className="comment1">
                        <div className="commentaire1">
                            <div className="comment-img1 bg-gray-300 h-12 w-12 rounded-full"></div>
                            <div className="bg-gray-300 h-6 w-1/3"></div>
                        </div>
                        <div className="ecriture bg-gray-300 h-4 w-full mb-2"></div>
                        <div className="rating-stars1 bg-gray-300 h-4 w-1/2"></div>
                        <div className="date1 bg-gray-300 h-4 w-1/4"></div>
                    </div>

                    {/* Commentaire 3 */}
                    <div className="comment1">
                        <div className="commentaire1">
                            <div className="comment-img1 bg-gray-300 h-12 w-12 rounded-full"></div>
                            <div className="bg-gray-300 h-6 w-1/3"></div>
                        </div>
                        <div className="ecriture bg-gray-300 h-4 w-full mb-2"></div>
                        <div className="rating-stars1 bg-gray-300 h-4 w-1/2"></div>
                        <div className="date1 bg-gray-300 h-4 w-1/4"></div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SkeletonPme;