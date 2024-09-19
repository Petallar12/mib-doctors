import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';
import './Doctor.css'; 
import placeholderImage from '../images/default.jpg'; 
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd, FaArrowLeft } from 'react-icons/fa'; 
import Spinner from './Spinner'; 

const DoctorDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        loadDoctorDetails();
    }, []);

    const loadDoctorDetails = async () => {
        try {
            const result = await axios.get(`https://backend-doctor.vercel.app/doctors/${id}`);
            setDoctor(result.data);
        } catch (error) {
            console.error('Failed to load doctor details:', error);
        } finally {
            setLoading(false); 
        }
    };

    const handleImageError = (e) => {
        e.target.src = placeholderImage; 
    };

    if (loading) {
        return <Spinner />; 
    }

    // Get the current page from the query parameter
    const currentPage = new URLSearchParams(location.search).get('page') || 1;

    return (
        <div className="doctor-detail-container">
            <div className="doctor-detail-card">
                <div className="doctor-detail-header">
                    <img 
                        className="doctor-detail-photo" 
                        src={doctor.image_url ? `${process.env.PUBLIC_URL}/images/${doctor.image_url}` : placeholderImage} 
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
                    {doctor.address_1 && <p><FaMapMarkerAlt /> {doctor.address_1}</p>}
                    {doctor.address_2 && <p><FaMapMarkerAlt /> {doctor.address_2}</p>}
                    {doctor.address_3 && <p><FaMapMarkerAlt /> {doctor.address_3}</p>}
                    {doctor.address_4 && <p><FaMapMarkerAlt /> {doctor.address_4}</p>}
                    {doctor.email && <p><FaMapMarkerAlt /> {doctor.email}</p>} 

                    <h3>More Info</h3>
                    <p>{doctor.more_info || "No additional information available."}</p>

                    {/* Back to List link including the current page number */}
                    <Link to={`/?page=${currentPage}`} className="back-to-list" style={{ marginTop: '20px', display: 'block' }}>
                        <FaArrowLeft /> Back to List
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;
