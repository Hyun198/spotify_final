import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import './Translate.style.css';

const Translate = ({ lyrics, translatedLyrics, isTranslated, selectedTrack, toggleTranslation }) => {
    const [currentLyrics, setCurrentLyrics] = useState('');

    useEffect(() => {
        const lyricsContainer = document.querySelector('.lyrics_container');

        setTimeout(() => {
            lyricsContainer.classList.add('show');
            setCurrentLyrics(isTranslated ? translatedLyrics : lyrics);
        }, 100);

        return () => {
            lyricsContainer.classList.remove('show');
        }
    }, [isTranslated, lyrics, translatedLyrics])

    return (
        <Row>
            <Col>
                <div className="lyrics_container">
                    <h2 className="selectedTrack-title">{selectedTrack.name}</h2>
                    <button className="translate-btn" onClick={toggleTranslation}>
                        {isTranslated ? '원문' : '번역'}
                    </button>
                    <pre className='lyrics'>{currentLyrics}</pre>
                </div>
            </Col>
        </Row>
    )
}

export default Translate