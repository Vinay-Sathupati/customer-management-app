import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import './index.css'


const Banner = ()=> {
    return (
        <div className='banner-main-container'>
            <div className='top-styling-container'>
                <Link to="/customers-list">
                    <AiFillHome className="home-icon"/>
                </Link>
                <span className='dot red'></span>
                <span className='dot yellow'></span>
                <span className='dot green'></span>
            </div>
        </div>
    )
}

export default Banner