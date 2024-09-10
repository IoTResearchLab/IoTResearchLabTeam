import React from "react";
import './Teammembersguide.css';  // Assuming you have a CSS file for styling
import img1 from './images/website-team-illustration.png';
import img2 from './images/teamwebsite-team-illustration.png';

const Teammembersguide = () => {
    return ( 
        <div className="guide-container">
            <h1 className="guide-header">Complete Guide to Adding ,Deleting and Updating Team Members on the Lab Website</h1>
            <p className="guide-paragraph">
                In this guide, you'll learn how to add, update, or remove a team member. We'll start by discussing how to add a new team member, the essential fields required, and how they appear on the website. 
            </p>

            <ol className="guide-list">
                <li>
                    In the first field, add your name. This will be the name displayed for the team member on the website.
                </li>
                <li>
                    Next, you can add your personal information, such as your current position, a brief bio, or your previous experiences.
                </li>
                <li>
                    Then, we have the "type" field (alumni, affiliate scholars, intern, none). Here, you just choose where you appear on the website, as the page automatically sorts members according to their type. If you want to appear at the top of the page, simply select "None."
                </li>
                <li>
                    After that, upload your image in the "image" field to display a profile picture on the website.
                </li>
                <li>
                    Finally, you can add a personal link for yourself, like your LinkedIn profile. This makes your name clickable, allowing people to contact you easily.
                </li>
            </ol>
            
            <div className="image-container">
                <img src={img1} alt="Screenshot of adding a team member" className="guide-image"/>
                <img src={img2} alt="Screenshot of team member list" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Secondly, you can update a team member's information by going to the "Update Team Member" page. The process is the same as adding a new member, but you will be editing the existing data instead.
            </p>

            <p className="guide-paragraph">
                Thirdly, to delete a team member, navigate to the "Update Team Member" page and click the delete button for the respective member. Please be careful, as this action is irreversible.
            </p>
        </div>
     );
}

export default Teammembersguide;
