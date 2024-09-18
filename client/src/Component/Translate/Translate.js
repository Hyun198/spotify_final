import React, { useEffect, useState, useRef } from 'react'
import './Translate.style.css';

const Translate = ({ lyrics, translatedLyrics, isTranslated, selectedTrack, toggleTranslation }) => {
    const [currentLyrics, setCurrentLyrics] = useState('');
    const lyricsContainerRef = useRef(null);
    useEffect(() => {


        setTimeout(() => {
            if (lyricsContainerRef.current) {
                lyricsContainerRef.current.classList.add('show');
                setCurrentLyrics(isTranslated ? translatedLyrics : lyrics);
            }
        }, 100); //가사에 약간의 애니메이션 부여

    }, [isTranslated, lyrics, translatedLyrics])

    return (
        <div>
            <div>
                <div ref={lyricsContainerRef} className="lyrics_container">
                    <h2 className="selectedTrack-title">{selectedTrack.name}</h2>
                    <button className="translate-btn" onClick={toggleTranslation}>
                        {isTranslated ? '원문' : '번역'}
                    </button>
                    <pre className='lyrics'>{currentLyrics}</pre>
                </div>
            </div>
        </div>
    )
}

export default Translate