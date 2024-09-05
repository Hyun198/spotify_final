import React from "react";
import './Header.style.css'
const Header = ({ searchKey, setSearchKey, searchArtists }) => {
    return (
        <div className="header_container">
            <h1 className='title'><a href="/">Spotify Genius</a></h1>
            <form className="search_box" onSubmit={searchArtists}>
                <box-icon name="search-alt"></box-icon>
                <input
                    className="search-input"
                    type="text"
                    placeholder="아티스트,노래"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <button className="search-btn" type="submit">
                    검색
                </button>
            </form>
        </div>
    );
};

export default Header;
