import React, {useEffect} from "react";
import { useNavigate, redirect} from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";

function Textarea(){

    return (
        <div class="Home-page">
            <div class="Home-page-1">
                <div className = "homepage-svg">
                    <img src="updated.svg" alt="" />
                </div>
                <div className = "homepage-info">
                    <span>dynamic and collaborative environment similar to Google Docs, allowing users to experience real-time updates and changes as they work together on shared documents.</span>
                </div>
            </div>
            <div class="Home-page-2">
                <div className = "homepage-svg">
                    <img src="updated-2.svg" alt="" />
                </div>
                <div className = "homepage-info">
                    <span>Whether you're collaborating with colleagues, classmates, or friends, this platform seamlessly synchronizes edits, making it effortless to stay in sync and productive, just like Google Docs but tailored to your specific needs. Welcome to a new era of collaborative productivity!</span>
                </div>
            </div>
        </div>
    )
}

export default Textarea;