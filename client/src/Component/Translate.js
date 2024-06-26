import React from 'react'
import { Row, Col } from 'react-bootstrap';

const Translate = ({ lyrics, translatedLyrics, isTranslated, selectedTrack, toggleTranslation }) => {
    return (
        <Row>
            <Col>
                <div className="lyrics_container">
                    <h2 className="selectedTrack-title">{selectedTrack.name}</h2>
                    <button className="translate-btn" onClick={toggleTranslation}>
                        {isTranslated ? '돌아가기' : '번역'}
                    </button>
                    <pre className='lyrics'>{isTranslated ? translatedLyrics : lyrics}</pre>
                </div>
            </Col>
        </Row>
    )
}

export default Translate