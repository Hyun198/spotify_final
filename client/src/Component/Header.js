import React from 'react'

const Header = ({ searchKey, setSearchKey, searchArtists }) => {


    return (
        <div className="header_container">
            <form className="search_box" onSubmit={searchArtists} >
                <box-icon name='search-alt'></box-icon>
                <input className="search-input" type="text" placeholder='아티스트,노래' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
                <button className="search-btn" type="submit">검색</button>
            </form>
        </div>
    )
}

export default Header