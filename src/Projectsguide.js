import React from "react";
import img1 from './images/projectimageone.png';
import img2 from './images/projectimagetwo.png';
import img3 from './images/projectimagethree.png';
import img4 from './images/projectimagefour.png';
import img5 from './images/projectimagefive.png';
import img6 from './images/projectimagesix.png';
import img7 from './images/projectimageseven.png';
import img8 from './images/projectimageeight.png';
import img10 from './images/projectimageten.png';
import './Teammembersguide.css';  // Assuming you have a CSS file for styling

const Projectsguide = () => {
    return ( 
        <div className="guide-container2">
            <h1 className="guide-header">Complete Guide to Adding and Updating Project Pages on the Lab Website</h1>
            
            <p className="guide-paragraph">
                In this guide, you'll learn how to add, update, or remove a project page. Please note that changes to project pages will not be immediately visible because Docusaurus is a static site generator. This means the website must be rebuilt on GitHub for the changes to take effect. 
            </p>
            
            <p className="guide-paragraph">
                To resolve this, an automatic build process has been set up on GitHub. This ensures that any updates or new projects will appear on the website within a maximum of one day duration, depending on when the site is rebuilt.
            </p>

            <p className="guide-paragraph">
                Now, let's walk through the steps to add a new project page and the fields required for the page to appear correctly on the website.
            </p>

            <ol className="guide-list">
                <li>
                    First, add your project name. This will be displayed on both the individual project page and the "Research Projects" page, as shown in the images below.
                </li>
                <li>
                    Next, add the main image for your project. This image will be associated with the project name and displayed on both the project page and the project listing.
                </li>
            </ol>
            
            <div className="image-container">
                <img src={img7} alt="Project example 1" className="guide-image"/>
                <img src={img1} alt="Project example 2" className="guide-image"/>
                <img src={img6} alt="Project example 3" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Now let's focus on the page format and how data is structured within it.
            </p>
            
            <ol className="guide-list">
                <li>
                    The "title" field is where the main title of the project page will appear.
                </li>
                <li>
                    Below the title, there is an "introduction" section, as shown in the image below.
                </li>
                <li>
                    Then, you have the "type" drop-down list to select the category or section where your project will be listed.
                </li>
            </ol>

            <div className="image-container">
                <img src={img7} alt="Project format example 1" className="guide-image"/>
                <img src={img2} alt="Project format example 2" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Next, let's focus on the publication section and routing.
            </p>

            <ol className="guide-list">
                <li>
                    The "route" field defines the URL of the page. Important: format the route to match the name of your project by replacing spaces with dashes. For example, if your project is called "Project Name," the route should be "project-name-route."
                </li>
                <li>
                    Then, you can add your publications by specifying the title, link, year, and authors for each publication. The "Add Publication" button allows you to add multiple publications, and they will be sorted automatically, as shown in the images below.
                </li>
            </ol>

            <div className="image-container">
                <img src={img8} alt="Publications example 1" className="guide-image"/>
                <img src={img5} alt="Publications example 2" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Lastly, let's talk about the main content of the page. Each project page is organized using dynamic sections similar to the publication section. Each section consists of:
            </p>

            <ol className="guide-list">
                <li>
                    A title, such as "Objectives" in the image below.
                </li>
                <li>
                    An image and a paragraph field, both of which are shown in the following examples.
                </li>
            </ol>

            <div className="image-container">
                <img src={img10} alt="Project section example 1" className="guide-image"/>
                <img src={img3} alt="Project section example 2" className="guide-image"/>
            </div>

            <p className="guide-paragraph">
                Finally, you can choose to remove any of the three fields (title, image, or paragraph) in a section. You can include only an image, only a title, or only a paragraph, as shown below.
            </p>

            <div className="image-container">
                <img src={img4} alt="Field removal example" className="guide-image"/>
            </div>
        </div>
    );
}

export default Projectsguide;
