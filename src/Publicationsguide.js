import React from "react";
import './Teammembersguide.css';  // Assuming you have a CSS file for styling

import img1 from './images/publicationteamwebsite.png';
import img2 from './images/publicationwebsite.png';

const Publicationsguide = () => {
    return ( 
        <div className="guide-container3">
            <h1 className="guide-header">Complete Guide to Adding and Updating Publications on the Lab Website</h1>
            <p className="guide-paragraph">
                In this guide, you'll learn how to add and update a publication. We'll start by explaining how to add a new publication, what fields are required, and how they appear on the website.
            </p>

            <ol className="guide-list">
                <li>
                    In the first field, add the publication name. This will be the name displayed for the publication on the website, such as <strong>"Incremental Adversarial Learning for Polymorphic Attack Detection"</strong> in the image below.
                </li>
                <li>
                    Next, add the publication link.
                </li>
                <li>
                    Then, fill in the authors field. It will appear like <strong>"Authors: U Sabeel, SS Heydari, K El-Khatib, K Elgazzar"</strong>.
                </li>
                <li>
                    After that, add the publisher, which will appear like <strong>"IEEE Transactions on Machine Learning in Communications and Networking, 2024"</strong>.
                </li>
                <li>
                    Finally, add the year of publication. This field is primarily used for sorting.
                </li>
            </ol>
            
            <div className="image-container">
                <img src={img1} alt="Screenshot of adding a publication" className="guide-image"/>
                <img src={img2} alt="Screenshot of publication list" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Secondly, you can update a publication's information by going to the "Update Publication" page. The process is similar to adding a new publication, but you will be editing the existing data.
            </p>
        </div>
     );
}

export default Publicationsguide;
