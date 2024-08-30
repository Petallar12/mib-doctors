import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './Doctor.css'; // Reuse the CSS for styling
import placeholderImage from '../images/default.jpg'; // Import the placeholder image
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd, FaArrowLeft } from 'react-icons/fa'; // Import some icons

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        loadDoctorDetails();
    }, []);

    const loadDoctorDetails = async () => {
        try {
            const result = await axios.get(`https://backend-doctor.vercel.app/doctors/${id}`);
            setDoctor(result.data);
        } catch (error) {
            console.error('Failed to load doctor details:', error);
        }
    };

    const handleImageError = (e) => {
        e.target.src = placeholderImage; // Set the placeholder image on error
    };

    if (!doctor) {
        return <p>Loading...</p>; // Show loading while fetching data
    }

    // Construct the image URL with /images/ prefix or use placeholder if no image_url is present
    const imageUrl = doctor.image_url ? `/images/${doctor.image_url}` : placeholderImage;

    return (
        <div className="doctor-detail-container">
            <div className="doctor-detail-card">
                <div className="doctor-detail-header">
                    <img 
                        className="doctor-detail-photo" 
                        src={imageUrl} 
                        alt={`${doctor.name}'s Photo`} 
                        onError={handleImageError} 
                    />
                    <div className="doctor-detail-name">
                        <h2>{doctor.name}</h2>
                        <p><FaUserMd /> {doctor.speciality}</p>
                        <p><FaClinicMedical /> {doctor.clinic_name}</p>
                    </div>
                </div>
                <div className="doctor-detail-body">
                    <h3>Contact Information</h3>
                    <p><FaMapMarkerAlt /> {doctor.address_1}</p>
                    <p><FaMapMarkerAlt /> {doctor.address_2}</p>
                    <p><FaMapMarkerAlt /> {doctor.address_3}</p>
                    <p><FaMapMarkerAlt /> {doctor.address_4}</p>

                    {/* Display More Info directly above the Back to List button */}
                    <h3>More Info</h3>
                    <p>{doctor.more_info || "No additional information available."}</p>

                    <Link to="/" className="back-to-list" style={{ marginTop: '20px', display: 'block' }}>
                        <FaArrowLeft /> Back to List
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;
