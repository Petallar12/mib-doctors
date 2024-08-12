import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './Doctor.css'; // Reuse the CSS for styling
import placeholderImage from '../images/default.jpg'; // Import the placeholder image
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd, FaArrowLeft } from 'react-icons/fa'; // Import some icons

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    useEffect(() => {
        loadDoctorDetails();
    }, []);

    const loadDoctorDetails = async () => {
        const result = await axios.get(`http://localhost:5000/doctors/${id}`);
        setDoctor(result.data);
    };

    const handleImageError = (e) => {
        e.target.src = placeholderImage; // Set the placeholder image on error
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Toggle modal visibility
    };

    if (!doctor) {
        return <p>Loading...</p>; // Show loading while fetching data
    }

    return (
        <div className="doctor-detail-container">
            <div className="doctor-detail-card">
                <div className="doctor-detail-header">
                    <img 
                        className="doctor-detail-photo" 
                        src={doctor.image_url || placeholderImage} 
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

                    <button className="more-info-btn" onClick={toggleModal}>
                        More Info
                    </button>

                    <Link to="/" className="back-to-list">
                        <FaArrowLeft /> Back to List
                    </Link>
                </div>
            </div>

            {/* Modal Implementation */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={toggleModal}>&times;</span>
                        <h2>About the Doctor</h2>
                        <p>{doctor.more_info || "No additional information available."}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDetail;
